import React from 'react';
import GlassCard from '../common/GlassCard';

export default function FeatureCard({ feature }) {
  const { title, description, icon } = feature;

  return (
    <GlassCard 
      hoverLift
      className="p-10 flex flex-col gap-6"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary text-2xl">
          {icon}
        </span>
      </div>
      <h3 className="font-headline text-headline-md text-on-surface">{title}</h3>
      <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}
