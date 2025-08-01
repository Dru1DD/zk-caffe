import { useNavigate } from 'react-router';
import useCopy from '@/hooks/use-copy';
import { useAccount, useDisconnect } from 'wagmi';
import { Copy, CopyCheck, LogOut } from 'lucide-react';
import { formatAddress } from '@/utils/address';
import styles from './wallet-info.module.scss';

const WalletInfo = () => {
  const { isCopied, copyToClipboard } = useCopy();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const navigate = useNavigate();

  const handleDisconnectClicked = () => {
    disconnect();

    navigate('/login');
  };

  const handleCopyClicked = () => {
    copyToClipboard(address!);
  };

  return (
    <div className={styles.walletInfo}>
      <span>{formatAddress(address!)}</span>
      <div className={styles.iconWrapper}>
        {isCopied ? (
          <CopyCheck className={styles.icon} />
        ) : (
          <Copy onClick={handleCopyClicked} className={styles.icon} size={24} />
        )}
        <LogOut onClick={handleDisconnectClicked} className={styles.icon} />
      </div>
    </div>
  );
};

export default WalletInfo;
