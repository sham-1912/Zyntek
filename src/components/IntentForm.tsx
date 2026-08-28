import React, { useState } from 'react';
import type { UserIntent, PrioritySliders as SlidersType } from '../services/types';
import { PrioritySliders } from './PrioritySliders';
import { Send, Sparkles } from 'lucide-react';

interface IntentFormProps {
  onSubmit: (intent: UserIntent) => void;
  disabled?: boolean;
}

export const IntentForm: React.FC<IntentFormProps> = ({ onSubmit, disabled }) => {
  const [sourceAmount, setSourceAmount] = useState<number>(500);
  const [sliders, setSliders] = useState<SlidersType>({ cost: 60, speed: 20, safety: 20 });
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntent: UserIntent = {
      intentId: `intent_${Math.random().toString(36).substr(2, 9)}`,
      sourceChain: 'ethereum',
      sourceAsset: 'USDC',
      sourceAmount: Number(sourceAmount),
      destinationChain: 'solana',
      destinationAsset: 'USDC',
      minAcceptableOutput: Number((sourceAmount * 0.98).toFixed(2)),
      deadlineMinutes,
      sliders,
      timestamp: Date.now(),
    };
    onSubmit(newIntent);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Create Financial Intent</span>
          </h2>
          <p className="text-xs text-slate-400">
            Specify desired cross-chain outcome. Solvers compete to fulfill it.
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-mono">
          EVM → Solana Leg
        </span>
      </div>

      {/* Cross-Chain Swap Pair Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Chain & Asset */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-medium">Source (Deposit into Escrow)</label>
          <div className="flex items-center justify-between">
            <select
              value="ethereum"
              disabled
              className="bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800"
            >
              <option value="ethereum">Ethereum (Sepolia)</option>
            </select>
            <span className="text-xs font-bold text-indigo-400 font-mono">USDC</span>
          </div>
          <div className="pt-2">
            <label className="text-xs text-slate-400">Amount (USD)</label>
            <input
              type="number"
              min="10"
              max="50000"
              value={sourceAmount}
              disabled={disabled}
              onChange={(e) => setSourceAmount(Number(e.target.value))}
              className="w-full mt-1 bg-slate-950 text-white font-mono font-bold text-lg px-3 py-2 rounded-lg border border-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quick preset buttons for demo */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-500">Presets:</span>
            <button
              type="button"
              onClick={() => setSourceAmount(250)}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
            >
              $250 (Standard)
            </button>
            <button
              type="button"
              onClick={() => setSourceAmount(1500)}
              className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 font-mono"
            >
              $1,500 (High-Value Gate)
            </button>
          </div>
        </div>

        {/* Destination Chain & Asset */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-medium">Destination (Receive Outcome)</label>
          <div className="flex items-center justify-between">
            <select
              value="solana"
              disabled
              className="bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800"
            >
              <option value="solana">Solana Network</option>
            </select>
            <span className="text-xs font-bold text-cyan-400 font-mono">USDC</span>
          </div>
          <div className="pt-2">
            <label className="text-xs text-slate-400">Min Acceptable Output (~98%)</label>
            <div className="w-full mt-1 bg-slate-950/60 text-slate-300 font-mono font-bold text-lg px-3 py-2 rounded-lg border border-slate-800">
              ${(sourceAmount * 0.98).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Timeout Deadline:</span>
            <select
              value={deadlineMinutes}
              disabled={disabled}
              onChange={(e) => setDeadlineMinutes(Number(e.target.value))}
              className="bg-slate-950 text-slate-300 text-xs px-2 py-1 rounded border border-slate-800 font-mono"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Priority Sliders Component */}
      <PrioritySliders sliders={sliders} onChange={setSliders} disabled={disabled} />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3.5 px-6 rounded-xl gradient-bg hover:opacity-90 transition-all font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>Broadcast Intent to Solvers Marketplace</span>
      </button>
    </form>
  );
};
