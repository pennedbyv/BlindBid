import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance } from 'wagmi';
import PageContainer from '../components/layout/PageContainer';
import { MOCK_STRATEGIST_INVENTORY } from '../data/strategist';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  
  // Retrieve Monad Testnet Balance
  const { data: balanceData } = useBalance({
    address,
    chainId: 10143
  });

  const [selectedIds, setSelectedIds] = useState(['cyberpunk-442', 'shard-genesis']); // Card 1 and 2 selected by default
  const [activeTab, setActiveTab] = useState('All');
  const [objectives, setObjectives] = useState('');

  // Handle card selection toggling
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Filter inventory based on active tab
  const filteredInventory = MOCK_STRATEGIST_INVENTORY.filter(item => {
    if (activeTab === 'All') return true;
    return item.rarity.toUpperCase() === activeTab.toUpperCase();
  });

  // Calculate dynamics based on selected IDs
  const selectedCount = selectedIds.length;
  const totalValue = MOCK_STRATEGIST_INVENTORY
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.estimatedValue, 0)
    .toFixed(1);

  const chips = [
    "Sell quickly",
    "Maximize profit",
    "Premium pricing"
  ];

  const handleChipClick = (label) => {
    setObjectives(prev => {
      const spacing = prev ? ' ' : '';
      return `${prev}${spacing}I need to ${label.toLowerCase()} for the current assets.`;
    });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
      <PageContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        
        {/* LEFT COLUMN: Your Inventory */}
        <section className="lg:col-span-7 bg-[#17171F] border border-[#2B2A34] rounded-3xl p-8 flex flex-col justify-between">
          <div>
            {/* Header Title Row */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-3xl font-bold text-white tracking-tight">
                Your Inventory
              </h2>
              
              {/* Monad Testnet status badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-secondary/40 text-secondary bg-secondary/5 text-[10px] font-mono tracking-widest uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Monad Testnet
              </div>
            </div>

            {/* Wallet Address Status bar */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-[#0D0E12] border border-[#2B2A34] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                <span>{isConnected ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '0x7F...A2B4'}</span>
              </div>
              <span className="font-mono text-sm text-secondary font-bold">
                {balanceData && !isNaN(parseFloat(balanceData.formatted)) ? `${parseFloat(balanceData.formatted).toFixed(2)} MON` : '8.25 MON'}
              </span>
            </div>

            {/* Tab Filters */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab('All')}
                className={`px-4 py-2 rounded-full text-xs font-label uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'All' 
                    ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/15' 
                    : 'bg-[#0D0E12] border border-[#2B2A34] text-secondary hover:bg-secondary/5'
                }`}
              >
                All Items (12)
              </button>
              <button
                onClick={() => setActiveTab('Rare')}
                className={`px-4 py-2 rounded-full text-xs font-label uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'Rare' 
                    ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/15' 
                    : 'bg-[#0D0E12] border border-[#2B2A34] text-secondary hover:bg-secondary/5'
                }`}
              >
                Rare
              </button>
              <button
                onClick={() => setActiveTab('Legendary')}
                className={`px-4 py-2 rounded-full text-xs font-label uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'Legendary' 
                    ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/15' 
                    : 'bg-[#0D0E12] border border-[#2B2A34] text-secondary hover:bg-secondary/5'
                }`}
              >
                Legendary
              </button>
            </div>

            {/* Inventory Items grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredInventory.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSelect(item.id)}
                    className={`bg-[#0D0E12] rounded-2xl p-3 border transition-all duration-300 cursor-pointer ${
                      isSelected ? 'border-secondary' : 'border-[#2B2A34] opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Image card block */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                      <img 
                        className="w-full h-full object-cover" 
                        alt={item.name} 
                        src={item.image}
                      />
                      
                      {/* Top badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-mono text-secondary uppercase font-semibold">
                        {item.rarity}
                      </div>

                      {/* Selected checkmark indicator */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 bg-secondary rounded-md flex items-center justify-center">
                          <span className="material-symbols-outlined text-black text-sm font-extrabold">
                            check
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Row */}
                    <div className="px-1.5 pb-2 space-y-1">
                      <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-tighter">
                        {item.collection}
                      </p>
                      <h4 className="font-headline text-sm font-bold text-white leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-[#2B2A34]">
                        <span className="text-on-surface-variant font-medium text-[10px]">Estimated</span>
                        <span className={`font-mono font-bold ${isSelected ? 'text-secondary' : 'text-on-surface-variant/80'}`}>
                          {item.estimatedValue.toFixed(1)} MON
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: AI Command Workspace */}
        <section className="lg:col-span-5 bg-[#17171F] border border-[#2B2A34] rounded-3xl p-8 flex flex-col justify-between h-full">
          <div>
            {/* Header Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <h2 className="font-headline text-xl font-bold text-white tracking-tight">
                AI Strategist
              </h2>
            </div>

            {/* Objectives Area */}
            <div className="space-y-3 mb-6">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block">
                Objectives
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="w-full bg-[#0D0E12] border border-[#2B2A34] rounded-2xl p-4 text-xs font-body placeholder:text-on-surface-variant/40 text-white focus:ring-secondary focus:border-secondary h-28 resize-none"
                placeholder="e.g., I need liquidity fast but want to maximize value on the Legendaries..."
              />
            </div>

            {/* Strategy Chips */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="px-3.5 py-1.5 rounded-full bg-[#0D0E12] hover:bg-[#2A2A32] text-xs font-label font-medium text-white transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Bundle Intelligence info */}
            <div className="border-t border-[#2B2A34] pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-base">monitoring</span>
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest font-bold">
                  Bundle Intelligence
                </span>
              </div>

              {/* Selected Assets count */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-body text-on-surface-variant font-medium">Selected Assets</span>
                <span className="font-mono font-bold text-white">
                  {selectedCount} NFTs
                </span>
              </div>

              {/* Total Market Value sum */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-body text-on-surface-variant font-medium">Total Market Value</span>
                <span className="font-mono font-bold text-secondary text-sm">
                  {totalValue} MON
                </span>
              </div>

              {/* Current Demand label */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-body text-on-surface-variant font-medium">Current Demand</span>
                <span className="font-mono font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">mode_fan</span>
                  High
                </span>
              </div>
            </div>
          </div>

          {/* Action Execution Button */}
          <div className="mt-10">
            <button
              onClick={() => navigate('/reasoning')}
              className="w-full h-16 bg-secondary rounded-2xl flex items-center justify-center gap-3 group hover:bg-[#EBC04D] transition-all gold-glow active:scale-[0.98] transition-transform text-black cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-xl">temp_preferences_custom</span>
              <span className="font-headline text-headline-md uppercase tracking-wider font-extrabold text-sm">
                Generate AI Strategy
              </span>
            </button>
          </div>
        </section>

      </PageContainer>
    </div>
  );
}
