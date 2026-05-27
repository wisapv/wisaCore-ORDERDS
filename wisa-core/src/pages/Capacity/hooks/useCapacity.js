import { useState } from 'react';

const API = 'http://localhost:3000/api/capacity';

export function useCapacity() {
  const [step, setStep]                     = useState(1);
  const [nqcFile, setNqcFile]               = useState(null);
  const [targetMonth, setTargetMonth]       = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [baseData, setBaseData]             = useState([]);
  const [loadingNQC, setLoadingNQC]         = useState(false);
  const [inputFile, setInputFile]           = useState(null);
  const [keyColumn, setKeyColumn]           = useState('KBN');
  const [loadingMatch, setLoadingMatch]     = useState(false);
  const [error, setError]                   = useState('');

  async function handleUploadNQC() {
    if (!nqcFile)     return setError('กรุณาเลือกไฟล์ NQC');
    if (!targetMonth) return setError('กรุณาระบุเดือน เช่น May-26');
    setError('');
    setLoadingNQC(true);
    try {
      const fd = new FormData();
      fd.append('file', nqcFile);
      fd.append('targetMonth', targetMonth);
      const res    = await fetch(`${API}/upload-nqc`, { method: 'POST', body: fd });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setBaseData(result.data);
      setAvailableMonths(result.availableMonths);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingNQC(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      const res  = await fetch(`${API}/download-template`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'InputFormat_FlowrackCapacity.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('ดาวน์โหลด Template ไม่สำเร็จ');
    }
  }

  async function handleMatching() {
    if (!inputFile) return setError('กรุณาเลือกไฟล์ Input Format');
    setError('');
    setLoadingMatch(true);
    try {
      const fd = new FormData();
      fd.append('file', inputFile);
      fd.append('keyColumn', keyColumn);
      fd.append('baseData', JSON.stringify(baseData));
      const res = await fetch(`${API}/matching`, { method: 'POST', body: fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'FinalResult_FlowrackCapacity.xlsx'; a.click();
      URL.revokeObjectURL(url);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMatch(false);
    }
  }

  function handleReset() {
    setStep(1); setNqcFile(null); setTargetMonth('');
    setAvailableMonths([]); setBaseData([]);
    setInputFile(null); setKeyColumn('KBN'); setError('');
  }

  return {
    step, setStep,
    nqcFile, setNqcFile,
    targetMonth, setTargetMonth,
    availableMonths,
    baseData,
    loadingNQC,
    inputFile, setInputFile,
    keyColumn, setKeyColumn,
    loadingMatch,
    error, setError,
    handleUploadNQC,
    handleDownloadTemplate,
    handleMatching,
    handleReset,
  };
}