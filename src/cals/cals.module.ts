import { Module } from '@nestjs/common';
import { CalsAbilityService } from './cals-ability/cals-ability.service';

@Module({
  providers: [CalsAbilityService],
})
export class CalsModule {}
