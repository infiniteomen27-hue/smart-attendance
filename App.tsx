
import React, { useState, useCallback, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import AttendanceGrid from './components/AttendanceGrid';
import HistoryView from './components/HistoryView';
import { AttendanceSession, SetupFormData } from './types';

const STORAGE_KEY = 'smart_attend_session';
const HISTORY_KEY = 'smart_attend_history';
const THEME_KEY = 'smart_attend_theme';

type ViewState = 'setup' | 'grid' | 'history';

const App: React.FC = () => {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [history, setHistory] = useState<AttendanceSession[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('setup');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme toggle helper
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  // State persistence loading
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession({
          ...parsed,
          presentRolls: new Set(parsed.presentRolls)
        });
        setCurrentView('grid'); // Default to grid if a session exists
      } catch (e) {
        console.error("Failed to load saved session", e);
      }
    }

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({
          ...item,
          presentRolls: new Set(item.presentRolls)
        })));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // State persistence saving
  useEffect(() => {
    if (!isLoaded) return;
    
    if (session) {
      const toSave = { ...session, presentRolls: Array.from(session.presentRolls) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    const historyToSave = history.map(h => ({
      ...h,
      presentRolls: Array.from(h.presentRolls)
    }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyToSave));
  }, [session, history, isLoaded]);

  const startSession = (data: SetupFormData) => {
    const now = new Date();
    const newSession: AttendanceSession = {
      id: crypto.randomUUID(),
      year: data.year,
      lecture: data.lecture,
      facultyName: data.facultyName,
      totalStudents: parseInt(data.totalStudents, 10),
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      presentRolls: new Set<number>(),
    };
    setSession(newSession);
    setCurrentView('grid');
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

  const saveToHistory = () => {
    if (!session) return;
    setHistory(prev => [session, ...prev.filter(h => h.id !== session.id)]);
    setSession(null);
    setCurrentView('setup');
    alert('Attendance record saved to history!');
  };

  const discardSession = () => {
    if (confirm('Discard session? Changes will not be saved.')) {
      setSession(null);
      setCurrentView('setup');
    }
  };

  const handleBack = () => {
    if (currentView === 'history') {
      setCurrentView(session ? 'grid' : 'setup');
    } else if (currentView === 'grid') {
      // In grid view, "Back" just hides the grid but doesn't delete session data
      setCurrentView('setup');
    }
  };

  const deleteFromHistory = (id: string) => {
    if (confirm('Permanently delete this record?')) {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  const editHistoryItem = (record: AttendanceSession) => {
    setSession(record);
    setCurrentView('grid');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen py-6 px-4 md:py-8 md:px-8 flex flex-col transition-colors duration-300">
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center mb-12 z-50">
        <div className="flex items-center gap-3">
          {currentView !== 'setup' ? (
             <button 
                onClick={handleBack}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90 flex items-center gap-2 group shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                <span className="hidden sm:inline font-bold text-sm">Back</span>
              </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">SmartAttend</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentView === 'setup' && history.length > 0 && (
             <button 
              onClick={() => setCurrentView('history')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
              History
            </button>
          )}
          
          {session && currentView === 'setup' && (
            <button 
              onClick={() => setCurrentView('grid')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Resume Grid
            </button>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center w-full">
        {currentView === 'history' ? (
          <HistoryView 
            history={history} 
            onEdit={editHistoryItem} 
            onDelete={deleteFromHistory} 
            onBack={() => setCurrentView('setup')} 
          />
        ) : currentView === 'grid' && session ? (
          <AttendanceGrid 
            session={session} 
            onToggleRoll={toggleRoll} 
            onReset={discardSession}
            onSave={saveToHistory}
          />
        ) : (
          <div className="w-full">
            <header className="mb-8 text-center animate-in fade-in duration-700">
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">SmartAttend</h1>
               <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Professional Attendance Management</p>
            </header>
            <SetupForm onStart={startSession} />
          </div>
        )}
      </main>

      <footer className="mt-16 pb-8 text-center animate-in fade-in duration-1000">
        <div className="max-w-xs mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} SmartAttend</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
            <p className="text-[10px] font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent uppercase tracking-[0.3em]">
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
