import React, { useState, useEffect } from 'react';
import { web3Provider, GANACHE_CHAIN_ID, GANACHE_CHAIN_ID_ALT } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import { GanacheChainWidget } from './GanacheChainWidget';
import { Layers, Cpu, Wallet, History, Plug, AlertTriangle, UserCheck } from 'lucide-react';

interface HeaderProps {
  contractState: {
    escrowLockedUsd: number;
    solverBondLockedUsd: number;
    slashedTotalUsd: number;
    settledTotalUsd: number;
  };
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
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = web3Provider.subscribe((updatedState) => {
      setWallet(updatedState);
    });
    return unsubscribe;
  }, []);

  const handleToggleWallet = async () => {
    const updated = await web3Provider.connectWallet();
    setWallet(updated);
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    await web3Provider.switchToGanacheNetwork();
    setIsSwitching(false);
  };

  const isGanache = wallet.chainId === GANACHE_CHAIN_ID || wallet.chainId === GANACHE_CHAIN_ID_ALT;
  const isWrongNetwork = wallet.isConnected && !isGanache && wallet.chainId !== 11155111;

  return (
    <div className="sticky top-0 z-50">
      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="bg-amber-950 border-b border-amber-800 px-4 py-2 text-xs font-mono flex items-center justify-between text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Wrong Network Detected (Chain ID #{wallet.chainId}). Please switch to Ganache Localnet or Sepolia.</span>
          </div>

          <button
            type="button"
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-all shrink-0"
          >
            {isSwitching ? 'Switching...' : 'Switch to Ganache (1337)'}
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-indigo-900/40 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-mono">ZYNTEK</h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                  {wallet.networkName}
                </span>
              </div>
              <p className="text-xs text-slate-400">Decentralized Cross-Chain Intent Solver Network</p>
            </div>
          </div>

          {/* User View vs. Solver Dashboard Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => onToggleViewMode('user')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>User View</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleViewMode('solver')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'solver'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Solver Dashboard</span>
            </button>
          </div>

          {/* Live Network Metrics & Wallet Buttons */}
          <div className="flex items-center gap-3 font-mono">
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-400">Escrow TVL:</span>
                <span className="text-emerald-400 font-bold">${contractState.escrowLockedUsd.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Bonds:</span>
                <span className="text-cyan-400 font-bold">${contractState.solverBondLockedUsd.toLocaleString()}</span>
              </div>
            </div>

            <GanacheChainWidget />

            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 transition-all"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>My Intents</span>
              {historyCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleWallet}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shadow-md ${
                wallet.isConnected
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {wallet.isConnected ? <Wallet className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
              <span>{wallet.isConnected ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
