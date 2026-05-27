import * as XLSX from 'xlsx';

// Columns ที่ต้องการเก็บไว้ (ไม่รวม Key0, DMax, D01-D31, N01-N31)
const BASE_COLS = [
  'Source','Dock','Sup','Splant','Sdock','Pno',
  'PartNo','PartName','KBN','Qty','PC_Addr',
  'Addr01','Addr02','Addr03','Addr04','Addr05','Addr06','Addr07',
  'Addr08','Addr09','Addr10','Addr11','Addr12','Addr13',
];

const ADDR_COLS = [
  'Addr01','Addr02','Addr03','Addr04','Addr05','Addr06','Addr07',
  'Addr08','Addr09','Addr10','Addr11','Addr12','Addr13',
];

// ตรวจว่าเป็น column เดือน เช่น "May-26", "Feb-26"
function isMonthCol(col) {
  return /^[A-Za-z]{3}-\d{2}$/.test(col);
}

export function processNQC(buffer, targetMonth) {
  // 1. อ่านไฟล์
  const wb   = XLSX.read(buffer, { type: 'buffer' });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const raw  = XLSX.utils.sheet_to_json(ws, { defval: '' });

  if (!raw.length) throw new Error('ไฟล์ว่างเปล่า');

  // 2. หาเดือนที่มีอยู่ในไฟล์
  const allCols       = Object.keys(raw[0]);
  const availableMonths = allCols.filter(isMonthCol);

  if (!availableMonths.includes(targetMonth)) {
    throw new Error(`ไม่พบเดือน "${targetMonth}" ในไฟล์ (มี: ${availableMonths.join(', ')})`);
  }

  // 3. กรอง Source = 3 ออก
  let rows = raw.filter(r => String(r['Source']).trim() !== '3');

  // 4. กรองเดือนที่เลือก = 0 หรือ blank ออก
  rows = rows.filter(r => {
    const val = r[targetMonth];
    return val !== '' && val !== 0 && val !== '0';
  });

  // 5. เก็บเฉพาะ column ที่ต้องการ + เดือน
  const keepCols = [...BASE_COLS, ...availableMonths];

  // 6. Process Addr → duplicate rows
  const result = [];

  for (const row of rows) {
    // หา addr ที่ไม่ว่าง
    const addrs = ADDR_COLS
      .map(col => ({ col, val: String(row[col] || '').trim() }))
      .filter(a => a.val !== '');

    const isMulti = addrs.length > 2;

    if (addrs.length === 0) {
      // ไม่มี addr เลย → เก็บไว้ว่าง
      result.push(buildRow(row, keepCols, '', isMulti));
    } else {
      // duplicate ตามจำนวน addr
      for (const addr of addrs) {
        result.push(buildRow(row, keepCols, addr.val, isMulti));
      }
    }
  }

  return { data: result, availableMonths };
}

function buildRow(row, keepCols, addrValue, isMulti) {
  const out = {};

  for (const col of keepCols) {
    // ข้าม Addr01-Addr13 (จะแทนด้วย Addr column เดียว)
    if (ADDR_COLS.includes(col)) continue;
    out[col] = row[col] ?? '';
  }

  out['Addr']      = addrValue;
  out['Multi Addr'] = isMulti ? 'Yes' : '';

  return out;
}