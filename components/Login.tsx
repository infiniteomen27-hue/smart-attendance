
import React, { useState } from 'react';
import { UserRegistry } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
}

const REGISTRY_KEY = 'smart_attend_users_v1';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getRegistry = (): UserRegistry => {
    const data = localStorage.getItem(REGISTRY_KEY);
    return data ? JSON.parse(data) : {};
  };

  const saveRegistry = (registry: UserRegistry) => {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  };

  const generateSuggestions = (base: string, registry: UserRegistry) => {
    const results: string[] = [];
    const suffixes = [
      Math.floor(Math.random() * 999).toString(),
      'pro',
      'edu',
      'admin',
      '2025'
    ];
    
    let attempts = 0;
    while (results.length < 3 && attempts < 10) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const candidate = `${base}_${suffix}`;
      if (!registry[candidate] && !results.includes(candidate)) {
        results.push(candidate);
      }
      attempts++;
    }
    setSuggestions(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuggestions([]);
    
    const cleanUsername = username.trim().toLowerCase();
    const registry = getRegistry();

    if (isSignUp) {
      if (registry[cleanUsername]) {
        setError(`Username "${cleanUsername}" is already taken.`);
        generateSuggestions(cleanUsername, registry);
        return;
      }
      registry[cleanUsername] = {
        username: cleanUsername,
        password,
        history: []
      };
      saveRegistry(registry);
      onLogin(cleanUsername);
    } else {
      const user = registry[cleanUsername];
      if (user && user.password === password) {
        onLogin(cleanUsername);
      } else {
        setError('Invalid username or password');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const selectSuggestion = (name: string) => {
    setUsername(name);
    setSuggestions([]);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full px-4 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden transition-all duration-500">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mx-auto flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">
            SmartAttend Secure Gateway
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                placeholder="rohsik_admin"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/\s/g, ''));
                  if (suggestions.length > 0) setSuggestions([]);
                }}
                required
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-xl animate-shake">
              <p className="text-red-600 dark:text-red-400 text-xs font-bold">{error}</p>
              
              {suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-red-100 dark:border-red-800/50">
                  <p className="text-[9px] text-red-500 uppercase font-black tracking-widest mb-2">Available Suggestions:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all transform active:scale-[0.97] flex items-center justify-center gap-2 group mt-6"
          >
            {isSignUp ? 'Complete Registration' : 'Sign In'}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuggestions([]);
              }}
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isSignUp ? 'Log In' : 'Create One'}
            </button>
          </p>
        </div>

        <p className="mt-6 text-slate-400 dark:text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
          Data encrypted via local vault
        </p>
      </div>
    </div>
  );
};

export default Login;
