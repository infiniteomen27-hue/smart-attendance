
import React, { useState } from 'react';
import { AttendanceSession } from '../types';
import { generateAttendancePDF } from '../services/pdfService';

interface AttendanceGridProps {
  session: AttendanceSession;
  onToggleRoll: (roll: number) => void;
  onReset: () => void;
  onSave: () => void;
}

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ session, onToggleRoll, onReset, onSave }) => {
  const students = Array.from({ length: session.totalStudents }, (_, i) => i + 1);
  const presentCount = session.presentRolls.size;

  const [copyFormat, setCopyFormat] = useState<'comma' | 'space' | 'newline'>('comma');
  const [copied, setCopied] = useState(false);
  const [copiedAbsent, setCopiedAbsent] = useState(false);

  const sortedPresentRolls = Array.from(session.presentRolls as Set<number>).sort((a, b) => a - b);
  const sortedAbsentRolls = students.filter(roll => !session.presentRolls.has(roll));

  const getFormattedPresent = () => {
    if (copyFormat === 'comma') return sortedPresentRolls.join(', ');
    if (copyFormat === 'space') return sortedPresentRolls.join(' ');
    return sortedPresentRolls.join('\n');
  };

  const getFormattedAbsent = () => {
    if (copyFormat === 'comma') return sortedAbsentRolls.join(', ');
    if (copyFormat === 'space') return sortedAbsentRolls.join(' ');
    return sortedAbsentRolls.join('\n');
  };

  const getFormattedPresentWithDetails = () => {
    return [
      `Class: ${session.year}`,
      `Subject: ${session.lecture}`,
      `Faculty: ${session.facultyName}`,
      `Date: ${session.date}`,
      `Timing: ${session.time}`,
      `Present Count: ${sortedPresentRolls.length} / ${session.totalStudents}`,
      `----------------------------------------`,
      getFormattedPresent()
    ].join('\n');
  };

  const getFormattedAbsentWithDetails = () => {
    return [
      `Class: ${session.year}`,
      `Subject: ${session.lecture}`,
      `Faculty: ${session.facultyName}`,
      `Date: ${session.date}`,
      `Timing: ${session.time}`,
      `Absent Count: ${sortedAbsentRolls.length} / ${session.totalStudents}`,
      `----------------------------------------`,
      getFormattedAbsent()
    ].join('\n');
  };

  const handleCopyPresent = () => {
    const text = getFormattedPresentWithDetails();
    if (!sortedPresentRolls.length) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAbsent = () => {
    const text = getFormattedAbsentWithDetails();
    if (!sortedAbsentRolls.length) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAbsent(true);
      setTimeout(() => setCopiedAbsent(false), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Session Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 border border-white dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-10 transition-colors duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Live Session</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{session.lecture}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide uppercase">{session.year}</p>
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full hidden sm:block"></span>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Faculty: {session.facultyName}</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
            <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">📅 {session.date}</span>
            <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">🕒 {session.time}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-lg flex items-baseline gap-2">
            <span className="text-3xl font-black">{presentCount}</span>
            <span className="text-slate-400 text-sm font-bold">/ {session.totalStudents}</span>
            <div className="ml-4 border-l border-slate-700 pl-4">
              <p className="text-[10px] text-slate-400 font-black uppercase leading-none">Present</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full justify-end">
            <button
              onClick={onSave}
              className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              Save Record
            </button>
            <button
              onClick={() => generateAttendancePDF(session)}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 border border-white dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Attendance Sheet</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Tap a box to mark student presence.</p>
          </div>
          <div className="flex gap-4 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-green-500 shadow-sm shadow-green-100 dark:shadow-none"></div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700"></div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Absent</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 md:gap-4">
          {students.map((roll) => {
            const isPresent = session.presentRolls.has(roll);
            return (
              <button
                key={roll}
                onClick={() => onToggleRoll(roll)}
                className={`
                  aspect-square w-full rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all transform active:scale-90
                  ${isPresent 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-none scale-105 z-0 border-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-700 border-2 border-slate-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-800 hover:text-green-400 dark:hover:text-green-600'}
                `}
              >
                {roll}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Copy & Paste Summary Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 border border-white dark:border-slate-800 transition-colors duration-300 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              </svg>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Copy Summary</h3>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Easily copy present/absent roll numbers for portals or spreadsheets.</p>
          </div>
          
          {/* Format Selector */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-2">Format:</span>
            <button
              onClick={() => setCopyFormat('comma')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copyFormat === 'comma' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Comma
            </button>
            <button
              onClick={() => setCopyFormat('space')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copyFormat === 'space' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Space
            </button>
            <button
              onClick={() => setCopyFormat('newline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copyFormat === 'newline' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Present Rolls Copy Card */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Present ({sortedPresentRolls.length})</span>
              </div>
              {sortedPresentRolls.length > 0 && (
                <button
                  onClick={handleCopyPresent}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copy List
                    </>
                  )}
                </button>
              )}
            </div>
            
            {sortedPresentRolls.length > 0 ? (
              <div 
                onClick={handleCopyPresent}
                className="group relative cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 transition-all font-mono text-sm max-h-40 overflow-y-auto select-all text-slate-800 dark:text-slate-200"
              >
                <div className="whitespace-pre-wrap break-all leading-relaxed">
                  {getFormattedPresentWithDetails()}
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                  Click to Copy
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">No students marked present yet.</p>
              </div>
            )}
          </div>

          {/* Absent Rolls Copy Card */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Absent ({sortedAbsentRolls.length})</span>
              </div>
              {sortedAbsentRolls.length > 0 && (
                <button
                  onClick={handleCopyAbsent}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${copiedAbsent ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  {copiedAbsent ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copy List
                    </>
                  )}
                </button>
              )}
            </div>
            
            {sortedAbsentRolls.length > 0 ? (
              <div 
                onClick={handleCopyAbsent}
                className="group relative cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 transition-all font-mono text-sm max-h-40 overflow-y-auto select-all text-slate-800 dark:text-slate-200"
              >
                <div className="whitespace-pre-wrap break-all leading-relaxed">
                  {getFormattedAbsentWithDetails()}
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                  Click to Copy
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">No students marked absent.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;
