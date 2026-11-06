import React, { useState, useEffect, useMemo } from 'react';
import { SetupFormData } from '../types';
import { AnalogClock } from './AnalogClock';
import { PHARMACY_CURRICULUM, getClassConfig } from '../data/curriculum';

interface SetupFormProps {
  onStart: (data: SetupFormData) => void;
}

type SubjectCategory = 'all' | 'theory' | 'practical';

const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [formData, setFormData] = useState<SetupFormData>({
    year: 'First Year (B.Pharm)',
    lecture: '',
    facultyName: '',
    totalStudents: '60',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
  });

  const [subjectFilter, setSubjectFilter] = useState<SubjectCategory>('all');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectText, setCustomSubjectText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current class curriculum based on selected year
  const currentClass = useMemo(() => {
    return getClassConfig(formData.year) || PHARMACY_CURRICULUM[0];
  }, [formData.year]);

  // When year changes, reset custom subject or adjust lecture if needed
  const handleYearChange = (newYear: string) => {
    const targetClass = getClassConfig(newYear) || PHARMACY_CURRICULUM[0];
    setFormData(prev => ({
      ...prev,
      year: newYear,
      lecture: targetClass.theorySubjects[0] || '',
    }));
    setIsCustomSubject(false);
    setCustomSubjectText('');
    setSearchQuery('');
  };

  // Initialize first lecture if empty on initial mount
  useEffect(() => {
    if (!formData.lecture && currentClass.theorySubjects.length > 0) {
      setFormData(prev => ({ ...prev, lecture: currentClass.theorySubjects[0] }));
    }
  }, [currentClass]);

  // Filtered lists
  const availableTheory = useMemo(() => {
    if (!currentClass) return [];
    if (!searchQuery.trim()) return currentClass.theorySubjects;
    return currentClass.theorySubjects.filter(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentClass, searchQuery]);

  const availablePractical = useMemo(() => {
    if (!currentClass) return [];
    if (!searchQuery.trim()) return currentClass.practicalSubjects;
    return currentClass.practicalSubjects.filter(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentClass, searchQuery]);

  const displayedSubjects = useMemo(() => {
    if (subjectFilter === 'theory') return { theory: availableTheory, practical: [] };
    if (subjectFilter === 'practical') return { theory: [], practical: availablePractical };
    return { theory: availableTheory, practical: availablePractical };
  }, [subjectFilter, availableTheory, availablePractical]);

  const totalFilteredCount = displayedSubjects.theory.length + displayedSubjects.practical.length;

  const handleSelectSubject = (subjectName: string) => {
    if (subjectName === '__custom__') {
      setIsCustomSubject(true);
      setFormData(prev => ({ ...prev, lecture: customSubjectText }));
    } else {
      setIsCustomSubject(false);
      setFormData(prev => ({ ...prev, lecture: subjectName }));
    }
  };

  const handleCustomSubjectChange = (val: string) => {
    setCustomSubjectText(val);
    setFormData(prev => ({ ...prev, lecture: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLecture = isCustomSubject ? customSubjectText.trim() : formData.lecture.trim();
    if (
      formData.year &&
      finalLecture &&
      formData.totalStudents &&
      formData.facultyName &&
      formData.startTime &&
      formData.endTime
    ) {
      onStart({
        ...formData,
        lecture: finalLecture,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="mb-8 text-center border-b border-slate-50 dark:border-slate-800/80 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Setup Session</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          Select class, filter lectures/practicals, and configure timing to start taking attendance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Details & Subject Picker */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between border-b border-indigo-50 dark:border-indigo-950 pb-2">
            <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Session Details
            </h3>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {currentClass.program}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              Faculty Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm font-medium"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
            />
          </div>

          {/* Year / Class Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Year / Class
              </label>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                Filters subjects below
              </span>
            </div>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-bold text-sm"
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <optgroup label="Bachelor of Pharmacy (B.Pharm)">
                <option value="First Year (B.Pharm)">First Year (B.Pharm) - F.Y.</option>
                <option value="Second Year (B.Pharm)">Second Year (B.Pharm) - S.Y.</option>
                <option value="Third Year (B.Pharm)">Third Year (B.Pharm) - T.Y.</option>
                <option value="Fourth Year (B.Pharm)">Fourth Year (B.Pharm) - Final Year</option>
              </optgroup>
              <optgroup label="Diploma in Pharmacy (D.Pharm)">
                <option value="First Year (D.Pharm)">First Year (D.Pharm) - F.Y.</option>
                <option value="Second Year (D.Pharm)">Second Year (D.Pharm) - S.Y.</option>
              </optgroup>
            </select>
          </div>

          {/* Subject / Lecture Selection with Dynamic Filters */}
          <div className="bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Lecture / Subject
              </label>
              
              {/* Filter Pills: All | Theory | Practical */}
              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSubjectFilter('all')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    subjectFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({currentClass.theorySubjects.length + currentClass.practicalSubjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectFilter('theory')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    subjectFilter === 'theory'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Theory ({currentClass.theorySubjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectFilter('practical')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    subjectFilter === 'practical'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Practical ({currentClass.practicalSubjects.length})
                </button>
              </div>
            </div>

            {/* Quick search input if faculty wants to type-filter */}
            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={`Search ${currentClass.name} subjects...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ×
                </button>
              )}
            </div>

            {/* Main Subject Select Dropdown filtered by selected year/class */}
            {!isCustomSubject ? (
              <div>
                <select
                  required={!isCustomSubject}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-medium text-sm leading-relaxed"
                  value={formData.lecture}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                >
                  <option value="" disabled>-- Select Subject for {currentClass.shortCode} --</option>
                  
                  {displayedSubjects.theory.length > 0 && (
                    <optgroup label={`📚 Theory Subjects (${displayedSubjects.theory.length})`}>
                      {displayedSubjects.theory.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {displayedSubjects.practical.length > 0 && (
                    <optgroup label={`🔬 Practical Subjects (${displayedSubjects.practical.length})`}>
                      {displayedSubjects.practical.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {totalFilteredCount === 0 && (
                    <option value="" disabled>No subjects matching &quot;{searchQuery}&quot;</option>
                  )}

                  <optgroup label="Other Options">
                    <option value="__custom__">✍️ + Enter Custom / Other Subject...</option>
                  </optgroup>
                </select>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    ✍️ Custom Subject Entry
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubject(false);
                      setFormData(prev => ({
                        ...prev,
                        lecture: currentClass.theorySubjects[0] || '',
                      }));
                    }}
                    className="text-[11px] text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 underline font-semibold"
                  >
                    Back to curriculum list
                  </button>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Remedial Seminar / Guest Lecture"
                  className="w-full px-4 py-3 rounded-xl border border-indigo-300 dark:border-indigo-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                  value={customSubjectText}
                  onChange={(e) => handleCustomSubjectChange(e.target.value)}
                />
              </div>
            )}

            {/* Quick Status / Selected Subject Pill */}
            {formData.lecture && !isCustomSubject && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="truncate">
                  Selected: <strong className="text-slate-800 dark:text-slate-200">{formData.lecture}</strong>
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              Total Students
            </label>
            <input
              type="number"
              required
              min="1"
              max="300"
              placeholder="e.g. 60 or 100"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm font-medium"
              value={formData.totalStudents}
              onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Proceed to Grid</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Timing with Analogue Watches */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-50 dark:border-indigo-950 pb-2">
            Session Timing (Start - End)
          </h3>
          
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

          {/* Quick Curriculum Overview Card */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-4 border border-indigo-100/60 dark:border-indigo-900/30 text-xs">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{currentClass.name} Curriculum</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Configured with standard PCI syllabus: <strong>{currentClass.theorySubjects.length} theory subjects</strong> and <strong>{currentClass.practicalSubjects.length} practical subjects</strong>. All filtered automatically as you switch classes.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
