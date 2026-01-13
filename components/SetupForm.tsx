
import React, { useState } from 'react';
import { SetupFormData } from '../types';

interface SetupFormProps {
  onStart: (data: SetupFormData) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [formData, setFormData] = useState<SetupFormData>({
    year: '',
    lecture: '',
    totalStudents: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.year && formData.lecture && formData.totalStudents) {
      onStart(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">SmartAttend</h1>
        <p className="text-slate-500">Quickly set up your attendance session</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Year / Class</label>
          <input
            type="text"
            required
            placeholder="e.g. Final Year B.Tech - Div A"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lecture / Subject Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Advanced Mathematics"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.lecture}
            onChange={(e) => setFormData({ ...formData, lecture: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Students</label>
          <input
            type="number"
            required
            min="1"
            max="300"
            placeholder="e.g. 120"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.totalStudents}
            onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
        >
          Proceed to Attendance
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
