import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnokiClient } from '@mysten/enoki';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toBase64 } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';

@Injectable()
export class SuiService {
  private readonly logger = new Logger(SuiService.name);
  private readonly suiClient: SuiClient;
  private readonly enokiClient: EnokiClient;

  constructor(private configService: ConfigService) {
    this.suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
    this.enokiClient = new EnokiClient({
      apiKey: this.configService.get<string>('ENOKI_PRIVATE_KEY')!,
    });
  }

  async createSponsoredTransaction(
    transaction: Transaction,
    sender: string,
    allowedMoveCallTargets: string[],
    allowedAddresses?: string[],
  ) {
    try {
      const txBytes = await transaction.build({
        client: this.suiClient,
        onlyTransactionKind: true,
      });

      const sponsored = await this.enokiClient.createSponsoredTransaction({
        network: 'testnet',
        transactionKindBytes: toBase64(txBytes),
        sender,
        allowedMoveCallTargets,
        ...(allowedAddresses && { allowedAddresses }),
      });

      return sponsored;
    } catch (error) {
      this.logger.error('Failed to create sponsored transaction', error);
      throw error;
    }
  }

  async executeSponsoredTransaction(digest: string, signature: string) {
    try {
      const result = await this.enokiClient.executeSponsoredTransaction({
        digest,
        signature,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to execute sponsored transaction', error);
      throw error;
    }
  }

  getSuiClient(): SuiClient {
    return this.suiClient;
  }
}
