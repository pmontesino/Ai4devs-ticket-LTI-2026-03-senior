# Feature Specification: Anadir Candidato al Sistema ATS

**Feature Branch**: `001-add-candidate-ats`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Anadir Candidato al Sistema..."

## Clarifications

### Session 2026-04-05

- Q: Como manejar un alta con correo electronico ya existente? → A: Rechazar alta y mostrar mensaje de duplicado.
- Q: Que nivel de seguridad y privacidad aplicar en v1 para CV y datos personales? → A: Proteger en transito y en reposo, con control de acceso por rol para ver/descargar CV.
- Q: El CV debe ser obligatorio al crear candidato? → A: No, el CV es opcional en el alta inicial y puede adjuntarse despues.
- Q: Cual es el tamano maximo permitido para el CV en v1? → A: 10 MB por archivo.
- Q: Cual es la politica de retencion de datos y CV para v1? → A: Conservar 24 meses y luego anonimizar datos personales, manteniendo metricas agregadas.
- Q: Que formato de telefono usar para validacion en v1? → A: Formato de Espana (E.164 +34XXXXXXXXX o nacional de 9 digitos que inicia en 6, 7, 8 o 9).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar candidato nuevo (Priority: P1)

Como reclutador, quiero registrar un candidato desde el dashboard para iniciar su gestion en el proceso de seleccion sin depender de herramientas externas.

**Why this priority**: Es el flujo principal que habilita el valor base del ATS para el reclutador.

**Independent Test**: Se puede probar de forma independiente ingresando datos validos en el formulario y verificando que el sistema confirma el alta del candidato.

**Acceptance Scenarios**:

1. **Given** que el reclutador esta en su dashboard, **When** selecciona la opcion de anadir candidato, **Then** visualiza un formulario con los campos requeridos del candidato.
2. **Given** que el reclutador completa correctamente todos los campos obligatorios con o sin CV adjunto, **When** envia el formulario, **Then** el sistema registra el candidato y muestra confirmacion de exito.

---

### User Story 2 - Validar datos antes de guardar (Priority: P2)

Como reclutador, quiero recibir validaciones claras en el formulario para corregir errores antes del envio y evitar registros incompletos o incorrectos.

**Why this priority**: Reduce errores de captura, mejora la calidad de datos y evita retrabajo en etapas posteriores.

**Independent Test**: Se puede probar introduciendo datos invalidos o incompletos y verificando que el sistema bloquea el envio y muestra mensajes comprensibles por campo.

**Acceptance Scenarios**:

1. **Given** que hay campos obligatorios vacios, **When** el reclutador intenta enviar el formulario, **Then** el sistema impide el envio y resalta los campos faltantes.
2. **Given** que el correo electronico no tiene formato valido, **When** el reclutador intenta enviar, **Then** el sistema muestra un mensaje de validacion especifico para el correo.

---

### User Story 3 - Manejar errores de carga y envio (Priority: P3)

Como reclutador, quiero mensajes claros cuando falle la carga del CV o el guardado para saber que ocurrio y como continuar.

**Why this priority**: Aumenta la confianza en el sistema y reduce bloqueos operativos ante incidencias.

**Independent Test**: Se puede probar forzando errores de conectividad o adjuntando archivos no permitidos para comprobar que el sistema informa la causa y permite reintentar.

**Acceptance Scenarios**:

1. **Given** que el archivo adjunto no es PDF o DOCX, **When** el reclutador intenta cargarlo, **Then** el sistema rechaza el archivo e informa los formatos permitidos.
2. **Given** que ocurre un fallo de comunicacion durante el envio, **When** el reclutador envia el formulario, **Then** el sistema muestra un mensaje de error accionable sin perder los datos ya ingresados.

### Edge Cases

