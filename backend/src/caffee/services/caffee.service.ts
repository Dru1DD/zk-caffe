import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SuiService } from '../../sui/services';
import { createLoyaltyCardTx, addStampTx, buyCoffeeTx, redeemFreeCoffeeTx, updateConfigTx } from '../utils';

@Injectable()
export class CaffeeService {
  private readonly logger = new Logger(CaffeeService.name);
  private readonly packageId: string;
  private readonly cafeConfigId: string;
  private readonly clockId = '0x6';

  constructor(
    private readonly suiService: SuiService,
    private readonly configService: ConfigService,
  ) {
    this.packageId = configService.get<string>('PACKAGE_ID');
    this.cafeConfigId = configService.get<string>('CAFE_CONFIG_ID');
  }

  async createLoyaltyCard(sender: string, imageUrl: string) {
    const tx = createLoyaltyCardTx(this.packageId, imageUrl);
    return await this.suiService.createSponsoredTransaction(tx, sender, [
      `${this.packageId}::caffee::create_loyalty_card`,
    ]);
  }

  async addStamp(sender: string, cardId: string, newImageUrl: string) {
    const tx = addStampTx(this.packageId, cardId, this.cafeConfigId, newImageUrl, this.clockId);
    return this.suiService.createSponsoredTransaction(tx, sender, [`${this.packageId}::caffee::add_stamp`]);
  }

  async buyCoffee(sender: string, cardId: string, coinId: string, coinType: string = '0x2::sui::SUI') {
    const tx = buyCoffeeTx(this.packageId, cardId, this.cafeConfigId, coinId, coinType, this.clockId);
    return this.suiService.createSponsoredTransaction(tx, sender, [`${this.packageId}::caffee::buy_coffee`]);
  }

  async redeemFreeCoffee(sender: string, cardId: string) {
    const tx = redeemFreeCoffeeTx(this.packageId, cardId, this.clockId);
    return this.suiService.createSponsoredTransaction(tx, sender, [`${this.packageId}::caffee::redeem_free_coffee`]);
  }

  async updateConfig(sender: string, newPrice: number, newTreasury: string) {
    const tx = updateConfigTx(this.packageId, this.cafeConfigId, newPrice, newTreasury);
    return this.suiService.createSponsoredTransaction(tx, sender, [`${this.packageId}::caffee::update_config`]);
  }

  async getLoyaltyCardInfo(cardId: string) {
    try {
      const client = this.suiService.getSuiClient();
      const object = await client.getObject({
        id: cardId,
        options: { showContent: true },
      });

      if (object.data?.content?.dataType === 'moveObject') {
        return object.data.content.fields;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching card info: ${error.message}`);
      throw error;
    }
  }

  async getCafeConfig() {
    try {
      const client = this.suiService.getSuiClient();
      const object = await client.getObject({
        id: this.cafeConfigId,
        options: { showContent: true },
      });

      if (object.data?.content?.dataType === 'moveObject') {
        return object.data.content.fields;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching cafe config: ${error.message}`);
      throw error;
    }
  }
}
