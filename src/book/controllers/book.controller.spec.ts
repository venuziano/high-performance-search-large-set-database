import { Test, TestingModule } from '@nestjs/testing';
import { DepositController } from './book.controller';

describe('DepositController', () => {
  let controller: DepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositController],
    }).compile();

    controller = module.get<DepositController>(DepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
