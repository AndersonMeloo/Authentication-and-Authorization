import { Global, Module } from '@nestjs/common';
import { CalsAbilityService } from './cals-ability/cals-ability.service';

@Global()
@Module({
  providers: [CalsAbilityService],
  exports: [CalsAbilityService],
})
export class CalsModule {}
