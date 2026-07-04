import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import VaultValuation from '../components/auction/VaultValuation';
import AuctionHero from '../components/auction/AuctionHero';
import BidPanel from '../components/auction/BidPanel';
import { MOCK_VAULTS } from '../data/vaults';

export default function AuctionDetails() {
  const { id } = useParams();

  // Find vault metadata or fallback to default Alpha vault
  const vault = MOCK_VAULTS.find(v => v.id === id) || MOCK_VAULTS[0];

  if (!vault) {
    return <Navigate to="/marketplace" replace />;
  }

  // Parse valuation range min/max
  const rawEstVal = vault.estimatedValue.split(' ')[0]; // "2.45"
  const valNum = parseFloat(rawEstVal) || 2.45;
  const minVal = (valNum * 0.2).toFixed(2);
  const maxVal = (valNum * 0.5).toFixed(2);

  return (
    <div className="min-h-screen bg-background pt-24 pb-section-gap flex flex-col justify-center">
      <PageContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">
        {/* LEFT COLUMN: Vault Valuation Sidebar */}
        <aside className="lg:col-span-5 flex flex-col">
          <VaultValuation 
            minVal={minVal} 
            maxVal={maxVal} 
            currency="QIE" 
          />
        </aside>

        {/* RIGHT COLUMN: Auction Center */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Countdown & Hero identity */}
          <AuctionHero 
            bundleId={vault.id.split('-')[0]} 
            title={vault.name.replace('Vault ', '')} 
            timerSeconds={vault.timeRemainingSeconds} 
          />

          {/* Bid details and action interface */}
          <BidPanel 
            initialHighestBid={0} 
            currency="QIE" 
          />
        </section>
      </PageContainer>
    </div>
  );
}
