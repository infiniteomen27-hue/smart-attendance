import React, { useState, useRef, useEffect } from 'react';

interface AnalogClockProps {
  timeValue: string; // e.g. "09:30 AM" or "10:00"
  onChange: (time: string) => void;
  label: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ timeValue, onChange, label }) => {
  // Parse initial time value
  const parseTime = (val: string) => {
    try {
      const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        return {
          hour: parseInt(match[1], 10),
          minute: parseInt(match[2], 10),
          period: match[3].toUpperCase() as 'AM' | 'PM'
        };
      }
    } catch (e) {
      console.error(e);
    }
    return { hour: 9, minute: 0, period: 'AM' as const };
  };

  const { hour, minute, period } = parseTime(timeValue);
  const [activeMode, setActiveMode] = useState<'hour' | 'minute'>('hour');
  const clockRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update a single field and trigger onChange
  const updateTime = (newHour: number, newMinute: number, newPeriod: 'AM' | 'PM') => {
    const formattedHour = String(newHour).padStart(2, '0');
    const formattedMinute = String(newMinute).padStart(2, '0');
    onChange(`${formattedHour}:${formattedMinute} ${newPeriod}`);
  };

  const handlePeriodChange = (p: 'AM' | 'PM') => {
    updateTime(hour, minute, p);
  };

  // Convert coordinate to angle and update hour/minute
  const handlePointerAction = (e: React.PointerEvent<SVGSVGElement> | PointerEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Angle in degrees from 12 o'clock (0 to 360)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (activeMode === 'hour') {
      // Each hour is 30 degrees (360 / 12)
      let selectedHour = Math.round(angle / 30);
      if (selectedHour === 0) selectedHour = 12;
      updateTime(selectedHour, minute, period);
    } else {
      // Each minute is 6 degrees (360 / 60)
      let selectedMinute = Math.round(angle / 6) % 60;
      updateTime(hour, selectedMinute, period);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    handlePointerAction(e);
    if (clockRef.current) {
      clockRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    handlePointerAction(e);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    if (clockRef.current) {
      clockRef.current.releasePointerCapture(e.pointerId);
    }
    // Automatically transition to minute mode after picking the hour for a smoother workflow
    if (activeMode === 'hour') {
      setTimeout(() => setActiveMode('minute'), 300);
    }
  };

  // Radial positioning coordinates for numbers
  const getCoordinates = (index: number, total: number, radius: number) => {
    // 12 o'clock is at angle -90 degrees
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    return {
      x: 100 + radius * Math.cos(angle),
      y: 100 + radius * Math.sin(angle)
    };
  };

  // Clock Hand Angles
  const hourHandAngle = (hour % 12) * 30 + (minute / 60) * 30 - 90;
  const minuteHandAngle = minute * 6 - 90;

  const hourHandX = 100 + 45 * Math.cos(hourHandAngle * (Math.PI / 180));
  const hourHandY = 100 + 45 * Math.sin(hourHandAngle * (Math.PI / 180));

  const minuteHandX = 100 + 65 * Math.cos(minuteHandAngle * (Math.PI / 180));
  const minuteHandY = 100 + 65 * Math.sin(minuteHandAngle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{label}</span>
      
      {/* Digital & Period Picker */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 font-mono text-xl font-bold text-slate-800 dark:text-white">
          <button
            type="button"
            onClick={() => setActiveMode('hour')}
            className={`px-1.5 py-0.5 rounded transition-all ${activeMode === 'hour' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' : 'hover:text-indigo-500'}`}
          >
            {String(hour).padStart(2, '0')}
          </button>
          <span className="mx-1 text-slate-300 dark:text-slate-600">:</span>
          <button
            type="button"
            onClick={() => setActiveMode('minute')}
            className={`px-1.5 py-0.5 rounded transition-all ${activeMode === 'minute' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' : 'hover:text-indigo-500'}`}
          >
            {String(minute).padStart(2, '0')}
          </button>
        </div>

        {/* AM / PM Selector */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden text-xs font-black shadow-sm">
          <button
            type="button"
            onClick={() => handlePeriodChange('AM')}
            className={`px-3 py-1.5 transition-all ${period === 'AM' ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('PM')}
            className={`px-3 py-1.5 border-t border-slate-100 dark:border-slate-700/50 transition-all ${period === 'PM' ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            PM
          </button>
        </div>
      </div>

      {/* SVG Analog Clock Face */}
      <div className="relative w-44 h-44 select-none touch-none">
        <svg
          ref={clockRef}
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          className="cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Outer circle */}
          <circle cx="100" cy="100" r="92" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
          
          {/* Subtle outer tick marks (every 5 minutes / 30 degrees) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30 * (Math.PI / 180);
            const x1 = 100 + 86 * Math.cos(angle);
            const y1 = 100 + 86 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
            );
          })}

          {/* Clock Hands */}
          {/* Hour hand (thicker) */}
          <line
            x1="100"
            y1="100"
            x2={hourHandX}
            y2={hourHandY}
            className={`${activeMode === 'hour' ? 'stroke-indigo-600 dark:stroke-indigo-400' : 'stroke-slate-400 dark:stroke-slate-500'} transition-colors`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Minute hand (thinner) */}
          <line
            x1="100"
            y1="100"
            x2={minuteHandX}
            y2={minuteHandY}
            className={`${activeMode === 'minute' ? 'stroke-indigo-600 dark:stroke-indigo-400' : 'stroke-slate-400 dark:stroke-slate-500'} transition-colors`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Center pivot */}
          <circle cx="100" cy="100" r="6" className="fill-indigo-600 dark:fill-indigo-400" />
          <circle cx="100" cy="100" r="2" className="fill-white" />

          {/* Clock Dial Numbers */}
          {activeMode === 'hour'
            ? Array.from({ length: 12 }).map((_, i) => {
                const num = i === 0 ? 12 : i;
                const coords = getCoordinates(i, 12, 70);
                const isSelected = hour === num;
                return (
                  <g key={num}>
                    {isSelected && (
                      <circle cx={coords.x} cy={coords.y} r="12" className="fill-indigo-100 dark:fill-indigo-950/80 stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="1.5" />
                    )}
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-black ${isSelected ? 'fill-indigo-700 dark:fill-indigo-400 font-extrabold' : 'fill-slate-500 dark:fill-slate-400'} pointer-events-none`}
                    >
                      {num}
                    </text>
                  </g>
                );
              })
            : Array.from({ length: 12 }).map((_, i) => {
                const num = i * 5;
                const displayVal = String(num).padStart(2, '0');
                const coords = getCoordinates(i, 12, 70);
                const isSelected = Math.round(minute / 5) * 5 % 60 === num;
                return (
                  <g key={num}>
                    {isSelected && (
                      <circle cx={coords.x} cy={coords.y} r="12" className="fill-indigo-100 dark:fill-indigo-950/80 stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="1.5" />
                    )}
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      className={`text-[9px] font-black ${isSelected ? 'fill-indigo-700 dark:fill-indigo-400 font-extrabold' : 'fill-slate-500 dark:fill-slate-400'} pointer-events-none`}
                    >
                      {displayVal}
                    </text>
                  </g>
                );
              })}
        </svg>
      </div>

      {/* Mode helper buttons */}
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => setActiveMode('hour')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeMode === 'hour' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
        >
          Set Hour
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('minute')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeMode === 'minute' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
        >
          Set Minute
        </button>
      </div>
    </div>
  );
};
