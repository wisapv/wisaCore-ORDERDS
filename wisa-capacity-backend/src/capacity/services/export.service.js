import * as XLSX from 'xlsx';

// ─── Input Format Template ────────────────────────────────────────────────────
export function generateInputTemplate() {
  const headers = [['No.', 'KBN', 'Addr', 'Depth', 'Stacking', 'Row', 'Minomi']];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(headers);

  // ปรับความกว้าง column
  ws['!cols'] = [
    { wch: 6  },  // No.
    { wch: 14 },  // KBN
    { wch: 14 },  // Addr
    { wch: 10 },  // Depth
    { wch: 12 },  // Stacking
    { wch: 10 },  // Row
    { wch: 10 },  // Minomi
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Flowrack Capacity');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

// ─── Final Result ─────────────────────────────────────────────────────────────
export function generateFinalResult(data) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  ws['!cols'] = [
    { wch: 6  },  // No
    { wch: 14 },  // KBN
    { wch: 14 },  // Addr
    { wch: 10 },  // Depth
    { wch: 12 },  // Stacking
    { wch: 10 },  // Row
    { wch: 10 },  // Minomi
    { wch: 18 },  // PartNo
    { wch: 24 },  // PartName
    { wch: 8  },  // Qty
    { wch: 14 },  // PC_Addr
    { wch: 12 },  // Multi Addr
    { wch: 8  },  // Source
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Final Result');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}