# Quickstart - Anadir Candidato al Sistema ATS

## 1. Prerequisitos
- Node.js 18+.
- Docker disponible para PostgreSQL.
- Dependencias instaladas en backend y frontend.

## 2. Levantar infraestructura
```bash
docker-compose up -d
```

## 3. Configurar backend
1. Ajustar variables en `backend/.env` (`DATABASE_URL`, `UPLOAD_DIR`, etc.).
2. Generar cliente Prisma y ejecutar migraciones:
```bash
cd backend
npm run prisma:generate
npx prisma migrate dev
```

## 4. Ejecutar aplicacion en desarrollo
Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## 5. Probar flujo principal de alta
1. Abrir `http://localhost:3000`.
2. Entrar al dashboard de reclutador.
3. Abrir formulario "Anadir candidato".
4. Completar campos obligatorios.
5. Adjuntar CV opcional (PDF/DOCX <= 10 MB).
6. Enviar y verificar mensaje de exito.

## 6. Casos de verificacion rapida
- Correo duplicado retorna mensaje de duplicado.
- Email invalido o campos faltantes bloquean envio.
- CV > 10 MB o formato no permitido retorna validacion.
- Usuario sin rol para CV recibe acceso denegado en visualizacion/descarga.

## 7. Pruebas automatizadas
Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

## 8. Verificacion de retencion
- Simular candidatos con `createdAt` vencido (>24 meses).
- Ejecutar job de anonimizado.
- Confirmar que PII queda anonimizada y metricas agregadas se conservan.
