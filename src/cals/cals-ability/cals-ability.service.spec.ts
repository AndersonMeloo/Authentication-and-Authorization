import { Test, TestingModule } from '@nestjs/testing';
import { CalsAbilityService } from './cals-ability.service';

describe('CalsAbilityService', () => {
  let service: CalsAbilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalsAbilityService],
    }).compile();

    service = module.get<CalsAbilityService>(CalsAbilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
