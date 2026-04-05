# Phase 0 Research - Anadir Candidato al Sistema ATS

## Decision 1: API de alta con REST + multipart/form-data
- Decision: Exponer el alta de candidato mediante `POST /api/candidates` aceptando `multipart/form-data` para soportar datos estructurados y CV opcional en una sola operacion.
- Rationale: Simplifica UX y reduce pasos; permite mantener un contrato claro de errores (400/409/413/500).
- Alternatives considered:
  - JSON puro + endpoint separado obligatorio para CV: descartado porque obliga doble flujo incluso cuando se quiere cargar CV desde el inicio.
  - GraphQL mutation: descartado por sobrecosto para MVP y stack actual orientado a Express REST.

## Decision 2: Deteccion de duplicado por correo como regla de dominio
- Decision: Tratar correo como identificador funcional unico y rechazar alta duplicada con respuesta `409 Conflict` y mensaje de negocio.
- Rationale: Alinea con clarificacion aprobada y evita duplicidad en pipeline de reclutamiento.
- Alternatives considered:
  - Permitir duplicados con warning: descartado por riesgo de gestion inconsistente.
  - Upsert por correo: descartado porque mezcla alta con actualizacion sin confirmacion explicita.

## Decision 3: Estrategia de almacenamiento de CV en MVP
- Decision: Guardar archivo CV en almacenamiento de archivos del backend (ruta configurable por entorno) y persistir metadatos en PostgreSQL.
- Rationale: Es la opcion mas rapida de implementar con stack actual, manteniendo trazabilidad y posibilidad de migrar luego a almacenamiento externo.
- Alternatives considered:
  - Guardar binario en PostgreSQL: descartado por impacto en tamano y rendimiento de base de datos.
  - Usar object storage desde v1: descartado temporalmente para reducir complejidad operativa inicial.

## Decision 4: Validacion en dos capas (cliente + servidor)
- Decision: Aplicar validaciones tempranas en frontend y validacion autoritativa en backend para campos obligatorios, formato de email/telefono, tipo de archivo y limite de 10 MB.
- Rationale: Mejora experiencia de usuario sin comprometer integridad de datos.
- Alternatives considered:
  - Solo frontend: descartado por vulnerabilidad ante requests directas.
  - Solo backend: descartado por experiencia menos fluida y mayor tasa de reintentos.

## Decision 5: Seguridad y privacidad de CV/datos personales
- Decision: Exigir cifrado en transito (HTTPS/TLS), controles de acceso por rol para ver/descargar CV y proteccion en reposo segun capacidades del entorno.
- Rationale: Cumple clarificacion aprobada y minimiza riesgo de exposicion de datos sensibles.
- Alternatives considered:
  - Seguridad minima solo en transito: descartado por incumplir criterio de privacidad.
  - Auditoria exhaustiva avanzada desde v1: diferido para no bloquear MVP.

## Decision 6: Retencion y anonimizado
- Decision: Conservar datos personales y CV por 24 meses desde alta; al vencer plazo, anonimizar PII y conservar metricas agregadas.
- Rationale: Implementa requisito FR-018 y permite analitica sin exponer identidad.
- Alternatives considered:
  - Retencion indefinida: descartada por riesgo de cumplimiento.
  - Eliminacion total a 12 meses: descartada por menor valor historico para negocio.

## Decision 7: Autocompletado para educacion y experiencia
- Decision: Implementar endpoint de sugerencias como capacidad opcional (SHOULD), alimentado por catalogo historico de valores normalizados.
- Rationale: Aporta productividad sin ser bloqueante para el flujo base de alta.
- Alternatives considered:
  - No incluir autocompletado: descartado porque hay requisito SHOULD explicito.
  - Integrar motor externo de NLP: descartado por alcance excesivo para MVP.

## Decision 8: Observabilidad minima de MVP
- Decision: Registrar eventos clave del flujo de alta (inicio, validacion fallida, alta exitosa, rechazo por duplicado, rechazo de acceso CV) con trazabilidad por request.
- Rationale: Soporta diagnostico de errores y medicion de criterios de exito.
- Alternatives considered:
  - Sin logging estructurado: descartado por dificultad de soporte.
  - Telemetria avanzada completa: diferida a fase posterior.
