-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('ACTIVE', 'ANONYMIZED');

-- CreateEnum
CREATE TYPE "CandidateAuditEventType" AS ENUM (
  'CREATE_SUCCESS',
  'CREATE_VALIDATION_ERROR',
  'CREATE_DUPLICATE_REJECTED',
  'CV_UPLOAD_SUCCESS',
  'CV_UPLOAD_REJECTED',
  'CV_ACCESS_DENIED',
  'ANONYMIZATION_EXECUTED'
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "encryptedPhone" TEXT NOT NULL,
    "encryptedAddress" TEXT,
    "encryptedEducation" TEXT,
    "encryptedWorkExp" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anonymizedAt" TIMESTAMP(3),
    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateCvDocument" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "uploadedByUser" TEXT NOT NULL DEFAULT 'system',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateCvDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAuditEvent" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT,
    "eventType" "CandidateAuditEventType" NOT NULL,
    "actorUser" TEXT NOT NULL DEFAULT 'system',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,
    CONSTRAINT "CandidateAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- AddForeignKey
ALTER TABLE "CandidateCvDocument" ADD CONSTRAINT "CandidateCvDocument_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAuditEvent" ADD CONSTRAINT "CandidateAuditEvent_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
