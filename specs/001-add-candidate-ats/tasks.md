# Tasks: Anadir Candidato al Sistema ATS

**Input**: Design documents from `/specs/001-add-candidate-ats/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/candidate-api.yaml, quickstart.md

**Tests**: No se generan tareas de creacion de tests en esta fase porque la especificacion no exige enfoque TDD explicito. Se incluyen tareas de validacion funcional contra criterios de aceptacion.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar configuracion base para desarrollo del feature.

- [X] T001 Configurar variables de entorno para carga de CV y retencion en backend/.env.example
- [X] T002 [P] Crear carpeta de almacenamiento local de CV con README operativo en backend/uploads/README.md
- [X] T003 [P] Registrar rutas base del modulo candidato en backend/src/index.ts
- [X] T004 Documentar comando de migracion y arranque para el feature en specs/001-add-candidate-ats/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura comun obligatoria para todas las historias.

**CRITICAL**: No comenzar historias hasta completar esta fase.

- [X] T005 Extender modelo de datos de candidatos y CV en backend/prisma/schema.prisma
- [X] T006 Crear migracion Prisma para entidades Candidate, CandidateCvDocument y CandidateAuditEvent en backend/prisma/migrations/
- [X] T007 [P] Implementar repositorio base de candidatos en backend/src/repositories/candidate.repository.ts
- [X] T008 [P] Implementar util de almacenamiento de archivos con limite 10MB en backend/src/utils/file-storage.ts
- [X] T009 [P] Implementar middleware comun de manejo de errores API candidato en backend/src/api/middlewares/candidate-error-handler.ts
- [X] T010 Implementar servicio base de validacion de candidato en backend/src/services/candidate-validation.ts
- [X] T011 Definir cliente API frontend para candidato en frontend/src/services/candidateApi.ts
- [X] T012 Crear estructura base del formulario en frontend/src/components/CandidateForm.tsx
- [X] T039 [P] Configurar politica TLS minimo 1.2 para backend y documentar su verificacion en backend/README.md
- [X] T040 [P] Implementar util de cifrado AES-256 para campos criticos en backend/src/utils/field-encryption.ts
- [X] T048 Implementar integracion de cifrado AES-256 en alta/actualizacion de campos criticos en backend/src/services/candidate.service.ts
- [X] T049 Implementar integracion de descifrado controlado para lectura/descarga autorizada de datos criticos en backend/src/repositories/candidate.repository.ts

**Checkpoint**: Fundacion completada; historias de usuario pueden desarrollarse en paralelo.

---

## Phase 3: User Story 1 - Registrar candidato nuevo (Priority: P1) 🎯 MVP

**Goal**: Permitir al reclutador dar de alta candidatos desde dashboard con confirmacion de exito.

**Independent Test**: Desde dashboard, completar campos obligatorios (con o sin CV) y confirmar mensaje de alta exitosa.

### Implementation for User Story 1

- [X] T013 [P] [US1] Crear componentes de campos de formulario en frontend/src/components/CandidateFormFields.tsx
- [X] T014 [P] [US1] Crear componente de estado y confirmacion del formulario en frontend/src/components/CandidateFormStatus.tsx
- [X] T015 [US1] Integrar CandidateForm en la pantalla principal en frontend/src/App.tsx
- [X] T016 [US1] Implementar endpoint POST /api/candidates segun contrato en backend/src/api/candidates.routes.ts
- [X] T017 [US1] Implementar flujo de creacion de candidato con CV opcional en backend/src/services/candidate.service.ts
- [X] T018 [US1] Persistir candidato y metadatos de CV en backend/src/repositories/candidate.repository.ts
- [X] T019 [US1] Conectar envio de formulario al backend en frontend/src/services/candidateApi.ts
- [X] T020 [US1] Mostrar confirmacion de alta exitosa en frontend/src/components/CandidateFormStatus.tsx

**Checkpoint**: US1 funcional y demostrable como MVP.

---

## Phase 4: User Story 2 - Validar datos antes de guardar (Priority: P2)

**Goal**: Evitar altas invalidas y duplicadas con mensajes de validacion claros.

**Independent Test**: Intentar enviar formulario con campos vacios, email invalido y correo duplicado; el sistema bloquea y muestra mensajes especificos.

### Implementation for User Story 2

- [X] T021 [P] [US2] Implementar validaciones de cliente para requeridos y formato en frontend/src/services/validation.ts
- [X] T022 [US2] Integrar validaciones de cliente en el formulario en frontend/src/components/CandidateForm.tsx
- [X] T023 [US2] Implementar validacion de servidor para campos y formatos en backend/src/services/candidate-validation.ts
- [X] T024 [US2] Implementar regla de duplicado por correo y respuesta 409 en backend/src/services/candidate.service.ts
- [X] T025 [US2] Mapear errores de validacion y duplicado a mensajes de UI en frontend/src/components/CandidateFormStatus.tsx
- [X] T026 [US2] Alinear esquema de contrato de errores con codigos de negocio en specs/001-add-candidate-ats/contracts/candidate-api.yaml
- [X] T041 [US2] Implementar validacion explicita de telefono de Espana (+34XXXXXXXXX o 9 digitos nacional) en frontend/src/services/validation.ts y backend/src/services/candidate-validation.ts
- [X] T042 [US2] Implementar mejoras de accesibilidad del formulario (teclado, labels, aria-live, contraste) en frontend/src/components/CandidateForm.tsx

**Checkpoint**: US2 valida datos en cliente y servidor de forma independiente.

---

## Phase 5: User Story 3 - Manejar errores de carga y envio (Priority: P3)

**Goal**: Manejar correctamente errores de archivo, conectividad y acceso con mensajes accionables.

**Independent Test**: Probar archivo invalido o >10MB, fallo de red y acceso no autorizado a CV; el sistema responde con errores claros y permite reintento.

### Implementation for User Story 3

- [X] T027 [P] [US3] Implementar endpoint POST /api/candidates/{candidateId}/cv en backend/src/api/candidates.routes.ts
- [X] T028 [P] [US3] Implementar endpoint GET /api/candidates/autocomplete en backend/src/api/candidates.routes.ts
- [X] T029 [US3] Implementar control de tipo/tamano de CV y manejo 413 en backend/src/utils/file-storage.ts
- [X] T030 [US3] Implementar control de acceso por rol para ver/descargar CV en backend/src/api/middlewares/cv-rbac.middleware.ts
- [X] T031 [US3] Implementar preservacion de datos del formulario tras error recuperable en frontend/src/components/CandidateForm.tsx
- [X] T032 [US3] Implementar servicio de retencion y anonimizado a 24 meses en backend/src/services/retention.service.ts
- [X] T033 [US3] Registrar eventos de auditoria de alta/errores/acceso denegado en backend/src/repositories/candidate.repository.ts
- [X] T043 [US3] Implementar endpoint GET /api/candidates/{candidateId}/cv para descarga con RBAC en backend/src/api/candidates.routes.ts
- [X] T044 [US3] Alinear contrato OpenAPI con endpoint de descarga y seguridad bearer en specs/001-add-candidate-ats/contracts/candidate-api.yaml
- [X] T045 [US3] Implementar job diario idempotente de retencion con reintentos y reporte de estado en backend/src/services/retention.service.ts
- [X] T050 [US3] Implementar prueba automatizada de idempotencia/reintentos del job de retencion en backend/src/tests/retention.test.ts

**Checkpoint**: US3 cubre errores operativos, seguridad de CV y retencion.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre integral de calidad, documentacion y verificacion operativa.

- [X] T034 [P] Actualizar guia de uso del MVP con flujo final en README.md
- [X] T035 [P] Actualizar bitacora de evidencia del trabajo realizado en PROMPTS.MD
- [X] T036 Revisar consistencia final entre spec/plan/contracts en specs/001-add-candidate-ats/spec.md
- [ ] T037 Validar escenario end-to-end del quickstart en specs/001-add-candidate-ats/quickstart.md
- [ ] T038 Ejecutar validacion manual de criterios de aceptacion y registrar resultados en specs/001-add-candidate-ats/checklists/requirements.md
- [ ] T046 [P] Ejecutar matriz de compatibilidad en Chrome/Edge/Firefox (2 ultimas) y Safari (ultima) en specs/001-add-candidate-ats/checklists/compatibility.md
- [ ] T047 [P] Ejecutar checklist de accesibilidad del formulario (teclado, labels, aria-live, contraste) en specs/001-add-candidate-ats/checklists/accessibility.md
- [X] T051 [P] Implementar prueba automatizada para verificar configuracion TLS >= 1.2 en backend/src/tests/security.tls.test.ts
- [X] T052 [P] Implementar prueba automatizada para validar no persistencia en claro de campos cifrados AES-256 en backend/src/tests/candidates.api.test.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias.
- **Phase 2 (Foundational)**: Depende de Phase 1 y bloquea todas las historias.
- **Phase 3 (US1)**: Depende de Phase 2.
- **Phase 4 (US2)**: Depende de Phase 2; puede avanzar en paralelo con US1 una vez exista base de formulario.
- **Phase 5 (US3)**: Depende de Phase 2; integra sobre endpoints/servicios de US1-US2.
- **Phase 6 (Polish)**: Depende de completar las historias objetivo.

### User Story Dependencies

- **US1 (P1)**: Base del MVP, sin dependencia funcional de otras historias tras Foundational.
- **US2 (P2)**: Reutiliza formulario y servicio de creacion de US1, pero valida de forma independiente.
- **US3 (P3)**: Extiende manejo de archivos, errores y retencion sobre base de US1/US2.

### Within Each User Story

- Componentes/UI antes de integracion final del formulario.
- Validaciones de servidor antes de mapear mensajes finales de UI.
- Endpoints antes de reglas avanzadas (RBAC, retencion, auditoria).

### Parallel Opportunities

- Setup: T002 y T003 pueden ejecutarse en paralelo.
- Foundational: T007, T008 y T009 en paralelo; T011 y T012 en paralelo.
- US1: T013 y T014 en paralelo; T016 y T017 en paralelo con coordinacion de contrato.
- US2: T021 y T023 en paralelo.
- US3: T027 y T028 en paralelo; T029 y T030 en paralelo.
- Polish: T034 y T035 en paralelo.

---

## Parallel Example: User Story 1

```bash
# Frontend components in parallel
Task: "T013 [US1] Crear componentes de campos de formulario en frontend/src/components/CandidateFormFields.tsx"
Task: "T014 [US1] Crear componente de estado y confirmacion del formulario en frontend/src/components/CandidateFormStatus.tsx"

