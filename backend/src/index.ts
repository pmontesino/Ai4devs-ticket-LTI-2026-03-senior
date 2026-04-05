import { Request, Response } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { createCandidateRouter } from './api/candidates.routes';
import { candidateErrorHandler } from './api/middlewares/candidate-error-handler';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = Number(process.env.PORT || 3010);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ message: 'Backend conectado correctamente en el puerto 3010.' });
});

app.use('/api', createCandidateRouter(prisma));

app.use(candidateErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
