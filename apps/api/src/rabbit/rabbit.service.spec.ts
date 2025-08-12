import { RabbitService } from './rabbit.service';

describe('RabbitService.handleMessage', () => {
  it('parses payload and saves', async () => {
    const signalsMock = { create: jest.fn(async () => ({})) } as any;
    const svc = new RabbitService({} as any, signalsMock);

    const payload = {
      "66bb": {
        data: [
          [762,  [51.33, 12.33, 1.2]],
          [1766, [51.34, 12.32, 1.53]],
        ],
        time: 1735683480000
      }
    };
    const content = JSON.stringify(payload);

    await svc.handleMessage(content);

    expect(signalsMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: '66bb',
        time: 1735683480000,
        dataLength: 2,
        dataVolume: Buffer.byteLength(content, 'utf8'),
        meta: { sample: expect.any(Array) },
      })
    );
  });

  it('throws on bad json', async () => {
    const svc = new RabbitService({} as any, { create: jest.fn() } as any);
    await expect(svc.handleMessage('not-json')).rejects.toBeTruthy();
  });
});
