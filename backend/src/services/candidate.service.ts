import { PrismaClient } from '@prisma/client';
import { CandidateRepository } from '../repositories/candidate.repository';
import { validateCandidatePayload } from './candidate-validation';
import { AppError, CandidatePayload, CandidateResponse } from '../types/candidate';
import { persistCvFile, validateCvFile } from '../utils/file-storage';

export class CandidateService {
  private readonly repository: CandidateRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new CandidateRepository(prisma);
  }

  async createCandidate(rawPayload: Partial<CandidatePayload>, file?: Express.Multer.File): Promise<{ candidate: CandidateResponse; cvUploaded: boolean }> {
    const payload = validateCandidatePayload(rawPayload);

    const duplicate = await this.repository.findByEmail(payload.email);
    if (duplicate) {
      await this.repository.audit('CREATE_DUPLICATE_REJECTED', duplicate.id, { email: payload.email });
      throw new AppError('DUPLICATE_EMAIL', 'Ya existe un candidato con ese correo electronico.', 409);
    }

    let cvMetadata: { fileName: string; mimeType: string; fileSizeBytes: number; storagePath: string } | undefined;
    if (file) {
      validateCvFile(file);
      const storagePath = persistCvFile(file);
      cvMetadata = {
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        storagePath,
      };
    }

    const candidate = await this.repository.createCandidate({ payload, cvMetadata });
    return { candidate, cvUploaded: Boolean(cvMetadata) };
  }

  async uploadCv(candidateId: string, file: Express.Multer.File): Promise<void> {
    validateCvFile(file);
    const storagePath = persistCvFile(file);
    await this.repository.addCv(candidateId, {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      storagePath,
    });
  }

  async getLatestCv(candidateId: string): Promise<{ storagePath: string; mimeType: string; fileName: string }> {
    const doc = await this.repository.findLatestCvByCandidateId(candidateId);
    if (!doc) {
      throw new AppError('CV_NOT_FOUND', 'No existe CV para el candidato.', 404);
    }

    return doc;
  }

  async getAutocomplete(field: 'education' | 'workExperience', q: string): Promise<string[]> {
    return this.repository.getAutocomplete(field, q);
  }
}
