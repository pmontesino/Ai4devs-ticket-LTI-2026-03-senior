# Data Model - Anadir Candidato al Sistema ATS

## Entity: Candidate
- Description: Registro principal del candidato dentro del ATS.
- Fields:
  - `id` (uuid, required, immutable)
  - `firstName` (string, required, 1-100)
  - `lastName` (string, required, 1-100)
  - `email` (string, required, unique, formato email valido)
  - `phone` (string, required, formato telefono Espana)
  - `address` (string, optional, max 255)
  - `education` (string, optional, max 500)
  - `workExperience` (string, optional, max 4000)
  - `status` (enum: `ACTIVE`, `ANONYMIZED`; required)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
  - `anonymizedAt` (datetime, optional)
- Validation Rules:
  - `email` MUST ser unico y no reutilizable para crear otro candidato activo.
  - Campos requeridos: `firstName`, `lastName`, `email`, `phone`.
  - `phone` MUST cumplir `+34XXXXXXXXX` o formato nacional de 9 digitos que inicie en 6, 7, 8 o 9.
  - Campos criticos almacenados (`phone`, `address`, `email`) MUST cifrarse en reposo con AES-256.

## Entity: CandidateCvDocument
- Description: Metadatos del CV asociado al candidato (el archivo se almacena en storage de archivos).
- Fields:
  - `id` (uuid, required)
  - `candidateId` (uuid, required, FK -> Candidate.id)
  - `fileName` (string, required)
  - `mimeType` (enum/string, allowed: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
  - `fileSizeBytes` (integer, required, <= 10485760)
  - `storagePath` (string, required)
  - `uploadedByUserId` (uuid/int, required)
  - `uploadedAt` (datetime, required)
- Validation Rules:
  - Maximo 10 MB.
  - Solo PDF y DOCX.
  - Carga opcional en alta; permitida posterior.

## Entity: CandidateAuditEvent
- Description: Trazabilidad funcional y de seguridad para operaciones de alta y acceso a CV.
- Fields:
  - `id` (uuid, required)
  - `candidateId` (uuid, optional para eventos previos a creacion)
  - `eventType` (enum: `CREATE_SUCCESS`, `CREATE_VALIDATION_ERROR`, `CREATE_DUPLICATE_REJECTED`, `CV_UPLOAD_SUCCESS`, `CV_UPLOAD_REJECTED`, `CV_ACCESS_DENIED`, `ANONYMIZATION_EXECUTED`)
  - `actorUserId` (uuid/int, required)
  - `timestamp` (datetime, required)
  - `metadata` (json, optional)

## Entity: AggregatedCandidateMetrics
- Description: Metricas agregadas para analitica, no identificables por persona.
- Fields:
  - `metricDate` (date, required)
  - `totalCandidatesCreated` (integer, required)
  - `totalCvUploaded` (integer, required)
  - `totalValidationErrors` (integer, required)
  - `totalDuplicatesRejected` (integer, required)

## Relationships
- Candidate 1 --- 0..N CandidateCvDocument
- Candidate 1 --- 0..N CandidateAuditEvent
- AggregatedCandidateMetrics no referencia identidades individuales.

## State Transitions
- Candidate:
  - `ACTIVE` -> `ANONYMIZED` cuando `createdAt + 24 meses` y se ejecuta politica de retencion.
- CandidateCvDocument:
  - `uploaded` -> `retained` -> `anonymized_or_deleted` de acuerdo a politica de retencion aplicable al candidato.

## Derived Rules
- Si correo ya existe en Candidate `ACTIVE`, la creacion retorna conflicto de duplicado.
- Si usuario no tiene rol autorizado para CV, cualquier lectura/descarga retorna acceso denegado.
- Durante error recuperable de red/servidor, el cliente conserva el formulario para reintento.
