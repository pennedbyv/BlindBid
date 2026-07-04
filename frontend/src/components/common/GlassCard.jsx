import React from 'react';

export default function GlassCard({ children, className = '', hoverLift = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card rounded-2xl ${hoverLift ? 'hover-lift cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
