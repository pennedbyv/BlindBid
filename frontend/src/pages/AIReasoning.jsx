import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProgressBar from '../components/common/ProgressBar';
import { MOCK_REASONING_STEPS_13, SIMULATED_THOUGHT_STREAM } from '../data/reasoning';

export default function AIReasoning() {
  const navigate = useNavigate();
  const logContainerRef = useRef(null);
  
  // Animation State
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [tokens, setTokens] = useState(4820);
  const [logs, setLogs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // Time remaining calculated based on steps
  const totalSteps = MOCK_REASONING_STEPS_13.length;
  const timeLeft = Math.max(((totalSteps - activeStep) * 0.8).toFixed(1), 0.0);
  const progressPercent = Math.min(Math.round((activeStep / totalSteps) * 100), 100);

  // Core interval timer simulating the AI thinking
  useEffect(() => {
    if (activeStep > totalSteps) {
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setCompletedSteps(prev => [...prev, activeStep]);
      
      // Accumulate tokens
      setTokens(prev => Math.min(prev + Math.floor(Math.random() * 600) + 400, 12480));

      // Append thought logs
      const logMessage = SIMULATED_THOUGHT_STREAM[activeStep - 1] || "Analyzing parameters...";
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [...prev, `[${timestamp}] ${logMessage}`]);

      // Move to next step
      setActiveStep(prev => prev + 1);
    }, 1000); // 1 step per second

    return () => clearInterval(interval);
  }, [activeStep, totalSteps]);

  // Auto-scroll the thought stream logs inside its container
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Strategy values
  const recommendedStrategy = "Fast Competitive Auction";
  const confidenceValue = "98.4%";

  return (
    <div className="bg-background text-on-surface font-headline min-h-screen select-none relative pb-10">
      {/* Background Neural Overlays */}
      <div className="fixed inset-0 z-0 neural-bg pointer-events-none opacity-20"></div>

      {/* Unified Navbar */}
      <Navbar />

      {/* Main dashboard grid layout */}
      <main className="relative z-10 max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-8 pt-32">
        
        {/* LEFT COLUMN (22% width) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Section 1: AI Mission Status */}
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 neural-bg opacity-5 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-base">radar</span>
              <h3 className="font-mono text-[10px] text-secondary uppercase tracking-widest font-bold">
                Mission Status
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Status</span>
                <span className="flex items-center gap-1.5 font-mono text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex flex-col border-b border-white/5 pb-2 gap-0.5">
                <span className="text-on-surface-variant font-medium">Current Phase</span>
                <span className="text-white font-semibold">Optimizing Auction Strategy</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Progress</span>
                <span className="font-mono text-white font-bold">
                  {Math.min(completedSteps.length, totalSteps)} of 13 completed
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Confidence</span>
                <span className="font-mono text-secondary font-bold">{confidenceValue}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Completion Time</span>
                <span className="font-mono text-white font-bold">
                  {timeLeft}s
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Blockchain</span>
                <span className="text-secondary font-bold text-[11px] font-mono">Monad Testnet</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Groq Engine</span>
                <span className="text-emerald-500 font-mono font-bold">Online</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Neural Processing</span>
                <span className="font-mono text-white font-bold">{tokens} tokens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Reasoning Speed</span>
                <span className="font-mono text-white font-bold">4.8 decisions/s</span>
              </div>
            </div>
          </div>

          {/* Section 2: Market Intelligence */}
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-base">insights</span>
              <h3 className="font-mono text-[10px] text-secondary uppercase tracking-widest font-bold">
                Market Intelligence
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0E0E13] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Demand</span>
                <p className="text-white font-bold font-mono">Moderate</p>
              </div>
              <div className="bg-[#0E0E13] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Competition</span>
                <p className="text-white font-bold font-mono">High</p>
              </div>
              <div className="bg-[#0E0E13] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Liquidity</span>
                <p className="text-white font-bold font-mono">Strong</p>
              </div>
              <div className="bg-[#0E0E13] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Trend</span>
                <p className="text-emerald-500 font-bold font-mono">Bullish</p>
              </div>
              <div className="col-span-2 bg-[#0E0E13] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Estimated Bidders</span>
                <span className="text-secondary font-bold font-mono text-right">18-25</span>
              </div>
              <div className="col-span-2 bg-[#0E0E13] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                <span className="text-on-surface-variant text-[9px] uppercase tracking-widest font-mono">Bundle Score</span>
                <span className="text-secondary font-bold font-mono text-right">92 / 100</span>
              </div>
            </div>
          </div>
        </section>

        {/* CENTER COLUMN (55% width) - Visual Focus */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-8 flex flex-col justify-between">
            <div className="mb-8">
              <h2 className="font-headline text-3xl font-extrabold text-white tracking-tight mb-2">
                AI Auction Strategist
              </h2>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Autonomously analyzing the NFT bundle and generating the optimal auction strategy before broadcasting an on-chain transaction.
              </p>
            </div>

            {/* Vertical timeline of reasoning steps */}
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar space-y-2 pr-2 border-b border-white/5 pb-6 mb-6">
              {MOCK_REASONING_STEPS_13.map((step) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = step.id === activeStep;
                const isFuture = step.id > activeStep;

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? 'border-secondary bg-secondary/5 shadow-gold-glow' 
                        : isCompleted 
                        ? 'border-white/5 bg-[#0E0E13]/40 opacity-90' 
                        : 'border-white/5 bg-transparent opacity-30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-xs ${isActive ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                          {step.number}
                        </span>
                        
                        <span className="material-symbols-outlined text-secondary text-lg">
                          {step.icon}
                        </span>

                        <span className={`font-headline text-sm font-bold ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                          {step.title}
                        </span>
                      </div>

                      {/* Right metadata badge */}
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant/60">
                            <span>{step.duration}</span>
                            <span>({step.confidence})</span>
                            <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                          </div>
                        ) : isActive ? (
                          <div className="w-4.5 h-4.5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant/30 text-sm">radio_button_unchecked</span>
                        )}
                      </div>
                    </div>

                    {/* Explanations shown for completed and active steps */}
                    {(isCompleted || isActive) && (
                      <p className="mt-2 pl-14 text-xs text-on-surface-variant font-body leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Thought Stream Live Terminal */}
            <div className="bg-[#0D0E12] border border-[#2B2A34] rounded-xl p-5 font-mono text-[11px] h-32 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-on-surface-variant/50">
                <span className="material-symbols-outlined text-xs">terminal</span>
                <span>THOUGHT_STREAM_FEED</span>
              </div>

              <div ref={logContainerRef} className="flex-grow overflow-y-auto custom-scrollbar space-y-1 scroll-smooth">
                {logs.map((log, index) => (
                  <div key={index} className="text-secondary opacity-95">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM CENTER: Broadcast Progress Card */}
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block">Wallet</span>
                <span className="text-white text-xs font-bold font-mono">Connected (0xA2...b23C)</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block">Operation</span>
                <span className="text-white text-xs font-bold font-mono">Executing createAuction()</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block">Remaining</span>
                <span className="text-secondary text-xs font-bold font-mono">{timeLeft} seconds</span>
              </div>

              {/* Progress and energy bar */}
              <div className="col-span-1 md:col-span-3 space-y-2 mt-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-on-surface-variant">
                  <span>Monad Broadcast Sequence</span>
                  <span className="text-white">{progressPercent}%</span>
                </div>
                <ProgressBar progress={progressPercent} variant="energy" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (22% width) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Section 1: Strategy Summary */}
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
              <h3 className="font-mono text-[10px] text-secondary uppercase tracking-widest font-bold">
                Strategy Summary
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Recommended Strategy</span>
                <span className="text-white font-bold text-right font-sans">{recommendedStrategy}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Reserve Price</span>
                <span className="font-mono text-secondary font-bold">4.20 MON</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Duration</span>
                <span className="font-mono text-white font-bold">60 Seconds</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Expected Win Bid</span>
                <span className="font-mono text-white font-bold">6.10 MON</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Expected Participation</span>
                <span className="font-mono text-white font-bold">22 bidders</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Seller Objective</span>
                <span className="text-white font-semibold">Sell Quickly</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">Bundle Score</span>
                <span className="font-mono text-white font-bold">92/100</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface-variant font-medium">AI Confidence</span>
                <span className="font-mono text-secondary font-bold">{confidenceValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Market Outlook</span>
                <span className="text-emerald-500 font-bold font-sans">Bullish</span>
              </div>
            </div>
          </div>

          {/* Section 2: Decision Summary Bullet Cards */}
          <div className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-base">checklist</span>
              <h3 className="font-mono text-[10px] text-secondary uppercase tracking-widest font-bold">
                Decision Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0E0E13] p-3.5 rounded-xl border border-white/5 text-xs text-on-surface-variant font-body leading-relaxed flex gap-2">
                <span className="text-secondary font-bold font-sans text-sm leading-none">•</span>
                <span>Seller values speed over maximum profit.</span>
              </div>
              <div className="bg-[#0E0E13] p-3.5 rounded-xl border border-white/5 text-xs text-on-surface-variant font-body leading-relaxed flex gap-2">
                <span className="text-secondary font-bold font-sans text-sm leading-none">•</span>
                <span>Bundle quality exceeds average.</span>
              </div>
              <div className="bg-[#0E0E13] p-3.5 rounded-xl border border-white/5 text-xs text-on-surface-variant font-body leading-relaxed flex gap-2">
                <span className="text-secondary font-bold font-sans text-sm leading-none">•</span>
                <span>Market demand supports competitive bidding.</span>
              </div>
              <div className="bg-[#0E0E13] p-3.5 rounded-xl border border-white/5 text-xs text-on-surface-variant font-body leading-relaxed flex gap-2">
                <span className="text-secondary font-bold font-sans text-sm leading-none">•</span>
                <span>Lower reserve increases participation.</span>
              </div>
              <div className="bg-[#0E0E13] p-3.5 rounded-xl border border-white/5 text-xs text-on-surface-variant font-body leading-relaxed flex gap-2">
                <span className="text-secondary font-bold font-sans text-sm leading-none">•</span>
                <span>Blitz mode maximizes urgency.</span>
              </div>
            </div>
          </div>

          {/* Bottom Primary Button */}
          <div className="mt-auto">
            {isComplete ? (
              <button
                onClick={() => navigate('/winner')}
                className="w-full py-5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-label text-xs uppercase font-extrabold tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-sm font-extrabold">check_circle</span>
                Auction Successfully Created
              </button>
            ) : (
              <button
                disabled
                className="w-full py-5 bg-[#2B2A34] text-on-surface-variant/40 font-label text-xs uppercase font-extrabold tracking-widest rounded-xl transition-all cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm animate-pulse">lock</span>
                Deploy Auction
              </button>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
