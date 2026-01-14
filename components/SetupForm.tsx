
import React, { useState } from 'react';
import { SetupFormData } from '../types';

interface SetupFormProps {
  onStart: (data: SetupFormData) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [formData, setFormData] = useState<SetupFormData>({
    year: '',
    lecture: '',
    facultyName: '',
    totalStudents: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.year && formData.lecture && formData.totalStudents && formData.facultyName) {
      onStart(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Setup Session</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Fill in the details to start tracking</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
          <input
            type="text"
            required
            placeholder="e.g. Final Year - Div A"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Lecture / Subject</label>
          <input
            type="text"
            required
            placeholder="e.g. Computer Graphics"
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

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all transform active:scale-[0.98] mt-4"
        >
          Proceed to Grid
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
