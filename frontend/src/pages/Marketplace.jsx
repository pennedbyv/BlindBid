import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import AuctionCard from '../components/cards/AuctionCard';
import { MOCK_AUCTIONS } from '../data/auctions';

export default function Marketplace() {
  const [auctions, setAuctions] = useState(MOCK_AUCTIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulating active telemetry check/reload
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const pendingAuctions = auctions.filter(a => a.type === 'pending');
  const liveAuctions = auctions.filter(a => a.type === 'live');
  const endedAuctions = auctions.filter(a => a.type === 'ended');

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 flex flex-col">
      <PageContainer className="pt-16 max-w-6xl">
        {/* Header Controls Block */}
        <header className="flex justify-between items-start gap-8 flex-wrap mb-10">
          <div className="space-y-3">
            <h1 className="font-headline text-5xl font-extrabold text-white tracking-tight leading-none">
              All Auctions
            </h1>
            <p className="font-body text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Discover blind vault auctions. Bid on sealed NFT collections without seeing the assets inside.
            </p>
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 border border-secondary/40 text-secondary px-5 py-2.5 rounded-lg text-xs font-mono font-bold hover:bg-secondary/5 transition-all cursor-pointer active:scale-95"
          >
            <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            Refresh
          </button>
        </header>

        {/* Counter Telemetry Stats Row */}
        <section className="flex items-center gap-6 text-xs font-mono font-bold text-on-surface-variant/70 mb-12 border-b border-[#2B2A34] pb-6">
          <div className="flex items-center gap-1.5">
            <span className="text-secondary text-lg leading-none">•</span>
            <span>{pendingAuctions.length} Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 text-lg leading-none">•</span>
            <span>{liveAuctions.length} Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-outline text-lg leading-none">•</span>
            <span>{endedAuctions.length} Ended</span>
          </div>
          <div className="text-white ml-auto font-sans text-xs opacity-90">
            {auctions.length} Total
          </div>
        </section>

        {/* Pending Auctions Section */}
        <section className="mb-14">
          <h2 className="font-headline text-lg font-bold text-white tracking-tight mb-8 flex items-center">
            <span className="text-secondary mr-2 text-xl">•</span>
            Pending Auctions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>

        {/* Ended Auctions Section */}
        <section>
          <h2 className="font-headline text-lg font-bold text-white tracking-tight mb-8 flex items-center">
            <span className="text-secondary mr-2 text-xl">•</span>
            Ended Auctions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {endedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
