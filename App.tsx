
import React, { useState, useCallback, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import AttendanceGrid from './components/AttendanceGrid';
import { AttendanceSession, SetupFormData } from './types';

const STORAGE_KEY = 'smart_attend_session';

const App: React.FC = () => {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert array back to Set for the presentRolls
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

  // Save session to localStorage whenever it changes
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
    if (confirm('Are you sure? This will permanently delete the current attendance data and start a new session.')) {
      setSession(null);
    }
  };

  if (!isLoaded) return null; // Prevent flash of empty state

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-8 bg-slate-50 flex flex-col">
      <header className="max-w-6xl mx-auto mb-10 text-center">
        {!session && (
          <div className="flex flex-col items-center">
            <div className="inline-block p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6 transform transition-hover hover:rotate-12">
               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SmartAttend</h1>
            <p className="mt-2 text-slate-500 font-medium">Professional grade attendance tracking.</p>
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

      <footer className="mt-16 pb-8 text-center">
        <div className="max-w-xs mx-auto border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm font-medium">&copy; {new Date().getFullYear()} SmartAttend</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent uppercase tracking-widest">
              Coded by Rohsik
            </p>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
