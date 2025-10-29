import { Transaction } from '@mysten/sui/transactions';

export function createLoyaltyCardTx(packageId: string, imageUrl: string) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::caffee::create_loyalty_card`,
    arguments: [tx.pure.string(imageUrl)],
  });
  return tx;
}

export function addStampTx(
  packageId: string,
  cardId: string,
  cafeConfigId: string,
  newImageUrl: string,
  clockId: string = '0x6',
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::caffee::add_stamp`,
    arguments: [tx.object(cardId), tx.object(cafeConfigId), tx.pure.string(newImageUrl), tx.object(clockId)],
  });
  return tx;
}

export function buyCoffeeTx(
  packageId: string,
  cardId: string,
  cafeConfigId: string,
  coinId: string,
  coinType: string,
  clockId: string = '0x6',
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::caffee::buy_coffee`,
    typeArguments: [coinType],
    arguments: [tx.object(cardId), tx.object(cafeConfigId), tx.object(coinId), tx.object(clockId)],
  });
  return tx;
}

export function redeemFreeCoffeeTx(packageId: string, cardId: string, clockId: string = '0x6') {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::caffee::redeem_free_coffee`,
    arguments: [tx.object(cardId), tx.object(clockId)],
  });
  return tx;
}

export function updateConfigTx(packageId: string, cafeConfigId: string, newPrice: number, newTreasury: string) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::caffee::update_config`,
    arguments: [tx.object(cafeConfigId), tx.pure.u64(newPrice), tx.pure.address(newTreasury)],
  });
  return tx;
}
