import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CaffeeService } from '../services';

@Controller('api/caffee')
export class CaffeeController {
  constructor(private readonly caffeeService: CaffeeService) {}

  @Post('loyalty-card/create')
  async createLoyaltyCard(@Body() body: { sender: string; imageUrl: string }) {
    return this.caffeeService.createLoyaltyCard(body.sender, body.imageUrl);
  }

  @Post('stamp/add')
  async addStamp(@Body() body: { sender: string; cardId: string; newImageUrl: string }) {
    return this.caffeeService.addStamp(body.sender, body.cardId, body.newImageUrl);
  }

  @Post('coffee/buy')
  async buyCoffee(@Body() body: { sender: string; cardId: string; coinId: string; coinType?: string }) {
    return this.caffeeService.buyCoffee(body.sender, body.cardId, body.coinId, body.coinType);
  }

  @Post('coffee/redeem')
  async redeemFreeCoffee(@Body() body: { sender: string; cardId: string }) {
    return this.caffeeService.redeemFreeCoffee(body.sender, body.cardId);
  }

  @Post('config/update')
  async updateConfig(@Body() body: { sender: string; newPrice: number; newTreasury: string }) {
    return this.caffeeService.updateConfig(body.sender, body.newPrice, body.newTreasury);
  }

  @Get('loyalty-card/:cardId')
  async getLoyaltyCardInfo(@Param('cardId') cardId: string) {
    return this.caffeeService.getLoyaltyCardInfo(cardId);
  }

  @Get('config')
  async getCafeConfig() {
    return this.caffeeService.getCafeConfig();
  }

  @Post('transaction/execute')
  async executeTransaction(@Body() body: { digest: string; signature: string }) {
    return this.caffeeService['suiService'].executeSponsoredTransaction(body.digest, body.signature);
  }
}
