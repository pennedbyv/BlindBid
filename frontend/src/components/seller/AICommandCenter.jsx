import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AICommandCenter() {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState(
    "Initialize auction sequence for current bundle. Focus on high-intent collectors in the Monad ecosystem. Implement a descending price floor strategy with a 24-hour buffer for maximum exposure. Optimize for liquidity over absolute floor price..."
  );

  const chips = [
    { label: "Optimize for Liquidity", value: " Optimize for liquidity over absolute floor price..." },
    { label: "Maximize Value", value: " Maximize total yield value with dynamic high-start premium ceilings..." },
    { label: "Rapid 60s Blitz", value: " Run a rapid 60-second blitz auction to trigger FOMO buyouts..." },
    { label: "Whale Targetting", value: " Configure whale reserve floors and target large liquidity clusters..." }
  ];

  const handleChipClick = (value) => {
    // Append or replace content for simulated interactive prompt editing
    setPromptText(prev => prev + value);
  };

  const handleGenerate = () => {
    navigate('/reasoning');
  };

  return (
    <section className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full">
      <div className="flex flex-col h-full">
        {/* Terminal Header */}
        <div className="bg-[#17171F] rounded-t-2xl border-x border-t border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-xl">
                smart_toy
              </span>
            </div>
            <div>
              <h2 className="font-headline text-headline-md text-white text-lg font-bold leading-tight">
                AI Command Center
              </h2>
              <p className="font-mono text-[10px] text-emerald-500/80 uppercase">
                Strategist Engine Active
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
          </div>
        </div>

        {/* Prompt Editor Terminal Area */}
        <div className="bg-black/40 border-x border-b border-white/10 flex-grow p-8 font-mono text-mono-sm relative group overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 flex-grow flex flex-col">
            <div className="text-on-surface-variant/60 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">terminal</span>
              <span>PROMPT_EDITOR_V2.0.4</span>
            </div>
            
            {/* Typing text area */}
            <div className="text-lg text-white leading-relaxed font-light overflow-y-auto flex-grow custom-scrollbar">
              <span className="text-secondary opacity-50 select-none mr-2">&gt;</span>
              <span className="blinking-cursor select-text">
                {promptText}
              </span>
            </div>
          </div>

          {/* Parameters Chips */}
          <div className="mt-8 relative z-10">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-mono">
              Suggested Parameters
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip.value)}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-secondary hover:text-secondary transition-all text-[11px] font-label font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-8">
          <button 
            onClick={handleGenerate}
            className="w-full h-16 bg-secondary rounded-2xl flex items-center justify-center gap-4 group hover:bg-[#EBC04D] transition-all gold-glow active:scale-[0.98] transition-transform"
          >
            <span className="font-headline text-headline-md text-black font-bold uppercase tracking-wider">
              Generate AI Strategy
            </span>
            <span className="material-symbols-outlined text-black group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <p className="text-center mt-4 font-mono text-[10px] text-on-surface-variant/40">
            ESTIMATED COMPUTE TIME: 1.4s • POWERED BY BLINDBID LLM-X
          </p>
        </div>
      </div>
    </section>
  );
}
