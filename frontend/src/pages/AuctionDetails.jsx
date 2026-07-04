import React from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { MOCK_AUCTIONS } from '../data/auctions';

export default function AuctionDetails() {
  const { id } = useParams();
  const location = useLocation();
  const auction = MOCK_AUCTIONS.find((entry) => entry.id === id);

  if (!auction) {
    return <Navigate to="/marketplace" replace />;
  }
  
  const details = buildAuctionDetails(auction, location.state);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <PageContainer className="max-w-[1180px] pt-8">
        <div className="rounded-[28px] border border-secondary/20 bg-[#0b0b11] shadow-[0_30px_80px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="border-b border-secondary/10 px-6 py-6 sm:px-10">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-secondary"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Auctions
            </Link>
          </div>

          <section className="px-6 pb-8 pt-10 sm:px-10 sm:pt-14">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#242531] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="absolute inset-0 rounded-full border border-white/5"></div>
                <span className="material-symbols-outlined text-[42px] text-white/70">
                  schedule
                </span>
              </div>

              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {details.name}
              </h1>
              <p className="mt-2 text-base text-on-surface-variant sm:text-lg">
                {details.description}
              </p>

              {details.isCompleted ? (
                <div className="mt-8 inline-flex min-h-[72px] items-center justify-center gap-4 rounded-full bg-[#f7bf3d] px-8 py-5 text-center text-sm font-black uppercase tracking-[0.16em] text-[#111018] shadow-[0_18px_40px_rgba(247,191,61,0.28)] sm:min-w-[420px] sm:px-12">
                  <span className="material-symbols-outlined text-[24px] text-[#111018]">
                    auto_awesome
                  </span>
                  <span>Auction Successfully Completed</span>
                </div>
              ) : (
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-secondary/25 bg-[#15141c] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(245,190,62,0.02)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(245,190,62,0.8)]"></span>
                  {details.statusText}
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-secondary/15 px-6 py-5 sm:px-10">
            <div className="flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
              <span>Seller</span>
              <div className="flex items-center gap-3 text-right">
                <span className="font-medium text-white/80">{details.seller}</span>
                <span className="text-white/45">{details.bidStatus}</span>
              </div>
            </div>
          </section>

          <section className="space-y-5 px-6 pb-12 sm:px-10">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard
                icon="sell"
                label="Starting Price"
                value={details.startingPrice}
                accent
              />
              <InfoCard
                label="NFTs in Vault"
                value={String(details.nftsInVault)}
              />
            </div>

            <section className="rounded-2xl border border-secondary/40 bg-[#2a1f0f] px-4 py-4 text-secondary sm:px-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    Estimated Value
                  </div>
                  <div className="mt-3 text-[2rem] font-extrabold tracking-tight text-[#ffcb57] sm:text-[2.2rem]">
                    {details.estimatedRange}
                  </div>
                  <div className="mt-1 text-sm text-[#f0bf62]">
                    Confidence: {details.confidence}
                  </div>
                </div>

                <span className="inline-flex h-fit items-center rounded-full border border-secondary/35 bg-[#4d3907] px-3 py-1 text-xs font-semibold text-[#ffcb57]">
                  {details.confidence}
                </span>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-white/90">
                Rarity Breakdown
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {details.rarities.map((rarity) => (
                  <div
                    key={rarity.label}
                    className="relative overflow-hidden rounded-2xl border border-[#415170] bg-[radial-gradient(circle_at_top_right,_rgba(176,194,230,0.18),_transparent_22%),linear-gradient(160deg,_#233046_0%,_#172135_70%,_#131824_100%)] p-5 shadow-[0_0_30px_rgba(101,129,183,0.16)]"
                  >
                    <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,_#dce7f8_0%,_#93a2bc_100%)] text-[#f9fbff] shadow-[0_8px_30px_rgba(177,194,226,0.35)]">
                      <span className="material-symbols-outlined text-[22px]">grade</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{rarity.count}</div>
                    <div className="mt-2 text-3xl font-bold tracking-tight text-white">
                      {rarity.label}
                    </div>
                    <div className="mt-1 text-sm text-white/60">NFTs</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-dashed border-secondary/15 bg-[#111119] px-6 py-10 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#251b08] text-secondary shadow-[0_0_20px_rgba(245,190,62,0.12)]">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Vault contents are hidden until auction ends
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                {details.nftsInVault} NFT bundle is sealed in this vault. Bidders only see summary signals, rarity distribution,
                and AI value estimates until the reveal.
              </p>
            </section>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}

function InfoCard({ icon, label, value, accent = false }) {
  return (
    <div className="rounded-2xl border border-secondary/15 bg-[#12131a] px-4 py-4 sm:px-5">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
        {icon ? (
          <span className="material-symbols-outlined text-base text-white/45">
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </div>
      <div className={`mt-3 text-4xl font-extrabold tracking-tight ${accent ? 'text-secondary' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function buildAuctionDetails(auction, navigationState = null) {
  const base = {
    seller: 'Verified Seller',
    bidStatus: auction.type === 'pending' ? 'No bids yet' : '3 bids placed',
    startingPrice: auction.minPrice,
    nftsInVault: 1,
    estimatedRange: '0.45 - 1.20 MON',
    confidence: 'Medium',
    statusText: auction.type === 'pending' ? 'Waiting for seller to start auction' : 'Auction completed',
    isCompleted: auction.type !== 'pending',
    rarities: [
      {
        label: 'Common',
        count: 1
      }
    ]
  };

  const overrides = {
    'pending-2': {
      nftsInVault: 3,
      estimatedRange: '0.80 - 2.40 MON',
      rarities: [
        { label: 'Common', count: 2 },
        { label: 'Rare', count: 1 }
      ]
    },
    'ended-1': {
      bidStatus: '12 bids placed',
      startingPrice: '1.5 MON',
      estimatedRange: '1.50 - 3.90 MON',
      confidence: 'High',
      statusText: 'Auction ended. Reveal complete',
      nftsInVault: 4,
      rarities: [
        { label: 'Rare', count: 2 },
        { label: 'Epic', count: 2 }
      ]
    },
    'ended-2': {
      bidStatus: '7 bids placed',
      estimatedRange: '0.40 - 1.60 MON',
      confidence: 'Low',
      statusText: 'Auction ended. Reveal complete',
      nftsInVault: 2,
      rarities: [
        { label: 'Common', count: 1 },
        { label: 'Rare', count: 1 }
      ]
    },
    'ended-3': {
      bidStatus: '9 bids placed',
      estimatedRange: '0.35 - 1.10 MON',
      confidence: 'Medium',
      statusText: 'Auction ended. Reveal complete',
      nftsInVault: 3,
      rarities: [
        { label: 'Common', count: 1 },
        { label: 'Rare', count: 1 },
        { label: 'Epic', count: 1 }
      ]
    }
  };

  return {
    ...auction,
    ...base,
    ...(overrides[auction.id] || {}),
    ...(navigationState?.statusOverride
      ? { statusText: navigationState.statusOverride }
      : {})
  };
}
