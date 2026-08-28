import React, { useState } from 'react';
import type { UserIntent, PrioritySliders as SlidersType } from '../services/types';
import { PrioritySliders } from './PrioritySliders';
import { ArrowRight, Zap, Layers, Sliders } from 'lucide-react';

interface IntentFormProps {
  onPreCommitTrigger: (intent: UserIntent) => void;
  disabled?: boolean;
  sliders: SlidersType;
  onSlidersChange: (sliders: SlidersType) => void;
  sourceAmount: number;
  onAmountChange: (amount: number) => void;
}

export const IntentForm: React.FC<IntentFormProps> = ({
  onPreCommitTrigger,
  disabled = false,
  sliders,
  onSlidersChange,
  sourceAmount,
  onAmountChange,
}) => {
  const [sourceChain] = useState<'ethereum'>('ethereum');
  const [destinationChain] = useState<'solana'>('solana');
  const [sourceAsset] = useState<string>('USDC');
  const [destinationAsset] = useState<string>('USDC');
  const [showSliders, setShowSliders] = useState<boolean>(true);

  const minReceived = (sourceAmount * 0.985).toFixed(2);
  const intentId = `INT-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntent: UserIntent = {
      intentId: `int_${Date.now()}`,
      sourceChain,
      sourceAsset,
      sourceAmount,
      destinationChain,
      destinationAsset,
      minAcceptableOutput: Number(minReceived),
      deadlineMinutes: 10,
      sliders,
      timestamp: Date.now(),
    };
    onPreCommitTrigger(newIntent);
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)] space-y-5 bg-[#FFFDF5]">
      {/* Header with Intent Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                Active Intent Definition
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7E7B5] text-[#2B2B2B] font-bold border border-[#D4A017]/40 shadow-xs">
                #{intentId}
              </span>
            </div>
            <p className="text-xs text-[#5A5A5A] font-sans">
              Specify your target outcome — ZYNTEK solver mesh discovers optimal routing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSliders(!showSliders)}
          className="px-3 py-1.5 rounded-lg bg-[#F7E7B5] hover:bg-[#F0C94C]/40 text-xs font-mono font-bold text-[#2B2B2B] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer border border-[rgba(43,43,43,0.08)] shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>{showSliders ? 'Hide Priorities' : 'Adjust Priorities'}</span>
        </button>
      </div>

      {/* Hero Outcome Box: 500 USDC Ethereum → Solana USDC */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="glass-sub-box p-4 space-y-3 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          
          {/* Main Visual Route Flow */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#FFFDF5] rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
            {/* Source */}
            <div className="text-center sm:text-left flex-1">
              <span className="text-[10px] uppercase font-mono font-bold text-[#5A5A5A] block">Source Chain</span>
              <span className="text-sm font-bold text-[#2B2B2B] font-mono flex items-center gap-1 justify-center sm:justify-start">
                Ethereum
              </span>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                <input
                  type="number"
                  min="10"
                  max="100000"
                  value={sourceAmount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  disabled={disabled}
                  className="w-24 text-base font-bold font-mono text-[#2B2B2B] bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.15)] rounded px-2 py-0.5 focus:outline-none focus:border-[#D4A017]"
                />
                <span className="text-xs font-bold font-mono text-[#2B2B2B]">USDC</span>
              </div>
            </div>

            {/* Middle Route Arrow */}
            <div className="flex flex-col items-center justify-center shrink-0 px-2">
              <span className="text-[9px] font-mono font-bold text-[#D4A017] uppercase tracking-wider mb-0.5">
                Marketplace Mesh
              </span>
              <div className="flex items-center gap-1 text-[#2B2B2B]">
                <div className="h-0.5 w-6 sm:w-10 bg-[#D4A017]" />
                <ArrowRight className="w-4 h-4 text-[#D4A017]" />
              </div>
              <span className="text-[9px] text-[#5A5A5A] font-mono mt-0.5">Automated Escrow</span>
            </div>

            {/* Destination */}
            <div className="text-center sm:text-right flex-1">
              <span className="text-[10px] uppercase font-mono font-bold text-[#5A5A5A] block">Destination Chain</span>
              <span className="text-sm font-bold text-[#2B2B2B] font-mono flex items-center gap-1 justify-center sm:justify-end">
                Solana
              </span>
              <div className="flex items-center gap-1.5 mt-1 justify-center sm:justify-end">
                <span className="text-base font-bold font-mono text-[#D4A017]">~{minReceived}</span>
                <span className="text-xs font-bold font-mono text-[#2B2B2B]">USDC</span>
              </div>
            </div>
          </div>

          {/* Outcome Constraints Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block font-semibold">Min Received</span>
              <span className="font-bold text-[#2B2B2B] text-xs">≥ ${minReceived} USDC</span>
            </div>
            <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block font-semibold">Deadline</span>
              <span className="font-bold text-[#2B2B2B] text-xs">10:00 mins</span>
            </div>
            <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block font-semibold">Max Slippage</span>
              <span className="font-bold text-[#2B2B2B] text-xs">0.50%</span>
            </div>
          </div>
        </div>

        {/* Dynamic Priority Sliders (if open) */}
        {showSliders && (
          <PrioritySliders
            sliders={sliders}
            onChange={onSlidersChange}
            disabled={disabled}
          />
        )}

        {/* Primary CTA Button: Mustard #D4A017 with Charcoal #2B2B2B text */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-3.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-mono text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          <Zap className="w-4 h-4 text-[#2B2B2B] fill-current" />
          <span>Broadcast Intent to Solver Mesh →</span>
        </button>
      </form>
    </div>
  );
};
