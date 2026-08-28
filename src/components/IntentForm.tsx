import React, { useState, useEffect } from 'react';
import type { UserIntent, ChainId, PrioritySliders as SlidersType } from '../services/types';
import { PrioritySliders } from './PrioritySliders';
import { web3Provider } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import { Send, ArrowDownUp, Lock, HelpCircle, Plug } from 'lucide-react';

interface IntentFormProps {
  onPreCommitTrigger: (intent: UserIntent) => void;
  disabled?: boolean;
}

export const IntentForm: React.FC<IntentFormProps> = ({ onPreCommitTrigger, disabled }) => {
  const [walletState, setWalletState] = useState<WalletState>(web3Provider.getWalletState());

  useEffect(() => {
    const unsubscribe = web3Provider.subscribe((updated) => {
      setWalletState(updated);
    });
    return unsubscribe;
  }, []);

  const [sourceChain] = useState<ChainId>('ethereum');
  const [sourceAsset, setSourceAsset] = useState<string>('USDC');
  const [sourceAmount, setSourceAmount] = useState<number>(500);

  const [destinationChain] = useState<ChainId>('solana');
  const [destinationAsset, setDestinationAsset] = useState<string>('USDC');

  const [sliders, setSliders] = useState<SlidersType>({
    cost: 50,
    speed: 30,
    safety: 20,
  });

  const estimatedMinOutput = Number((sourceAmount * 0.985).toFixed(2));
  const isHighValue = sourceAmount >= 1000;

  const handleConnectWalletClick = async () => {
    const updated = await web3Provider.connectWallet();
    setWalletState(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const newIntent: UserIntent = {
      intentId: `int_${Math.random().toString(36).substr(2, 8)}`,
      sourceChain,
      sourceAsset,
      sourceAmount,
      destinationChain,
      destinationAsset,
      minAcceptableOutput: estimatedMinOutput,
      deadlineMinutes: 10,
      sliders,
      timestamp: Date.now(),
    };

    onPreCommitTrigger(newIntent);
  };

  const handleApplyPreset = (amount: number) => {
    setSourceAmount(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
      {/* Header & Connected Wallet Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>State Cross-Chain Intent</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Specify source deposit & target destination. Solvers compete to fulfill.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {walletState.isConnected ? (
            <span className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}</span>
              <span className="text-slate-500 font-normal">({walletState.balanceEth} ETH)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectWalletClick}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md transition-all animate-pulse-glow"
            >
              <Plug className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Buttons for Quick Demo Testing */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 text-[11px]">Quick Amount Presets:</span>
        <button
          type="button"
          onClick={() => handleApplyPreset(500)}
          className={`px-2.5 py-1 rounded border transition-all ${
            sourceAmount === 500
              ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          $500 (Standard)
        </button>

        <button
          type="button"
          onClick={() => handleApplyPreset(1500)}
          className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
            sourceAmount === 1500
              ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>$1,500 (High-Value Gate)</span>
        </button>
      </div>

      {/* Source Asset & Amount Box */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>YOU PAY (Source Escrow Deposit)</span>
          <span>Sepolia Testnet</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={sourceAmount}
            disabled={disabled}
            onChange={(e) => setSourceAmount(Math.max(1, Number(e.target.value)))}
            className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
            placeholder="0.00"
          />

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0">
            <select
              value={sourceAsset}
              onChange={(e) => setSourceAsset(e.target.value)}
              disabled={disabled}
              className="bg-transparent text-xs font-bold text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Switch Arrow Icon */}
      <div className="flex justify-center -my-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-md">
          <ArrowDownUp className="w-4 h-4" />
        </div>
      </div>

      {/* Destination Asset & Minimum Output Box */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>YOU RECEIVE (Target Outcome Delivered)</span>
          <span>Solana Network</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full text-2xl font-bold font-mono text-emerald-400">
            ~${estimatedMinOutput}
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 shrink-0">
            <select
              value={destinationAsset}
              onChange={(e) => setDestinationAsset(e.target.value)}
              disabled={disabled}
              className="bg-transparent text-xs font-bold text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value="USDC">USDC (Solana)</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Priority Sliders Component */}
      <PrioritySliders sliders={sliders} onChange={setSliders} disabled={disabled} />

      {/* Inline Tooltip for High-Value Gate */}
      {isHighValue && (
        <div className="bg-indigo-950/60 border border-indigo-800 p-3 rounded-lg flex items-start gap-2.5 text-xs text-indigo-200 font-mono">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-0.5">
              High-Value Verification Gate Active ($1,500 &ge; $1,000):
            </span>
            <p className="font-sans text-[11px] leading-tight text-slate-300">
              Above $1,000, delivery is verified with a stronger cryptographic ZK/Oracle attestation proof before funds release — slightly slower, much safer.
            </p>
          </div>
        </div>
      )}

      {/* Upfront Expectation Note */}
      <div className="text-center text-[11px] text-slate-400 font-mono">
        ⚡ Solvers typically respond within ~10–15 seconds.
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3.5 px-4 rounded-xl gradient-bg hover:opacity-95 text-white font-bold text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>Review & Broadcast Intent</span>
      </button>
    </form>
  );
};
