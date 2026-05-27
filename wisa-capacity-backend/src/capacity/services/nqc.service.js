import * as XLSX from 'xlsx';



// Columns พื้นฐานที่ต้องการดึงมาจาก NQC แบบครบถ้วน

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



function isMonthCol(col) {

  return /^[A-Za-z]{3}-\d{2}$/.test(col);

}



const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



function normalizeToMonthStr(col) {

  let str = String(col).trim();

  if (!str) return str;

  if (/^[A-Za-z]{3}-\d{2}$/.test(str)) {

    return str.charAt(0).toUpperCase() + str.slice(1, 3).toLowerCase() + str.slice(3);

  }

  if (!isNaN(str) && Number(str) > 40000) {

    const date = new Date((Number(str) - 25569) * 86400 * 1000);

    const m = date.getUTCMonth();

    const y = String(date.getUTCFullYear()).slice(-2);

    return `${monthNames[m]}-${y}`;

  }

  str = str.split(' ')[0];

  if (str.includes('/') || str.includes('-')) {

    const parts = str.split(/[\/\-]/);

    if (parts.length >= 3) {

      let p1 = parseInt(parts[0], 10);

      let p2 = parseInt(parts[1], 10);

      let p3 = parseInt(parts[2], 10);

      let year = (p3 > 1000) ? p3 : ((p1 > 1000) ? p1 : p3);

      if (year < 100) year = 2000 + year;

      if (year > 2500) year = year - 543;

      let month = p2;

      if (month > 12) month = p1;

      if (month >= 1 && month <= 12) {

        return `${monthNames[month - 1]}-${String(year).slice(-2)}`;

      }

    }

  }

  return str;

}



export function processNQC(buffer, targetMonth) {

  const wb   = XLSX.read(buffer, { type: 'buffer' });

  const ws   = wb.Sheets[wb.SheetNames[0]];

 

  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  let headerIndex = 0;

 

  for (let i = 0; i < rawData.length; i++) {

    if (rawData[i].includes('KBN') || rawData[i].includes('Source') || rawData[i].includes('Key0')) {

      headerIndex = i;

      break;

    }

  }



  const raw = XLSX.utils.sheet_to_json(ws, { defval: '', range: headerIndex });

  if (!raw.length) throw new Error('ไฟล์ว่างเปล่า');



  const normalizedTargetMonth = normalizeToMonthStr(targetMonth);



  const normalizedRaw = raw.map(row => {

    const newRow = {};

    for (const key in row) {

      const newKey = normalizeToMonthStr(key);

      newRow[newKey] = row[key];

    }

    return newRow;

  });



  const allCols       = Object.keys(normalizedRaw[0]);

  const availableMonths = allCols.filter(isMonthCol);



  if (!availableMonths.includes(normalizedTargetMonth)) {

    throw new Error(`ไม่พบเดือน "${normalizedTargetMonth}"\nคอลัมน์ที่ระบบอ่านได้คือ: [ ${allCols.join(', ')} ]`);

  }



  // 1. กรอง Source = 3 ออก และจัดการข้อมูลเฉพาะทางตามเงื่อนไข

  let rows = normalizedRaw.filter(r => {

    if (String(r['Source']).trim() === '3') return false;

   

    const partName = String(r['PartName'] || '').toUpperCase();

    const fullRowStr = Object.values(r).join(' ').toUpperCase();

   

    // Drop ข้อมูลที่เป็น WHEEL ASSY ทิ้ง (แต่เก็บ WHEEL ASSY STEERING ไว้)

    if (partName.includes('WHEEL ASSY') && !partName.includes('WHEEL ASSY STEERING')) {

      return false;

    }

   

    // Drop ข้อมูลที่เป็น Shop K ทิ้งไปเลย

    if (fullRowStr.includes('SHOP K')) {

      return false;

    }

   

    return true;

  });



  // 2. กรองเดือนที่ User เลือก หากมีค่า = 0 หรือ blank ให้ลบทิ้ง

  rows = rows.filter(r => {

    const val = r[normalizedTargetMonth];

    return val !== '' && val !== 0 && val !== '0';

  });



  const keepCols = [...BASE_COLS, ...availableMonths];

  const result = [];



  for (const row of rows) {

    const addrs = ADDR_COLS

      .map(col => ({ col, val: String(row[col] || '').trim() }))

      .filter(a => a.val !== '');



    // เช็คว่ามีมากกว่า 2 addr หรือไม่

    const isMulti = addrs.length > 2;



    if (addrs.length === 0) {

      result.push(buildRow(row, keepCols, '', isMulti, normalizedTargetMonth));

    } else {

      // Duplicate บรรทัดตามจำนวน Addr ที่มี

      for (const addr of addrs) {

        result.push(buildRow(row, keepCols, addr.val, isMulti, normalizedTargetMonth));

      }

    }

  }



  return { data: result, availableMonths };

}



function buildRow(row, keepCols, addrValue, isMulti, targetMonth) {

  const out = {};



  // คืนค่าคอลัมน์ Addr01 ถึง Addr13 กลับมาใน Final Result ตามที่ต้องการ

  for (const col of keepCols) {

    out[col] = row[col] ?? '';

  }



  // สร้างคอลัมน์ใหม่สำหรับให้ Frontend นำไปใช้งานหรือแสดงผล

  out['Target_Addr'] = addrValue;

  out['Month_Value'] = row[targetMonth] ?? 0;

  out['Multi Addr']  = isMulti ? 'Yes' : '';

  out['Remark']      = isMulti ? 'Multi Addr' : 'Normal';

 

  // แยก Operation เป็นก้อน Lineside และ Freelane ออกจากกันชัดเจน

  const upperAddr = String(addrValue).toUpperCase();

  let operation = 'Default';

  if (upperAddr.includes('FREELANE')) operation = 'Freelane';

  else if (upperAddr.includes('LINESIDE')) operation = 'Lineside';

  out['Operation'] = operation;



  return out;

}