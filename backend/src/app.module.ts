import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger';
import { SuiModule } from './sui';
import { CaffeeModule } from './caffee';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useClass: LoggerService,
    }),
    SuiModule,
    CaffeeModule,
  ],
})
export class AppModule {}
