import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ initialSeconds = 3600, variant = 'card', className = '' }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (variant === 'large') {
      const pad = (num) => String(num).padStart(2, '0');
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    // Default card format: e.g. "58m 12s" or "02h 45m"
    if (hrs > 0) {
      const pad = (num) => String(num).padStart(2, '0');
      return `${pad(hrs)}h ${pad(mins)}m`;
    }
    return `${mins}m ${secs}s`;
  };

  if (variant === 'large') {
    return (
      <div className={`text-6xl md:text-8xl font-black text-secondary tracking-tighter glow-gold font-mono ${className}`}>
        {formatTime()}
      </div>
    );
  }

  return (
    <span className={`font-mono text-headline-md text-on-surface tracking-widest ${className}`}>
      {formatTime()}
    </span>
  );
}
