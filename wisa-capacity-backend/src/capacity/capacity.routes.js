import { Router } from 'express';
import multer from 'multer';
import {
  uploadNQC,
  downloadInputTemplate,
  matchingResult,
} from './capacity.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/capacity/upload-nqc
// Body: file (xlsx), targetMonth (string เช่น "May-26")
router.post('/upload-nqc', upload.single('file'), uploadNQC);

// GET /api/capacity/download-template
// ดาวน์โหลด Input Format Template
router.get('/download-template', downloadInputTemplate);

// POST /api/capacity/matching
// Body: file (Input Format xlsx), keyColumn (string), baseData (JSON string)
router.post('/matching', upload.single('file'), matchingResult);

export default router;