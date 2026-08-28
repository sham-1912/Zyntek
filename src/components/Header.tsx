import React, { useState, useEffect } from 'react';
import { Layers, Wallet, Plug, History, AlertTriangle, UserCheck } from 'lucide-react';
import { web3Provider } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import type { ContractSimulationState } from '../services/types';
import { GanacheChainWidget } from './GanacheChainWidget';

interface HeaderProps {
  contractState: ContractSimulationState;
  onOpenHistory: () => void;
  historyCount: number;
  viewMode: 'user' | 'solver';
  onToggleViewMode: (mode: 'user' | 'solver') => void;
}

export const Header: React.FC<HeaderProps> = ({
  contractState,
  onOpenHistory,
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
    <div className="sticky top-0 z-50">
      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="bg-[#FF7032]/20 border-b border-[#FF7032] px-4 py-2 text-xs font-mono flex items-center justify-between text-[#FF7032]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF7032] shrink-0" />
            <span>Wrong Network Detected (Chain ID #{wallet.chainId}). Please switch to Ganache Localnet or Sepolia.</span>
          </div>

          <button
            type="button"
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="px-3 py-1 rounded bg-[#FF7032] hover:bg-[#FF7032]/80 text-white font-bold text-[11px] transition-all shrink-0 cursor-pointer"
          >
            {isSwitching ? 'Switching...' : 'Switch to Ganache (1337)'}
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-[#8DC2FF]/20 bg-[#070F1E]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#142848] border border-[#2F6690] flex items-center justify-center shadow-lg shadow-[#2F6690]/30 shrink-0">
              <Layers className="w-5 h-5 text-[#8DC2FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-headline">ZYNTEK</h1>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#142848] text-[#8DC2FF] border border-[#8DC2FF]/30 whitespace-nowrap">
                  {wallet.networkName}
                </span>
              </div>
              <p className="text-[11px] text-[#CBD5E1] font-sans hidden sm:block">Decentralized Cross-Chain Intent Network</p>
            </div>
          </div>

          {/* User View vs. Solver Dashboard Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#0E1E38] border border-[#8DC2FF]/20 font-mono text-xs shrink-0">
            <button
              type="button"
              onClick={() => onToggleViewMode('user')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'user'
                  ? 'bg-[#2F6690] text-white shadow-md'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>User View</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleViewMode('solver')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === 'solver'
                  ? 'bg-[#2F6690] text-white shadow-md'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Solver Dashboard</span>
            </button>
          </div>

          {/* TVL Metrics */}
          <div className="hidden xl:flex items-center gap-2.5 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1E38] border border-[#8DC2FF]/20 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-ping" />
              <span className="text-[#CBD5E1]">TVL:</span>
              <span className="text-[#CEF26D] font-bold">${contractState.escrowLockedUsd.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1E38] border border-[#8DC2FF]/20 whitespace-nowrap">
              <span className="text-[#CBD5E1]">Bonds:</span>
              <span className="text-[#8DC2FF] font-bold">${contractState.solverBondLockedUsd.toLocaleString()}</span>
            </div>
          </div>

          {/* Chain Telemetry & Action Buttons */}
          <div className="flex items-center gap-2.5 font-mono shrink-0">
            <GanacheChainWidget />

            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#0E1E38] hover:bg-[#142848] border border-[#8DC2FF]/20 text-[#8DC2FF] hover:text-white transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              <History className="w-3.5 h-3.5 text-[#8DC2FF]" />
              <span>My Intents</span>
              {historyCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2F6690] text-white font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleWallet}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md whitespace-nowrap cursor-pointer shrink-0 ${
                wallet.isConnected
                  ? 'bg-[#2F6690] hover:bg-[#3D7BAA] text-white shadow-[#2F6690]/30'
                  : 'bg-[#0E1E38] hover:bg-[#142848] text-[#8DC2FF] border border-[#8DC2FF]/30'
              }`}
            >
              {wallet.isConnected ? <Wallet className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5 text-[#8DC2FF]" />}
              <span>{wallet.isConnected ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect'}</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
