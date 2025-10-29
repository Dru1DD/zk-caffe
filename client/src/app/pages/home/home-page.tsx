import { useCurrentAccount } from '@mysten/dapp-kit';

import styles from './home.module.scss';

const HomePage = () => {
  const account = useCurrentAccount();

  return (
    <div className={styles.homePage}>
      <span>This is a home page</span>
      <span>Connected account: {account?.address}</span>
    </div>
  );
};

export default HomePage;
