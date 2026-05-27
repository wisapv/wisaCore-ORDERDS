import Header from '../../components/Header';
import UploadNQC from './components/UploadNQC';
import BaseFormatTable from './components/BaseFormatTable';
import KeyMatchingPanel from './components/KeyMatchingPanel';
import { useCapacity } from './hooks/useCapacity';

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const STEPS = [
  { no: 1, label: 'Upload NQC'   },
  { no: 2, label: 'Base Format'  },
  { no: 3, label: 'Key Matching' },
  { no: 4, label: 'Done'         },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-1 mb-7">
      {STEPS.map((s, i) => {
        const done   = current > s.no;
        const active = current === s.no;
        return (
          <div key={s.no} className="flex items-center gap-1">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              active ? 'bg-wisa-pink text-white shadow-md shadow-wisa-pink/30'
              : done  ? 'bg-wisa-dark text-white'
              : 'bg-black/5 text-gray-400'
            }`}>
              {done
                ? <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                : <span>{s.no}</span>
              }
              <span>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-5 transition-all duration-300 ${done ? 'bg-wisa-dark' : 'bg-black/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CapacityPage() {
  const cap = useCapacity();

  return (
    <>
      <Header title="Capacity Flowrack" />
      <StepBar current={cap.step} />

      <div className="flex flex-col gap-5">

        {/* Step 1 — Upload NQC */}
        <UploadNQC
          nqcFile={cap.nqcFile}
          setNqcFile={cap.setNqcFile}
          targetMonth={cap.targetMonth}
          setTargetMonth={cap.setTargetMonth}
          onProcess={cap.handleUploadNQC}
          loading={cap.loadingNQC}
          error={cap.step === 1 ? cap.error : ''}
        />

        {/* Step 2 — Base Format Table */}
        {cap.step >= 2 && cap.baseData.length > 0 && (
          <BaseFormatTable
            data={cap.baseData}
            onDownloadTemplate={cap.handleDownloadTemplate}
            onNext={() => { cap.setStep(3); cap.setError(''); }}
          />
        )}

        {/* Step 3 — Key Matching */}
        {cap.step >= 3 && (
          <KeyMatchingPanel
            inputFile={cap.inputFile}
            setInputFile={cap.setInputFile}
            keyColumn={cap.keyColumn}
            setKeyColumn={cap.setKeyColumn}
            onMatch={cap.handleMatching}
            loading={cap.loadingMatch}
            error={cap.step === 3 ? cap.error : ''}
          />
        )}

        {/* Step 4 — Done */}
        {cap.step === 4 && (
          <div className="bg-white rounded-3xl p-7 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-wisa-dark">เสร็จสิ้น!</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    ไฟล์ Final Result ดาวน์โหลดแล้ว — พร้อมนำไปใช้งาน
                  </p>
                </div>
              </div>
              <button
                onClick={cap.handleReset}
                className="flex items-center gap-2 border-2 border-wisa-dark text-wisa-dark px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-wisa-dark hover:text-white transition"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
                </svg>
                เริ่มใหม่
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}