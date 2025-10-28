import ScrollIndicator from '@main/components/scroll-indicator';
import WalletConnect from '@/components/wallet-connect/wallet-connect';
import styles from './main-page.module.scss';

const MainPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.first}>
        <div className={styles.header}>
          <h2 className={styles.name}>ZkCaffé</h2>
        </div>

        <h1 className={styles.title}>Example how connect blockchain with real business</h1>

        <ScrollIndicator />
      </div>
      <div className={styles.stepsContainer}>
        <h1>Few simple steps:</h1>
        <WalletConnect />
      </div>
    </div>
  );
};

export default MainPage;
