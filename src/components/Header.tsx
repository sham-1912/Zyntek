import React, { useState, useEffect } from 'react';
import { Layers, Wallet, Plug, History, AlertTriangle, UserCheck } from 'lucide-react';
import { web3Provider } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import type { ContractSimulationState } from '../services/types';
import { GanacheChainWidget } from './GanacheChainWidget';

interface HeaderProps {
  contractState: ContractSimulationState;
  onOpenHistory: () => void;
  onOpenLedger: () => void;
  historyCount: number;
  viewMode: 'user' | 'solver';
  onToggleViewMode: (mode: 'user' | 'solver') => void;
}

export const Header: React.FC<HeaderProps> = ({
  contractState,
  onOpenHistory,
  onOpenLedger,
  historyCount,
  viewMode,
  onToggleViewMode,
}) => {
  const [wallet, setWallet] = useState<WalletState>(web3Provider.getWalletState());
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const unsubscribe = web3Provider.subscribe((updated) => {
      setWallet(updated);
    });
    return unsubscribe;
  }, []);

  const handleToggleWallet = async () => {
    if (wallet.isConnected) {
      setWallet((prev) => ({ ...prev, isConnected: false }));
    } else {
      await web3Provider.connectWallet();
    }
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    await web3Provider.switchToGanacheNetwork();
    setIsSwitching(false);
  };

  const isWrongNetwork = wallet.isConnected && !wallet.isGanache;

  return (
    <div className="sticky top-0 z-50 shadow-md">
      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="bg-[#B84A39]/20 border-b border-[#B84A39] px-4 py-2 text-xs font-mono flex items-center justify-between text-[#B84A39]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B84A39] shrink-0" />
            <span>Wrong Network Detected (Chain ID #{wallet.chainId}). Please switch to Ganache Localnet or Sepolia.</span>
          </div>

          <button
            type="button"
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="px-3 py-1 rounded bg-[#B84A39] hover:bg-[#B84A39]/80 text-[#FFFDF5] font-bold text-[11px] transition-all shrink-0 cursor-pointer"
          >
            {isSwitching ? 'Switching...' : 'Switch to Ganache (1337)'}
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="bg-[#2B2B2B] text-[#FFFDF5] border-b border-[#2B2B2B]/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#FFFDF5]/10 border border-[#D4A017] flex items-center justify-center shadow-md shrink-0">
              <Layers className="w-5 h-5 text-[#D4A017]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[#FFFDF5] font-headline">ZYNTEX</h1>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#FFFDF5]/15 text-[#F0C94C] border border-[#D4A017]/30 whitespace-nowrap">
                  {wallet.networkName}
                </span>
              </div>
              <p className="text-[11px] text-[#FFFDF5]/70 font-sans hidden sm:block">Decentralized Cross-Chain Intent Network</p>
            </div>
          </div>

          {/* User View vs. Solver Dashboard Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#FFFDF5]/10 p-1 rounded-xl font-mono text-xs shrink-0 border border-white/10">
            <button
              type="button"
              onClick={() => onToggleViewMode('user')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer relative ${
                viewMode === 'user'
                  ? 'bg-[#D4A017] text-[#2B2B2B] shadow-sm'
                  : 'text-[#FFFDF5]/80 hover:text-[#FFFDF5]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>User View</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleViewMode('solver')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer relative ${
                viewMode === 'solver'
                  ? 'bg-[#D4A017] text-[#2B2B2B] shadow-sm'
                  : 'text-[#FFFDF5]/80 hover:text-[#FFFDF5]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Solver Dashboard</span>
            </button>
          </div>

          {/* TVL Metrics */}
          <div className="hidden xl:flex items-center gap-2.5 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF5]/10 border border-white/10 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-ping" />
              <span className="text-[#FFFDF5]/70">TVL:</span>
              <span className="text-[#F0C94C] font-bold">${contractState.escrowLockedUsd.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF5]/10 border border-white/10 whitespace-nowrap">
              <span className="text-[#FFFDF5]/70">Bonds:</span>
              <span className="text-[#FFFDF5] font-bold">${contractState.solverBondLockedUsd.toLocaleString()}</span>
            </div>
          </div>

          {/* Chain Telemetry & Action Buttons */}
          <div className="flex items-center gap-2.5 font-mono shrink-0">
            <GanacheChainWidget onOpenLedger={onOpenLedger} />

            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/20 border border-white/10 text-[#FFFDF5] transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              <History className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>My Intents</span>
              {historyCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4A017] text-[#2B2B2B] font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleWallet}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md whitespace-nowrap cursor-pointer shrink-0 ${
                wallet.isConnected
                  ? 'bg-[#D4A017] text-[#2B2B2B] hover:bg-[#E0AB1E]'
                  : 'bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/20 text-[#FFFDF5] border border-white/15'
              }`}
            >
              {wallet.isConnected ? <Wallet className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5 text-[#D4A017]" />}
              <span>{wallet.isConnected ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect'}</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
