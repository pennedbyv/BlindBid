import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ReasoningTimeline({ steps: initialSteps }) {
  const [activeStep, setActiveStep] = useState(7); // starts with step 7 as active (as in mockup)
  const [steps, setSteps] = useState(initialSteps);

  // Stagger step statuses over time for interactive realism
  useEffect(() => {
    const timer = setTimeout(() => {
      // Transition step 7 to completed and step 8 to active/success
      setSteps(prev => 
        prev.map(step => {
          if (step.id === 7) return { ...step, status: 'completed' };
          if (step.id === 8) return { ...step, status: 'completed' }; // Success!
          return step;
        })
      );
      setActiveStep(8);
    }, 6000); // after 6s transaction completes

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex-grow flex flex-col items-center justify-center relative px-4 lg:px-12 overflow-hidden h-full">
      {/* Scanline grid overlay */}
      <div className="scanline-vertical"></div>

      <div className="w-full max-w-xl space-y-1 relative z-10">
        {steps.map((step) => {
          const isCompleted = step.status === 'completed' || (step.id < activeStep);
          const isActive = step.id === activeStep && step.status !== 'completed';

          return (
            <div
              key={step.id}
              className={`px-8 py-4 flex items-center justify-between rounded-xl transition-all duration-500 ${
                isActive 
                  ? 'bg-secondary/5 border border-secondary/25 py-6 relative' 
                  : isCompleted 
                  ? 'opacity-80' 
                  : 'opacity-30'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 animate-pulse bg-secondary/5 rounded-xl -z-10"></div>
              )}

              <div className="flex items-center gap-6">
                <span className={`font-mono text-mono-sm ${isActive ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                  {step.number}
                </span>
                <span className={`font-headline text-headline-md font-medium ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>

              {/* Status Indicator */}
              {isCompleted ? (
                <span className="material-symbols-outlined text-emerald-500 animate-glimmer">
                  check_circle
                </span>
              ) : isActive ? (
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant/30">
                  radio_button_unchecked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
