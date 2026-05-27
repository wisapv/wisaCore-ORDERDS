import * as XLSX from 'xlsx';

/**
 * Match Input Format (xlsx) กับ Base Data (JSON)
 * โดยใช้ keyColumn เป็น key
 */
export function matchInputWithBase(inputBuffer, baseData, keyColumn) {
  // 1. อ่าน Input Format
  const wb      = XLSX.read(inputBuffer, { type: 'buffer' });
  const ws      = wb.Sheets[wb.SheetNames[0]];
  const inputRows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  if (!inputRows.length) throw new Error('Input Format ว่างเปล่า');

  // 2. สร้าง Map จาก Base Data ด้วย keyColumn
  const baseMap = new Map();
  for (const row of baseData) {
    const keyVal = String(row[keyColumn] || '').trim();
    if (keyVal) baseMap.set(keyVal, row);
  }

  // 3. Merge
  const merged = inputRows.map((inputRow, idx) => {
    const keyVal  = String(inputRow[keyColumn] || '').trim();
    const baseRow = baseMap.get(keyVal) || {};

    return {
      No:         idx + 1,
      // Input Format columns
      KBN:        inputRow['KBN']        || '',
      Addr:       inputRow['Addr']       || '',
      Depth:      inputRow['Depth']      || '',
      Stacking:   inputRow['Stacking']   || '',
      Row:        inputRow['Row']        || '',
      Minomi:     inputRow['Minomi']     || '',
      // Base Data columns (ที่ match ได้)
      PartNo:     baseRow['PartNo']      || '',
      PartName:   baseRow['PartName']    || '',
      Qty:        baseRow['Qty']         || '',
      PC_Addr:    baseRow['PC_Addr']     || '',
      'Multi Addr': baseRow['Multi Addr'] || '',
      Source:     baseRow['Source']      || '',
    };
  });

  return merged;
} 