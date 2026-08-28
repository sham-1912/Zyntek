import React, { useState, useEffect } from 'react';
import { web3Provider, GANACHE_CHAIN_ID, GANACHE_CHAIN_ID_ALT } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import { Settings, Bell, AlertTriangle, Hexagon, UserCheck, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: 'swap' | 'dashboard' | 'intents' | 'solvers' | 'result';
  onSelectTab: (tab: 'swap' | 'dashboard' | 'intents' | 'solvers' | 'result') => void;
  viewMode: 'user' | 'solver';
  onToggleViewMode: (mode: 'user' | 'solver') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  viewMode,
  onToggleViewMode,
}) => {
  const [wallet, setWallet] = useState<WalletState>(web3Provider.getWalletState());
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = web3Provider.subscribe((updatedState) => {
      setWallet(updatedState);
    });
    return unsubscribe;
  }, []);

  const handleToggleWallet = async () => {
    const updated = await web3Provider.connectWallet();
    setWallet(updated);
    setShowWalletMenu(false);
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    await web3Provider.switchToGanacheNetwork();
    setIsSwitching(false);
  };

  const isGanache = wallet.chainId === GANACHE_CHAIN_ID || wallet.chainId === GANACHE_CHAIN_ID_ALT;
  const isWrongNetwork = wallet.isConnected && !isGanache && wallet.chainId !== 11155111;

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return '0x71...A92F';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E4DA]">
      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="bg-[#FAF0D9] border-b border-[#E5C984] px-6 py-2 text-xs font-mono flex items-center justify-between text-[#8C6407]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C69214] shrink-0" />
            <span>Wrong Network Detected (Chain ID #{wallet.chainId}). Please switch to Ganache Localnet (1337).</span>
          </div>

          <button
            type="button"
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="px-3 py-1 rounded bg-[#C69214] hover:bg-[#B0810F] text-white font-semibold text-[11px] transition-all shrink-0"
          >
            {isSwitching ? 'Switching...' : 'Switch to Ganache (1337)'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-8">
          <button 
            type="button" 
            onClick={() => onSelectTab('swap')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#1A1915]">
              <Hexagon className="w-6 h-6 stroke-[2.2] text-[#C69214] group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1915] font-sans">IntentX</span>
          </button>

          {/* Navigation Links (Matching Reference UI: Swap, Lend, Governance) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => onSelectTab('swap')}
              className={`pb-0.5 transition-colors ${
                activeTab === 'swap'
                  ? 'text-[#1A1915] font-semibold border-b-2 border-[#1A1915]'
                  : 'text-[#7A7568] hover:text-[#1A1915]'
              }`}
            >
              Swap
            </button>
            <span className="text-[#B5AD9C] cursor-not-allowed hover:text-[#B5AD9C]">Lend</span>
            <span className="text-[#B5AD9C] cursor-not-allowed hover:text-[#B5AD9C]">Governance</span>
          </nav>
        </div>

        {/* Right Actions: Solver View Mode, Settings, Notifications, Wallet Address Chip */}
        <div className="flex items-center gap-3">
          
          {/* User vs Solver View Toggle */}
          <button
            type="button"
            onClick={() => onToggleViewMode(viewMode === 'user' ? 'solver' : 'user')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
              viewMode === 'solver'
                ? 'bg-[#FAF5E8] border-[#C69214] text-[#8C6407] font-semibold'
                : 'bg-white border-[#E8E4DA] text-[#6B6659] hover:border-[#D8D2C4]'
            }`}
            title="Toggle between User Intent Trader and Protocol Solver Operator view"
          >
            {viewMode === 'solver' ? (
              <>
                <Bot className="w-3.5 h-3.5 text-[#C69214]" />
                <span>Solver View</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-[#7A7568]" />
                <span>User View</span>
              </>
            )}
          </button>

          {/* Settings Icon Button */}
          <button 
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6659] hover:text-[#1A1915] hover:bg-[#F5F2EA] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications Icon Button */}
          <button 
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6659] hover:text-[#1A1915] hover:bg-[#F5F2EA] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C69214]" />
          </button>

          {/* Wallet Address Chip (Matching Reference Monospace Pill `• 0x71...A92F`) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className="px-3 py-1.5 rounded-lg bg-[#EFECE6] hover:bg-[#E8E4DA] border border-[#DFD9CD] text-xs font-mono text-[#38352F] flex items-center gap-2 transition-all"
            >
              <span className={`w-2 h-2 rounded-full ${
                wallet.isConnected 
                  ? (isGanache ? 'bg-[#C69214]' : 'bg-emerald-500') 
                  : 'bg-amber-500 animate-pulse'
              }`} />
              <span>{truncateAddress(wallet.address)}</span>
            </button>

            {/* Wallet Quick Menu */}
            {showWalletMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E8E4DA] rounded-xl shadow-lg p-3 z-50 animate-in fade-in zoom-in duration-150">
                <div className="text-[11px] font-mono text-[#7A7568] uppercase mb-1">Connected Network</div>
                <div className="text-xs font-mono font-semibold text-[#1A1915] mb-2">{wallet.networkName}</div>

                <div className="text-[11px] font-mono text-[#7A7568] uppercase mb-1">Balance</div>
                <div className="text-xs font-mono font-bold text-[#C69214] mb-3">{wallet.balanceEth} ETH</div>

                <div className="pt-2 border-t border-[#E8E4DA] flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleToggleWallet}
                    className="w-full px-3 py-1.5 rounded bg-[#F5F2EA] hover:bg-[#E8E4DA] text-xs font-mono text-[#1A1915] text-left transition-colors"
                  >
                    {wallet.isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
                  </button>

                  {!isGanache && (
                    <button
                      type="button"
                      onClick={handleSwitchNetwork}
                      className="w-full px-3 py-1.5 rounded bg-[#FAF5E8] hover:bg-[#F3E7C4] text-xs font-mono text-[#8C6407] text-left transition-colors"
                    >
                      Switch to Ganache (1337)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
