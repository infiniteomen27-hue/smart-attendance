
import React, { useState } from 'react';
import { AttendanceSession } from '../types';

interface HistoryViewProps {
  history: AttendanceSession[];
  onEdit: (session: AttendanceSession) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onEdit, onDelete, onBack }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (record: AttendanceSession) => {
    const rollsArray = Array.from(record.presentRolls as Set<number>);
    const sorted = rollsArray.sort((a, b) => a - b);
    if (sorted.length === 0) {
      alert('No students were marked present.');
      return;
    }
    const formattedRolls = sorted.join(', ');
    const formattedText = [
      `Class: ${record.year}`,
      `Subject: ${record.lecture}`,
      `Faculty: ${record.facultyName}`,
      `Date: ${record.date}`,
      `Timing: ${record.time}`,
      `Present Count: ${sorted.length} / ${record.totalStudents}`,
      `----------------------------------------`,
      formattedRolls
    ].join('\n');

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">History Records</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage and edit your past attendance sessions</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold">No history records found yet.</p>
          <button 
            onClick={onBack}
            className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
          >
            Go Start a Session
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((record) => (
            <div 
              key={record.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{record.lecture}</h3>
                <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-bold text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400 uppercase">{record.year}</span>
                  <span className="h-1 w-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                  <span>{record.date}</span>
                  <span className="h-1 w-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                  <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                    {record.presentRolls.size} / {record.totalStudents} Present
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCopy(record)}
                  className={`flex-1 sm:flex-none font-bold py-2 px-5 rounded-xl transition-all text-sm active:scale-95 flex items-center justify-center gap-1.5 ${copiedId === record.id ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {copiedId === record.id ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copy List
                    </>
                  )}
                </button>
                <button
                  onClick={() => onEdit(record)}
                  className="flex-1 sm:flex-none bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-bold py-2 px-5 rounded-xl transition-all text-sm active:scale-95"
                >
                  Edit Record
                </button>
                <button
                  onClick={() => onDelete(record.id)}
                  className="p-2.5 text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Delete Record"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
