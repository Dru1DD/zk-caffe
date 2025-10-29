import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSignTransaction } from '@mysten/dapp-kit';
import { createLoyaltyCardAPI, executeTransactionAPI } from '@/lib/api';
import styles from './home.module.scss';
import SharedLoyaltyCards from '@/components/shared-loyalty-card/shared-loyalty-card';

const IMAGES = [
  'https://i.imgur.com/a/7Zq1yqt',
  'https://i.imgur.com/a/7BU1M1R',
  'https://i.imgur.com/a/Fw0mytR',
  'https://i.imgur.com/a/93ldvgg',
  'https://i.imgur.com/a/a0EJisA',
  'https://i.imgur.com/a/XF2fS0R',
  'https://i.imgur.com/a/6gH7zFT',
  'https://i.imgur.com/a/g6gHNXl',
  'https://i.imgur.com/a/mgBfCom',
];

const HomePage = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();

  const createLoyaltyCard = async () => {
    if (!account) return;

    const sponsored = await createLoyaltyCardAPI(account.address, IMAGES[0]);
    const { signature } = await signTransaction({ transaction: sponsored.bytes });
    await executeTransactionAPI(sponsored.digest, signature);

    alert('✅ Loyalty card created successfully!');
  };

  return (
    <div className={styles.homePage}>
      <span>This is a home page</span>
      <span>Connected account: {account?.address}</span>

      <div className={styles.actions}>
        <button onClick={createLoyaltyCard}>Create Loyalty Card</button>
      </div>

      <SharedLoyaltyCards />
    </div>
  );
};

export default HomePage;
