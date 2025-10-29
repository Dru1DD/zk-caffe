import { Module } from '@nestjs/common';
import { CaffeeService } from './services';
import { CaffeeController } from './controllers';
import { SuiModule } from '../sui/sui.module';

@Module({
    imports: [SuiModule],
    controllers: [CaffeeController],
    providers: [CaffeeService],
})
export class CaffeeModule { }