# Backend API + service in parallel
Task: "T016 [US1] Implementar endpoint POST /api/candidates en backend/src/api/candidates.routes.ts"
Task: "T017 [US1] Implementar flujo de creacion en backend/src/services/candidate.service.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T021 [US2] Implementar validaciones de cliente en frontend/src/services/validation.ts"
Task: "T023 [US2] Implementar validacion de servidor en backend/src/services/candidate-validation.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Implementar endpoint de carga posterior de CV en backend/src/api/candidates.routes.ts"
Task: "T028 [US3] Implementar endpoint de autocompletado en backend/src/api/candidates.routes.ts"
Task: "T029 [US3] Implementar control de tamano/tipo de CV en backend/src/utils/file-storage.ts"
Task: "T030 [US3] Implementar RBAC de CV en backend/src/api/middlewares/cv-rbac.middleware.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1).
3. Validar alta con y sin CV opcional.
4. Mostrar demo del MVP.

### Incremental Delivery

1. MVP con US1.
2. Agregar US2 para robustez de validacion y duplicados.
3. Agregar US3 para errores avanzados, seguridad CV y retencion.
4. Ejecutar fase de polish y cierre.

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational.
2. Luego:
   - Dev A: Frontend US1/US2.
   - Dev B: API/servicios US1/US2.
   - Dev C: US3 (RBAC, retencion, auditoria) sobre base consolidada.

---

## Notes

- Todas las tareas cumplen formato checklist: `- [ ] Txxx [P?] [US?] Descripcion con ruta de archivo`.
- Marcador `[USx]` solo aparece en fases de historias.
- Se evitaron tareas ambiguas sin ruta.
- Cada historia define criterio de prueba independiente.
