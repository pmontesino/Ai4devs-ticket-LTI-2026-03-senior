import { RetentionService } from '../services/retention.service';

describe('RetentionService', () => {
  it('is idempotent while running', async () => {
    const fakePrisma: any = {
      candidate: {
        findMany: jest.fn(async () => []),
      },
      candidateAuditEvent: {
        create: jest.fn(async () => ({})),
      },
    };

    const service = new RetentionService(fakePrisma);

    const first = service.runDailyAnonymization(new Date());
    const second = await service.runDailyAnonymization(new Date());
    await first;

    expect(second.skipped).toBe(true);
  });

  it('retries anonymization job on transient failure', async () => {
    const findManyMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce([]);

    const fakePrisma: any = {
      candidate: {
        findMany: findManyMock,
      },
      candidateAuditEvent: {
        create: jest.fn(async () => ({})),
      },
    };

    const service = new RetentionService(fakePrisma);
    const result = await service.runDailyAnonymization(new Date());

    expect(result.skipped).toBe(false);
    expect(findManyMock).toHaveBeenCalledTimes(2);
  });
});
