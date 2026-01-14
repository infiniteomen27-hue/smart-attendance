
import React, { useState, useCallback, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import AttendanceGrid from './components/AttendanceGrid';
import { AttendanceSession, SetupFormData } from './types';

const STORAGE_KEY = 'smart_attend_session';
const THEME_KEY = 'smart_attend_theme';

const App: React.FC = () => {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialDarkMode = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(initialDarkMode);
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSession({
          ...parsed,
          presentRolls: new Set(parsed.presentRolls)
        });
      } catch (e) {
        console.error("Failed to load saved session", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (isLoaded) {
      if (session) {
        const toSave = {
          ...session,
          presentRolls: Array.from(session.presentRolls)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [session, isLoaded]);

  const startSession = (data: SetupFormData) => {
    const now = new Date();
    const newSession: AttendanceSession = {
      year: data.year,
      lecture: data.lecture,
      facultyName: data.facultyName,
      totalStudents: parseInt(data.totalStudents, 10),
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      presentRolls: new Set<number>(),
    };
    setSession(newSession);
  };

  const toggleRoll = useCallback((roll: number) => {
    setSession((prev) => {
      if (!prev) return null;
      const nextPresent = new Set(prev.presentRolls);
      if (nextPresent.has(roll)) {
        nextPresent.delete(roll);
      } else {
        nextPresent.add(roll);
      }
      return { ...prev, presentRolls: nextPresent };
    });
  }, []);

  const resetSession = () => {
    if (confirm('Are you sure? This will permanently delete current data.')) {
      setSession(null);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-8 bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <header className="max-w-6xl mx-auto mb-10 w-full flex flex-col items-center relative">
        {/* Theme Toggle Button */}
        <div className="absolute right-0 top-0">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>

        {!session && (
          <div className="flex flex-col items-center">
            <div className="inline-block p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 dark:shadow-none mb-6 transform transition-hover hover:rotate-6">
               <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">SmartAttend</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Efficient Tracking for Professionals</p>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {!session ? (
          <SetupForm onStart={startSession} />
        ) : (
          <AttendanceGrid 
            session={session} 
            onToggleRoll={toggleRoll} 
            onReset={resetSession}
          />
        )}
      </main>

      <footer className="mt-16 pb-12 text-center">
        <div className="max-w-xs mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} SmartAttend</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
            <p className="text-xs font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent uppercase tracking-[0.3em]">
              Coded by Rohsik
            </p>
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
