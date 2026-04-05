import { PrismaClient } from '@prisma/client';
import { CandidateRepository } from '../repositories/candidate.repository';

let isRunning = false;

export class RetentionService {
  private readonly repository: CandidateRepository;
  private readonly maxRetries = 3;

  constructor(prisma: PrismaClient) {
    this.repository = new CandidateRepository(prisma);
  }

  async runDailyAnonymization(referenceDate = new Date()): Promise<{ processed: number; skipped: boolean }> {
    if (isRunning) {
      return { processed: 0, skipped: true };
    }

    isRunning = true;
    try {
      const cutoff = new Date(referenceDate);
      cutoff.setMonth(cutoff.getMonth() - 24);

      let attempt = 0;
      while (attempt < this.maxRetries) {
        try {
          const processed = await this.repository.runRetentionAnonymization(cutoff);
          return { processed, skipped: false };
        } catch (error) {
          attempt += 1;
          if (attempt >= this.maxRetries) {
            throw error;
          }
        }
      }

      return { processed: 0, skipped: false };
    } finally {
      isRunning = false;
    }
  }
}
