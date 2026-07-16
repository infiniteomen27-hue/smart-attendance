
import React, { useState } from 'react';
import { SetupFormData } from '../types';
import { AnalogClock } from './AnalogClock';

interface SetupFormProps {
  onStart: (data: SetupFormData) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [formData, setFormData] = useState<SetupFormData>({
    year: 'F.Y. B.pharm',
    lecture: '',
    facultyName: '',
    totalStudents: '',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.year && formData.lecture && formData.totalStudents && formData.facultyName && formData.startTime && formData.endTime) {
      onStart(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="mb-8 text-center border-b border-slate-50 dark:border-slate-800/80 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Setup Session</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Fill in the details and set the lecture timing to start tracking</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-50 dark:border-indigo-950 pb-2">Session Details</h3>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Faculty Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Year / Class</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-medium"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            >
              <option value="F.Y. B.pharm">F.Y. B.pharm</option>
              <option value="S.Y. B.pharm">S.Y. B.pharm</option>
              <option value="T.Y. B.pharm">T.Y. B.pharm</option>
              <option value="Final year B.pharm">Final year B.pharm</option>
              <option value="F.Y. D.pharm">F.Y. D.pharm</option>
              <option value="S.Y. D.pharm">S.Y. D.pharm</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Lecture / Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Pharmaceutics I"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={formData.lecture}
              onChange={(e) => setFormData({ ...formData, lecture: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Total Students</label>
            <input
              type="number"
              required
              min="1"
              max="300"
              placeholder="e.g. 60"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={formData.totalStudents}
              onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all transform active:scale-[0.98]"
            >
              Proceed to Grid
            </button>
          </div>
        </div>

        {/* Right Column: Timing with Analogue Watches */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-50 dark:border-indigo-950 pb-2">Session Timing (Start - End)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnalogClock
              label="Start Time"
              timeValue={formData.startTime}
              onChange={(newVal) => setFormData({ ...formData, startTime: newVal })}
            />
            <AnalogClock
              label="End Time"
              timeValue={formData.endTime}
              onChange={(newVal) => setFormData({ ...formData, endTime: newVal })}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800/60">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
              Selected Time Range: <span className="text-indigo-600 dark:text-indigo-400 font-black">{formData.startTime}</span> to <span className="text-indigo-600 dark:text-indigo-400 font-black">{formData.endTime}</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
