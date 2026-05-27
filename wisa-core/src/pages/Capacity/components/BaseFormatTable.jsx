import { useState } from 'react';

const PAGE_SIZE = 15;
const COLS = ['Source','Dock','Sup','PartNo','PartName','KBN','Qty','PC_Addr','Addr','Multi Addr'];

export default function BaseFormatTable({ data, onDownloadTemplate, onNext }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pageData   = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">

      {/* Card header */}
      <div className="bg-white rounded-3xl p-7 border border-black/5 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-wisa-pink flex items-center justify-center text-white text-sm font-bold shadow">
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-wisa-dark">Base Format</h2>
              <p className="text-xs text-gray-400">
                ผลลัพธ์ที่ประมวลผลแล้ว —&nbsp;
                <span className="text-wisa-pink font-semibold">{data.length.toLocaleString()}</span> แถว
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onDownloadTemplate}
              className="flex items-center gap-2 border-2 border-wisa-dark text-wisa-dark px-5 py-2 rounded-xl text-sm font-semibold hover:bg-wisa-dark hover:text-white transition"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11"/>
              </svg>
              ดาวน์โหลด Input Template
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 bg-wisa-pink text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-85 transition"
            >
              ไปขั้นตอนถัดไป
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-wisa-dark text-left">
                <th className="px-4 py-3 text-white/50 font-semibold">#</th>
                {COLS.map(col => (
                  <th key={col} className="px-4 py-3 text-white font-semibold tracking-wide">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-black/4 transition hover:bg-wisa-pink/4 ${
                    row['Multi Addr'] === 'Yes' ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-gray-300 font-medium">
                    {(page - 1) * PAGE_SIZE + i + 1}
                  </td>
                  {COLS.map(col => (
                    <td key={col} className="px-4 py-3 text-wisa-dark">
                      {col === 'Multi Addr' && row[col] === 'Yes' ? (
                        <span className="bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
                          Multi
                        </span>
                      ) : col === 'Source' ? (
                        <span className="bg-black/5 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                          {row[col]}
                        </span>
                      ) : (
                        <span className="text-gray-600">{row[col] ?? ''}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-black/5 bg-black/1">
            <span className="text-xs text-gray-400 font-medium">
              แสดง {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.length)} จาก {data.length.toLocaleString()} แถว
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-gray-500 disabled:opacity-30 hover:bg-black/5 transition text-xs font-bold"
              >
                ‹
              </button>
              <span className="text-xs font-semibold text-wisa-dark px-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-gray-500 disabled:opacity-30 hover:bg-black/5 transition text-xs font-bold"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}