import { processNQC } from './services/nqc.service.js';
import { generateInputTemplate, generateFinalResult } from './services/export.service.js';
import { matchInputWithBase } from './services/matching.service.js';

// ─── Upload & Process NQC ─────────────────────────────────────────────────────
export async function uploadNQC(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'ไม่พบไฟล์' });

    const targetMonth = req.body.targetMonth;
    if (!targetMonth) return res.status(400).json({ success: false, message: 'กรุณาระบุเดือน' });

    const { data, availableMonths } = processNQC(req.file.buffer, targetMonth);

    res.json({ success: true, data, availableMonths });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─── Download Input Format Template ──────────────────────────────────────────
export function downloadInputTemplate(req, res) {
  try {
    const buffer = generateInputTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="InputFormat_FlowrackCapacity.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─── Key Matching & Final Result ──────────────────────────────────────────────
export async function matchingResult(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'ไม่พบไฟล์ Input Format' });

    const keyColumn  = req.body.keyColumn;
    const baseData   = JSON.parse(req.body.baseData || '[]');

    if (!keyColumn) return res.status(400).json({ success: false, message: 'กรุณาเลือก Key Column' });

    const merged = matchInputWithBase(req.file.buffer, baseData, keyColumn);
    const buffer = generateFinalResult(merged);

    res.setHeader('Content-Disposition', 'attachment; filename="FinalResult_FlowrackCapacity.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}