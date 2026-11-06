
import React, { useState } from 'react';
import { AttendanceSession } from '../types';
import { WhatsAppModal } from './WhatsAppModal';

interface HistoryViewProps {
  history: AttendanceSession[];
  onEdit: (session: AttendanceSession) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onEdit, onDelete, onBack }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [whatsAppRecord, setWhatsAppRecord] = useState<AttendanceSession | null>(null);

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

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setWhatsAppRecord(record)}
                  className="flex-1 sm:flex-none bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] font-bold py-2 px-4 rounded-xl transition-all text-sm active:scale-95 flex items-center justify-center gap-1.5"
                  title="Send to WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.761.884 2.802.884 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.587-5.771-5.774-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.57 4.186 1.564 5.941l-1.564 5.714 5.86-1.537c1.705.93 3.655 1.455 5.727 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>
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

      {whatsAppRecord && (
        <WhatsAppModal
          session={whatsAppRecord}
          isOpen={!!whatsAppRecord}
          onClose={() => setWhatsAppRecord(null)}
        />
      )}
    </div>
  );
};

export default HistoryView;
