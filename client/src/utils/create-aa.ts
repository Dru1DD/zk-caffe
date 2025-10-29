/* eslint-disable @typescript-eslint/no-explicit-any */
import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient, KernelValidator } from "@zerodev/sdk";
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

const ZERODEV_RPC = import.meta.env.VITE_ZERODEV_RPC || '';
const entryPoint = getEntryPoint('0.7');

let kernelAccount: any;
let kernelClient: any;

const publicClient = createPublicClient({
    transport: http(ZERODEV_RPC),
    chain: arbitrumSepolia,
});


export const createAccountAndClient = async (passkeyValidator: KernelValidator<string> | undefined) => {
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
};
