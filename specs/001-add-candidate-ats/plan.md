# Implementation Plan: Anadir Candidato al Sistema ATS

**Branch**: `001-add-candidate-ats` | **Date**: 2026-04-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-candidate-ats/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar el alta de candidatos en el ATS desde el dashboard de reclutador con validaciones de datos, deteccion de duplicados por correo, carga opcional de CV (PDF/DOCX, maximo 10 MB), confirmacion de exito y manejo de errores. La solucion se implementara como flujo web con frontend React y backend Express/Prisma, usando PostgreSQL para datos estructurados y almacenamiento de CV con control de acceso por rol, cifrado en transito/en reposo y retencion de 24 meses con anonimizado posterior.

## Technical Context

**Language/Version**: TypeScript 4.9 (backend Node.js + frontend React 18)  
**Primary Dependencies**: Express 4, Prisma 5, PostgreSQL, React 18, react-scripts 5, Jest, Supertest, Testing Library  
**Storage**: PostgreSQL para datos de candidatos y metadatos; almacenamiento de archivos CV en repositorio de archivos del backend (MVP) con ruta configurable por entorno  
**Testing**: Jest (frontend y backend), Supertest para API, React Testing Library para UI  
**Target Platform**: Aplicacion web (navegadores modernos) + backend Node en entorno Linux/Windows/containers
**Project Type**: Aplicacion web full-stack (frontend + backend en monorepo)  
**Performance Goals**: Crear candidato p95 < 2s sin archivo y p95 < 5s con CV de hasta 10 MB; feedback de validacion en cliente < 200 ms  
**Constraints**: CV opcional, solo PDF/DOCX, max 10 MB, correo unico, validacion de telefono Espana, TLS minimo 1.2 en transito, cifrado AES-256 para datos criticos en campos, control de acceso por rol para ver/descargar CV, compatibilidad en matriz de navegadores definida, retencion 24 meses con anonimizado programado diario idempotente y con reintentos  
**Scale/Scope**: MVP para equipo de reclutamiento interno; objetivo inicial 5k-20k candidatos historicos y hasta 100 altas diarias

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Gate 1 - Principios obligatorios definidos: PASS (sin bloqueo). La constitucion en [.specify/memory/constitution.md](../../.specify/memory/constitution.md) esta en plantilla sin principios ejecutables, por lo que no impone restricciones verificables en esta fase.
- Gate 2 - Alineacion con seguridad y privacidad del feature spec: PASS. El plan incorpora cifrado en transito/en reposo, RBAC para CV y retencion con anonimizado.
- Gate 3 - Trazabilidad de validacion y pruebas: PASS. Se define cobertura de pruebas unitarias, integracion API y UI.

Re-check post-diseno (Phase 1): PASS. Los artefactos de diseno y contratos mantienen los mismos gates sin violaciones nuevas.

## Project Structure

### Documentation (this feature)

```text
specs/001-add-candidate-ats/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── index.ts
│   ├── api/
│   │   ├── candidates.routes.ts         # nuevo
│   │   └── middlewares/
│   ├── services/
│   │   ├── candidate.service.ts         # nuevo
│   │   ├── candidate-validation.ts      # nuevo
│   │   └── retention.service.ts         # nuevo
│   ├── repositories/
│   │   └── candidate.repository.ts      # nuevo
│   └── utils/
│       └── file-storage.ts              # nuevo
├── prisma/
│   ├── schema.prisma                    # actualizar con modelos de candidato
│   └── migrations/
└── src/tests/
    ├── app.test.ts
    ├── candidates.api.test.ts           # nuevo
    └── retention.test.ts                # nuevo

frontend/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── CandidateForm.tsx            # nuevo
│   │   ├── CandidateFormFields.tsx      # nuevo
│   │   └── CandidateFormStatus.tsx      # nuevo
│   ├── services/
│   │   ├── candidateApi.ts              # nuevo
│   │   └── validation.ts                # nuevo
│   └── tests/
│       └── CandidateForm.test.tsx       # nuevo
└── src/tests/
    └── App.test.tsx
```

**Structure Decision**: Se adopta estructura web full-stack existente en [backend](../../backend) y [frontend](../../frontend), anadiendo modulos de dominio de candidato en ambos lados para aislar validacion, persistencia, almacenamiento de CV y contratos HTTP.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
