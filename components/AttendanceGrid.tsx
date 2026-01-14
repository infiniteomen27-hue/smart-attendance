
import React from 'react';
import { AttendanceSession } from '../types';
import { generateAttendancePDF } from '../services/pdfService';

interface AttendanceGridProps {
  session: AttendanceSession;
  onToggleRoll: (roll: number) => void;
  onReset: () => void;
}

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ session, onToggleRoll, onReset }) => {
  const students = Array.from({ length: session.totalStudents }, (_, i) => i + 1);
  const presentCount = session.presentRolls.size;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Session Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 border border-white dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-4 z-10 transition-colors duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Session</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{session.lecture}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide uppercase">{session.year}</p>
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full hidden sm:block"></span>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Faculty: {session.facultyName}</p>
          </div>
          <div className="flex gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mt-2">
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
          
          <div className="flex gap-2 w-full">
             <button
              onClick={onReset}
              className="flex-1 md:flex-none bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-100 hover:text-red-500 dark:hover:text-red-400 font-bold py-2.5 px-5 rounded-xl transition-all text-sm active:scale-95"
            >
              New Class
            </button>
            <button
              onClick={() => generateAttendancePDF(session)}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-white dark:border-slate-800 transition-colors duration-300">
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

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 md:gap-4">
          {students.map((roll) => {
            const isPresent = session.presentRolls.has(roll);
            return (
              <button
                key={roll}
                onClick={() => onToggleRoll(roll)}
                className={`
                  aspect-square w-full rounded-2xl font-black text-lg transition-all transform active:scale-90
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
    </div>
  );
};

export default AttendanceGrid;
