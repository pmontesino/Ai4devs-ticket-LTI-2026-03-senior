import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { CandidateService } from '../services/candidate.service';
import { enforceCvAccess } from './middlewares/cv-rbac.middleware';
import { AppError } from '../types/candidate';

const upload = multer({ storage: multer.memoryStorage() });

export function createCandidateRouter(prisma: PrismaClient): express.Router {
  const router = express.Router();
  const service = new CandidateService(prisma);

  router.post('/candidates', upload.single('cv'), async (req, res, next) => {
    try {
      const { candidate, cvUploaded } = await service.createCandidate(req.body, req.file || undefined);
      res.status(201).json({
        id: candidate.id,
        message: 'Candidato anadido correctamente.',
        cvUploaded,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/candidates/:candidateId/cv', upload.single('cv'), enforceCvAccess, async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('FILE_REQUIRED', 'Debes adjuntar un archivo CV.', 400);
      }

      await service.uploadCv(req.params.candidateId, req.file);
      res.status(200).json({
        candidateId: req.params.candidateId,
        message: 'CV cargado correctamente.',
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/candidates/:candidateId/cv', enforceCvAccess, async (req, res, next) => {
    try {
      const cv = await service.getLatestCv(req.params.candidateId);
      if (!fs.existsSync(cv.storagePath)) {
        throw new AppError('CV_NOT_FOUND', 'No existe CV para el candidato.', 404);
      }

      res.type(cv.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${cv.fileName}"`);
      fs.createReadStream(cv.storagePath).pipe(res);
    } catch (error) {
      next(error);
    }
  });

  router.get('/candidates/autocomplete', async (req, res, next) => {
    try {
      const field = (req.query.field as string) || '';
      const q = (req.query.q as string) || '';

      if (!['education', 'workExperience'].includes(field)) {
        throw new AppError('INVALID_FIELD', 'El campo de autocomplete no es valido.', 400);
      }

      const suggestions = await service.getAutocomplete(field as 'education' | 'workExperience', q);
      res.status(200).json({ suggestions });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