- El reclutador intenta registrar un candidato con correo electronico ya existente en el sistema y recibe mensaje de duplicado sin crear un nuevo registro.
- El reclutador adjunta un CV corrupto o sin contenido legible.
- El reclutador guarda un candidato sin CV y necesita adjuntarlo en una accion posterior.
- El reclutador intenta adjuntar un CV mayor a 10 MB.
- Se interrumpe la conexion durante el envio final despues de completar el formulario.
- El reclutador abre el formulario en dispositivos moviles o resoluciones reducidas.
- El reclutador usa navegadores modernos diferentes y debe mantener una experiencia consistente.
- Un usuario sin rol autorizado intenta ver o descargar el CV del candidato.
- El candidato supera 24 meses de retencion y el sistema debe anonimizar datos personales sin perder metricas agregadas.
- El candidato intenta descargar CV sin permisos y el sistema debe responder acceso denegado.
- El job diario de retencion falla en mitad de ejecucion y debe poder reintentarse sin anonimizar dos veces el mismo registro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en el dashboard del reclutador una accion claramente visible para anadir un nuevo candidato.
- **FR-002**: El sistema MUST presentar un formulario de alta con los campos nombre, apellido, correo electronico, telefono, direccion, educacion y experiencia laboral.
- **FR-003**: El sistema MUST exigir los campos obligatorios definidos por negocio antes de permitir el envio.
- **FR-004**: El sistema MUST validar el formato del correo electronico y el formato de telefono de Espana antes de registrar el candidato. Para telefono se acepta E.164 `+34XXXXXXXXX` o formato nacional de 9 digitos que inicie en 6, 7, 8 o 9.
- **FR-005**: El sistema MUST permitir adjuntar CV unicamente en formatos PDF o DOCX durante el alta o en una accion posterior, con tamano maximo de 10 MB por archivo.
- **FR-006**: El sistema MUST impedir el envio cuando existan errores de validacion y mostrar mensajes comprensibles por campo.
- **FR-007**: El sistema MUST registrar al candidato cuando todos los datos y adjuntos sean validos.
- **FR-008**: El sistema MUST mostrar una confirmacion explicita cuando el candidato se haya anadido correctamente.
- **FR-009**: El sistema MUST mostrar mensajes de error claros y accionables cuando ocurra un fallo de envio o de conectividad.
- **FR-010**: El sistema MUST preservar los datos ingresados por el reclutador tras un error recuperable para facilitar reintentos.
- **FR-011**: El sistema MUST cumplir criterios de accesibilidad verificables: navegacion completa por teclado, etiquetas asociadas a campos (`label`/`for`), mensajes de error anunciados por tecnologias asistivas (`aria-live`) y contraste minimo 4.5:1 en textos informativos y de error.
- **FR-012**: El sistema MUST ofrecer compatibilidad verificable en Chrome, Edge y Firefox en sus dos ultimas versiones estables, y en Safari en su ultima version estable, para resoluciones moviles (>=360px), tablet (>=768px) y escritorio (>=1280px).
- **FR-013**: El sistema SHOULD sugerir opciones de autocompletado en educacion y experiencia laboral basadas en datos historicos del sistema cuando existan coincidencias.
- **FR-014**: El sistema MUST rechazar el alta cuando el correo electronico ya exista en el sistema y mostrar un mensaje explicito de candidato duplicado.
- **FR-015**: El sistema MUST proteger los datos del candidato y los archivos CV en transito y en reposo: TLS minimo 1.2 para trafico de red y cifrado AES-256 para datos criticos almacenados en campos.
- **FR-016**: El sistema MUST aplicar control de acceso basado en rol para permitir ver o descargar CV solo a usuarios autorizados, incluyendo endpoint especifico de descarga.
- **FR-017**: El sistema MUST permitir registrar candidatos sin CV adjunto en el alta inicial, manteniendo la posibilidad de cargarlo posteriormente.
- **FR-018**: El sistema MUST conservar datos personales y CV por 24 meses desde el alta del candidato y, al cumplirse ese plazo, anonimizar los datos personales manteniendo metricas agregadas para analisis.
- **FR-019**: El sistema MUST ejecutar un proceso programado diario de retencion/anonimizado, idempotente y con reintentos ante fallo para garantizar completitud operativa.

### Key Entities *(include if feature involves data)*

- **Candidato**: Persona postulante cuyos datos personales y profesionales se registran para iniciar o continuar un proceso de seleccion; el correo electronico actua como identificador unico funcional.
- **Perfil de Candidato**: Conjunto estructurado de informacion del candidato (datos personales, contacto, educacion, experiencia, estado inicial).
- **Documento CV**: Archivo adjunto asociado al candidato con su historial profesional en formato permitido, protegido en reposo y accesible solo por roles autorizados.
- **Registro de Alta**: Evidencia de la operacion de anadido (resultado, fecha y contexto operativo) para seguimiento y auditoria funcional.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos el 95% de los reclutadores puede completar el alta de un candidato valido en menos de 3 minutos.
- **SC-002**: Al menos el 98% de los intentos con datos invalidos muestra mensajes de validacion especificos antes del envio.
- **SC-003**: Al menos el 99% de las altas validas finaliza con confirmacion visible sin necesidad de reintentos.
- **SC-004**: Menos del 2% de las sesiones de alta reporta abandono por errores no entendibles durante el primer mes de uso.
- **SC-005**: Al menos el 90% de los usuarios de prueba califica la facilidad de uso del flujo de alta como "facil" o "muy facil".
- **SC-006**: El 100% de los intentos de acceso a CV por usuarios sin rol autorizado es bloqueado y reportado como acceso denegado.
- **SC-007**: El 100% de los archivos CV que excedan 10 MB es rechazado con un mensaje de validacion claro antes de completar la carga.
- **SC-008**: El 100% de los registros que alcancen 24 meses ejecuta anonimizado de datos personales segun politica, sin perdida de metricas agregadas requeridas.
- **SC-009**: El 100% de las conexiones productivas del flujo de alta y descarga de CV negocia TLS 1.2 o superior.
- **SC-010**: Al menos el 95% de los casos de prueba de accesibilidad definidos para formulario y mensajes de error pasa en validacion manual asistida.
- **SC-011**: El 100% de los ciclos diarios de retencion reporta resultado (exito/fallo) y permite reintento sin duplicar anonimizado.

## Assumptions

- El reclutador accede al sistema con permisos suficientes para crear candidatos.
- Los campos obligatorios minimos para v1 incluyen nombre, apellido, correo electronico y al menos un medio de contacto.
- La funcionalidad de anadir candidato no incluye en esta fase evaluaciones, entrevistas ni asignacion avanzada de vacantes.
- Existen criterios organizacionales para definir navegadores modernos soportados y estos se usaran como referencia de compatibilidad.
- Las sugerencias de autocompletado dependen de que haya datos historicos suficientes en el sistema.
- La politica corporativa de privacidad y proteccion de datos ya esta definida y debe cumplirse durante todo el flujo.
- Se dispone de mecanismos organizacionales para cifrado de datos en transito y en reposo reutilizables por esta funcionalidad.
- Existe una politica organizacional valida para retencion de 24 meses y anonimizado posterior aplicable a datos de candidatos.
