import { Module } from '@nestjs/common';
import { SuiService } from './services';

@Module({
  providers: [SuiService],
  exports: [SuiService],
})
export class SuiModule {}
