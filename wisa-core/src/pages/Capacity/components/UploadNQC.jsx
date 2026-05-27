export default function UploadNQC({ nqcFile, setNqcFile, targetMonth, setTargetMonth, onProcess, loading, error }) {
  return (
    <div className="bg-white rounded-3xl p-7 border border-black/5 shadow-sm">

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-wisa-pink flex items-center justify-center text-white text-sm font-bold shadow">
          1
        </div>
        <div>
          <h2 className="text-sm font-bold text-wisa-dark">Upload NQC File</h2>
          <p className="text-xs text-gray-400">อัพโหลดไฟล์ NQC และเลือกเดือนที่ต้องการ</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* File button */}
        <label className="flex items-center gap-2 bg-wisa-dark text-white px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-85 transition text-sm font-medium shrink-0">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v11"/>
          </svg>
          เลือกไฟล์ NQC
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e => setNqcFile(e.target.files?.[0] || null)} />
        </label>

        {/* Filename */}
        <div className="flex-1 min-w-0 bg-black/4 rounded-xl px-4 py-2.5 border border-black/8">
          <p className="text-sm text-gray-500 truncate">
            {nqcFile ? nqcFile.name : 'ยังไม่ได้เลือกไฟล์...'}
          </p>
        </div>

        {/* Month */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gray-500">เดือน</span>
          <input
            type="text"
            value={targetMonth}
            onChange={e => setTargetMonth(e.target.value)}
            placeholder="May-26"
            className="w-24 border border-black/12 rounded-xl px-3 py-2.5 text-sm text-wisa-dark outline-none focus:border-wisa-pink transition text-center font-medium"
          />
        </div>

        {/* Process btn */}
        <button
          onClick={onProcess}
          disabled={loading}
          className="bg-wisa-pink text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-85 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              กำลังประมวลผล...
            </>
          ) : (
            <>
              <span>▶</span> ประมวลผล
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  );
}