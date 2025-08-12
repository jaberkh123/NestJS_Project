// src/signals/signals.service.spec.ts
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SignalsService } from './signals.service';

describe('SignalsService', () => {
  let service: SignalsService;
  const modelMock = {
    create: jest.fn(async (dto) => ({ _id: 'id1', ...dto })),
    find: jest.fn(() => ({ sort: () => ({ limit: () => ({ skip: () => ({ lean: () => [] }) }) }) })),
    findById: jest.fn(() => ({ lean: () => ({ _id: 'id1' }) })),
    findByIdAndUpdate: jest.fn(() => ({ lean: () => ({ _id: 'id1', updated: true }) })),
    findByIdAndDelete: jest.fn(() => ({ lean: () => ({ ok: 1 }) })),
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        SignalsService,
        { provide: getModelToken('Signal'), useValue: modelMock },
      ],
    }).compile();
    service = mod.get(SignalsService);
    jest.clearAllMocks();
  });

  it('create() should save dto', async () => {
    const dto = { deviceId: 'd1', time: 1, dataLength: 3, dataVolume: 100 };
    const res = await service.create(dto as any);
    expect(modelMock.create).toHaveBeenCalledWith(dto);
    expect(res._id).toBe('id1');
  });

  it('findAll() should apply defaults', async () => {
    await service.findAll({}, 50, 0);
    expect(modelMock.find).toHaveBeenCalled();
  });

  it('remove() should delete by id', async () => {
    await service.remove('id1');
    expect(modelMock.findByIdAndDelete).toHaveBeenCalledWith('id1');
  });
});
