import { useConnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { useNavigate } from 'react-router';
import {
  toPasskeyValidator,
  toWebAuthnKey,
  WebAuthnMode,
  PasskeyValidatorContractVersion,
  KernelValidator,
} from '@zerodev/passkey-validator';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { getEntryPoint, KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from '@zerodev/sdk';
import styles from './wallet-connect.module.scss';

const PASSKEY_SERVER_URL = import.meta.env.VITE_PASSKEY_SERVER_URL || '';
const ZERODEV_RPC = import.meta.env.VITE_ZERODEV_RPC || '';

const publicClient = createPublicClient({
  transport: http(ZERODEV_RPC),
  chain: arbitrumSepolia,
});
const entryPoint = getEntryPoint('0.7');

let kernelAccount;
let kernelClient;

const WalletConnect = () => {
  const { connect } = useConnect();

  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    connect({
      connector: metaMask(),
    });

    navigate('/home');
  };

  const handleRegisterClicked = async () => {
    if (!PASSKEY_SERVER_URL || !ZERODEV_RPC) {
      return null;
    }

    const webAuthnKey = await toWebAuthnKey({
      passkeyName: 'User1234',
      passkeyServerUrl: PASSKEY_SERVER_URL,
      mode: WebAuthnMode.Register,
      passkeyServerHeaders: {},
    });

    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint,
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    });

    await createAccountAndClient(passkeyValidator);
  };

  const handleLoginClick = async () => {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: 'User1234',
      passkeyServerUrl: PASSKEY_SERVER_URL,
      mode: WebAuthnMode.Login,
      passkeyServerHeaders: {},
    });

    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint,
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    });

    await createAccountAndClient(passkeyValidator);
  };

  const createAccountAndClient = async (passkeyValidator: KernelValidator<string> | undefined) => {
    try {
      kernelAccount = await createKernelAccount(publicClient, {
        plugins: {
          sudo: passkeyValidator,
        },
        entryPoint,
        kernelVersion: KERNEL_V3_1,
      });

      kernelClient = createKernelAccountClient({
        account: kernelAccount,
        chain: arbitrumSepolia,
        bundlerTransport: http(ZERODEV_RPC),
        client: publicClient,
        paymaster: {
          getPaymasterData: (userOperation) => {
            const zerodevPaymaster = createZeroDevPaymasterClient({
              chain: arbitrumSepolia,
              transport: http(ZERODEV_RPC),
            });
            return zerodevPaymaster.sponsorUserOperation({
              userOperation,
            });
          },
        },
      });

      console.log('*****');
      console.log('Kernel address', kernelAccount.address);
      console.log('*****');
    } catch (error) {
      console.log('Error in createAccountAndClient', (error as Error).message);
    }
  };

  return (
    <div className={styles.component}>
      <button onClick={handleWalletConnect}>Wallet Connect</button>
      <button onClick={handleLoginClick}>Login into account</button>
      <button onClick={handleRegisterClicked}>Register account</button>
    </div>
  );
};

export default WalletConnect;
