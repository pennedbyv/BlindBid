import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';

export default function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch Monad balance
  const { data: balanceData } = useBalance({
    address,
    chainId: 10143,
    query: {
      enabled: Boolean(address) && chainId === 10143,
    },
  });

  const isMonadTestnet = chainId === 10143;

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const balanceString = !isConnected
    ? '-- MON'
    : !isMonadTestnet
    ? 'Switch to Monad'
    : balanceData && !isNaN(parseFloat(balanceData.formatted))
    ? `${parseFloat(balanceData.formatted).toFixed(2)} ${balanceData.symbol}`
    : '0.00 MON';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnectWallet = (connector) => {
    try {
      connect({ connector });
      setShowDropdown(false);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: 10143 });
    }
  };

  // If not connected
  if (!isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          onClick={() => setShowDropdown(prev => !prev)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-secondary text-on-secondary font-label text-xs uppercase font-bold rounded-lg tracking-wider hover:brightness-110 transition-all cursor-pointer"
        >
          Connect Wallet
        </motion.button>

        {/* Custom Wallet Selector Dropdown (Floating aligned to the right) */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-3 w-80 bg-[#1F1E26] border border-[#2B2A34] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 z-50"
            >
              {/* Wallet Options */}
              <div className="flex flex-col gap-2.5">
                {/* 1. Injected Connector Option */}
                <button
                  onClick={() => {
                    const injected = connectors.find(c => c.id === 'injected');
                    if (injected) handleConnectWallet(injected);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#0D0E12]/80 border border-[#2B2A34] rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-base">account_balance</span>
                    <span className="font-label text-sm text-white group-hover:text-secondary transition-colors font-semibold">
                      Injected
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-sm">
                    arrow_right_alt
                  </span>
                </button>

                {/* 2. Coinbase Wallet Option */}
                <button
                  onClick={() => {
                    const coinbase = connectors.find(c => c.id === 'coinbaseWalletSDK');
                    if (coinbase) handleConnectWallet(coinbase);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#0D0E12]/80 border border-[#2B2A34] rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-base">wallet</span>
                    <span className="font-label text-sm text-white group-hover:text-secondary transition-colors font-semibold">
                      Coinbase Wallet
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-sm">
                    arrow_right_alt
                  </span>
                </button>

                {/* 3. MetaMask Option */}
                <button
                  onClick={() => {
                    const metaMask = connectors.find(c => c.name.toLowerCase().includes('metamask') || c.id === 'injected');
                    if (metaMask) handleConnectWallet(metaMask);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#0D0E12]/80 border border-[#2B2A34] rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-base">token</span>
                    <span className="font-label text-sm text-white group-hover:text-secondary transition-colors font-semibold">
                      MetaMask
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-sm">
                    arrow_right_alt
                  </span>
                </button>

                {/* 4. Brave Wallet Option */}
                <button
                  onClick={() => {
                    const brave = connectors.find(c => c.name.toLowerCase().includes('brave') || c.id === 'injected');
                    if (brave) handleConnectWallet(brave);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#0D0E12]/80 border border-[#2B2A34] rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-base">account_balance</span>
                    <span className="font-label text-sm text-white group-hover:text-secondary transition-colors font-semibold">
                      Brave Wallet
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-sm">
                    arrow_right_alt
                  </span>
                </button>
              </div>

              {/* Centered Footer */}
              <div className="text-center font-mono text-[8px] text-on-surface-variant/40 pt-2 tracking-wider">
                SECURE WEB3 CONNECT - MONAD NETWORK
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Wrong Network switch chip */}
      {!isMonadTestnet ? (
        <button
          onClick={handleSwitchNetwork}
          className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-[10px] font-mono uppercase tracking-wider font-bold rounded cursor-pointer flex items-center gap-1"
          title="Wrong Network! Click to Switch to Monad Testnet"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Wrong Net
        </button>
      ) : (
        <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono uppercase tracking-wider font-bold rounded flex items-center gap-1 hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Monad
        </div>
      )}

      {/* Balance display */}
      <span className="font-mono text-xs text-secondary font-bold hidden sm:inline-block">
        {balanceString}
      </span>
      
      {/* Wallet address and disconnect trigger */}
      <motion.button
        onClick={() => disconnect()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-surface-bright/20 border border-outline-variant/30 px-4 py-2 rounded-lg text-sm font-mono hover:bg-surface-bright/40 transition-all text-on-surface cursor-pointer"
        title="Click to Disconnect"
      >
        <span>{truncateAddress(address)}</span>
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">logout</span>
      </motion.button>
    </div>
  );
}
