import { Test, TestingModule } from '@nestjs/testing';
import { DepositService } from './book.service';

describe('DepositService', () => {
  let service: DepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositService],
    }).compile();

    service = module.get<DepositService>(DepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
