import { PrismaClient } from '@prisma/client';
import { CandidatePayload, CandidateResponse } from '../types/candidate';
import { decryptField, encryptField } from '../utils/field-encryption';

type CandidateCreateArgs = {
  payload: CandidatePayload;
  cvMetadata?: {
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    storagePath: string;
  };
};

export class CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<{ id: string } | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
      select: { id: true },
    });

    return candidate;
  }

  async createCandidate(args: CandidateCreateArgs): Promise<CandidateResponse> {
    const created = await this.prisma.candidate.create({
      data: {
        firstName: args.payload.firstName,
        lastName: args.payload.lastName,
        email: args.payload.email,
        encryptedPhone: encryptField(args.payload.phone) || '',
        encryptedAddress: encryptField(args.payload.address),
        encryptedEducation: encryptField(args.payload.education),
        encryptedWorkExp: encryptField(args.payload.workExperience),
        cvDocuments: args.cvMetadata
          ? {
              create: {
                fileName: args.cvMetadata.fileName,
                mimeType: args.cvMetadata.mimeType,
                fileSizeBytes: args.cvMetadata.fileSizeBytes,
                storagePath: args.cvMetadata.storagePath,
              },
            }
          : undefined,
      },
    });

    await this.audit('CREATE_SUCCESS', created.id, { email: created.email });
    return this.toCandidateResponse(created);
  }

  async addCv(candidateId: string, metadata: { fileName: string; mimeType: string; fileSizeBytes: number; storagePath: string }): Promise<void> {
    await this.prisma.candidateCvDocument.create({
      data: {
        candidateId,
        fileName: metadata.fileName,
        mimeType: metadata.mimeType,
        fileSizeBytes: metadata.fileSizeBytes,
        storagePath: metadata.storagePath,
      },
    });

    await this.audit('CV_UPLOAD_SUCCESS', candidateId, { fileName: metadata.fileName });
  }

  async findLatestCvByCandidateId(candidateId: string): Promise<{ storagePath: string; mimeType: string; fileName: string } | null> {
    const doc = await this.prisma.candidateCvDocument.findFirst({
      where: { candidateId },
      orderBy: { uploadedAt: 'desc' },
    });

    if (!doc) {
      return null;
    }

    return { storagePath: doc.storagePath, mimeType: doc.mimeType, fileName: doc.fileName };
  }

  async getAutocomplete(field: 'education' | 'workExperience', query: string): Promise<string[]> {
    const selectField = field === 'education' ? 'encryptedEducation' : 'encryptedWorkExp';
    const rows = await this.prisma.candidate.findMany({
      select: { [selectField]: true } as never,
      take: 100,
    });

    const values = rows
      .map((row) => decryptField((row as unknown as Record<string, string | null>)[selectField]))
      .filter((v): v is string => Boolean(v))
      .filter((v) => v.toLowerCase().includes(query.toLowerCase()));

    return Array.from(new Set(values)).slice(0, 10);
  }

  async audit(eventType: any, candidateId?: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.prisma.candidateAuditEvent.create({
      data: {
        eventType,
        candidateId,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  }

  async runRetentionAnonymization(cutoff: Date): Promise<number> {
    const candidates = await this.prisma.candidate.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: { lte: cutoff },
      },
    });

    let processed = 0;
    for (const candidate of candidates) {
      await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          status: 'ANONYMIZED',
          anonymizedAt: new Date(),
          firstName: 'ANONYMIZED',
          lastName: `CANDIDATE-${candidate.id.slice(0, 8)}`,
          email: `anon-${candidate.id}@example.local`,
          encryptedPhone: encryptField('000000000') || '',
          encryptedAddress: undefined,
          encryptedEducation: undefined,
          encryptedWorkExp: undefined,
        },
      });
      await this.audit('ANONYMIZATION_EXECUTED', candidate.id, { cutoff: cutoff.toISOString() });
      processed += 1;
    }

    return processed;
  }

  private toCandidateResponse(candidate: any): CandidateResponse {
    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: decryptField(candidate.encryptedPhone) || '',
      address: decryptField(candidate.encryptedAddress),
      education: decryptField(candidate.encryptedEducation),
      workExperience: decryptField(candidate.encryptedWorkExp),
      createdAt: candidate.createdAt,
      status: candidate.status,
    };
  }
}
