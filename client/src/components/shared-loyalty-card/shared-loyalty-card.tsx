import { useState } from 'react';
import { useCurrentAccount, useSuiClientQuery, useSignTransaction, useSuiClient } from '@mysten/dapp-kit';
import { motion } from 'framer-motion';
import { addStampAPI, buyCoffeeAPI, redeemFreeCoffeeAPI, executeTransactionAPI } from '@/lib/api';
import { useNetworkVariable } from '@/lib/networkConfig';
import { fetchSuiCoins, findSuitableCoin, suiToMist } from '@/utils/coins';
import styles from './shared-loyalty-card.module.css';

type LoyaltyCardFields = {
  owner: string;
  stamps_count: number;
  free_coffees_earned: number;
  image_url: string;
};

function hasFields(content: unknown): content is { fields: LoyaltyCardFields } {
  return !!content && typeof content === 'object' && 'fields' in (content as Record<string, unknown>);
}

export default function SharedLoyaltyCards() {
  const account = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable('packageId');

  const [isProcessing, setIsProcessing] = useState<{ [id: string]: boolean }>({});

  const { data: ownedObjects, isPending: loadingCards } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: {
        StructType: `${packageId}::caffee::LoyaltyCard`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!packageId && !!account?.address,
    },
  );

  const loyaltyCards = (ownedObjects?.data ?? [])
    .map((obj) => {
      const objectId = obj.data?.objectId;
      const contentUnknown = obj.data?.content as unknown;
      const fields = hasFields(contentUnknown) ? contentUnknown.fields : undefined;
      if (!objectId || !fields) return null;
      return { id: objectId, fields };
    })
    .filter((x): x is { id: string; fields: LoyaltyCardFields } => x !== null);

  const handleAction = async (type: 'stamp' | 'buy' | 'redeem', cardId: string, currentStamps = 0) => {
    if (!account) return;
    setIsProcessing((p) => ({ ...p, [cardId]: true }));

    try {
      let sponsored;
      if (type === 'stamp') {
        const newImageUrl = `https://i.imgur.com/${
          [
            '7Zq1yqt.png',
            '7BU1M1R.png',
            'Fw0mytR.png',
            '93ldvgg.png',
            'a0EJisA.png',
            'XF2fS0R.png',
            '6gH7zFT.png',
            'g6gHNXl.png',
            'mgBfCom.png',
          ][currentStamps % 9]
        }`;
        sponsored = await addStampAPI(account.address, cardId, newImageUrl);
      } else if (type === 'buy') {
        const suiCoins = await fetchSuiCoins(suiClient, account.address);
        const requiredAmount = suiToMist(1); // 1 SUI = 1 coffee
        const suitableCoin = findSuitableCoin(suiCoins, requiredAmount);
        if (!suitableCoin) {
          throw new Error('Not enought tokens');
        }
        sponsored = await buyCoffeeAPI(account.address, cardId, suitableCoin.coinObjectId);
      } else {
        sponsored = await redeemFreeCoffeeAPI(account.address, cardId);
      }

      const { signature } = await signTransaction({ transaction: sponsored.bytes });
      await executeTransactionAPI(sponsored.digest, signature);

      alert(`✅ ${type === 'stamp' ? 'Stamp added!' : type === 'buy' ? 'Coffee bought!' : 'Free coffee redeemed!'}`);
    } catch (err) {
      console.error('Action failed:', err);
      alert('❌ Action failed: ' + (err as Error).message);
    } finally {
      setIsProcessing((p) => ({ ...p, [cardId]: false }));
    }
  };

  if (loadingCards) {
    return (
      <div className={styles.card}>
        <p className={styles.text}>☕ Loading loyalty cards...</p>
      </div>
    );
  }

  if (!loyaltyCards || loyaltyCards.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.text}>No shared loyalty cards found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>☕ Shared Loyalty Cards ({loyaltyCards.length})</h2>

      <div className={styles.grid}>
        {loyaltyCards.map(({ id, fields }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <img
                  className={styles.image}
                  referrerPolicy="no-referrer"
                  width={100}
                  height={100}
                  src={fields.image_url}
                  alt="Loyalty Card"
                />

                <div className={styles.meta}>
                  <p className={styles.owner}>
                    Owner: {fields.owner.slice(0, 6)}...{fields.owner.slice(-4)}
                  </p>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>Stamps: {fields.stamps_count}</span>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>
                    Free Coffees: {fields.free_coffees_earned}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.button} ${styles.primary}`}
                    disabled={isProcessing[id]}
                    onClick={() => handleAction('stamp', id, fields.stamps_count)}
                  >
                    Add Stamp
                  </button>

                  <button
                    className={`${styles.button} ${styles.warning}`}
                    disabled={isProcessing[id]}
                    onClick={() => handleAction('buy', id)}
                  >
                    Buy Coffee
                  </button>

                  <button
                    className={`${styles.button} ${styles.success}`}
                    disabled={isProcessing[id]}
                    onClick={() => handleAction('redeem', id)}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
