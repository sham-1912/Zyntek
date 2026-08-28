import React, { useState, useEffect } from 'react';
import type { UserIntent, ChainId, PrioritySliders as SlidersType } from '../services/types';
import { PrioritySliders } from './PrioritySliders';
import { web3Provider } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import { Send, Plug, Clock, Percent } from 'lucide-react';

interface IntentFormProps {
  onPreCommitTrigger: (intent: UserIntent) => void;
  disabled?: boolean;
  sliders: SlidersType;
  onSlidersChange: (sliders: SlidersType) => void;
  sourceAmount?: number;
  onAmountChange?: (amount: number) => void;
}

export const IntentForm: React.FC<IntentFormProps> = ({
  onPreCommitTrigger,
  disabled,
  sliders,
  onSlidersChange,
  sourceAmount: propAmount,
  onAmountChange,
}) => {
  const [walletState, setWalletState] = useState<WalletState>(web3Provider.getWalletState());

  useEffect(() => {
    const unsubscribe = web3Provider.subscribe((updated) => {
      setWalletState(updated);
    });
    return unsubscribe;
  }, []);

  const [sourceChain] = useState<ChainId>('ethereum');
  const sourceAsset = 'USDC';
  const [localAmount, setLocalAmount] = useState<number>(500);

  const sourceAmount = propAmount ?? localAmount;

  const [destinationChain] = useState<ChainId>('solana');
  const destinationAsset = 'USDC';

  const estimatedMinOutput = Number((sourceAmount * 0.985).toFixed(2));

  const handleConnectWalletClick = async () => {
    const updated = await web3Provider.connectWallet();
    setWalletState(updated);
  };

  const handleAmountUpdate = (val: number) => {
    setLocalAmount(val);
    onAmountChange?.(val);
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

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4 shadow-md flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)]">
      {/* Header & Connected Wallet Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#2B2B2B] font-headline flex items-center gap-2">
              <span>Active Cross-Chain Intent & Constraints</span>
            </h2>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/40 font-bold shadow-sm">
              Ethereum L1 → Solana SVM
            </span>
          </div>
          <p className="text-xs text-[#5A5A5A] mt-0.5 font-sans">
            Declare target outcome & safety constraints. Decentralized solvers bid to execute.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {walletState.isConnected ? (
            <span className="px-3 py-1 rounded-lg bg-[#F7E7B5] text-[#2B2B2B] font-semibold flex items-center gap-2 shadow-sm border border-[rgba(43,43,43,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
              <span className="font-bold">{walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}</span>
              <span className="text-[#5A5A5A] font-normal">({walletState.balanceEth} ETH)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectWalletClick}
              className="px-3 py-1.5 rounded-lg bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-bold flex items-center gap-1.5 shadow-sm transition-all font-mono text-xs cursor-pointer"
            >
              <Plug className="w-3.5 h-3.5 text-[#2B2B2B]" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Side-by-Side Route Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Source Box */}
        <div className="glass-sub-box p-3.5 space-y-1.5 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex justify-between items-center text-xs text-[#5A5A5A]">
            <span className="font-mono font-semibold">SOURCE (Deposit into Escrow)</span>
            <span className="font-mono text-[#2B2B2B] font-bold">Ethereum L1</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <input
              type="number"
              value={sourceAmount}
              onChange={(e) => handleAmountUpdate(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full bg-transparent text-2xl font-mono font-bold text-[#2B2B2B] focus:outline-none"
              placeholder="500"
            />

            <div className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.15)] font-mono text-xs font-bold text-[#2B2B2B] shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />
              <span>{sourceAsset}</span>
            </div>
          </div>
        </div>

        {/* Target Destination Box */}
        <div className="glass-sub-box p-3.5 space-y-1.5 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex justify-between items-center text-xs text-[#5A5A5A]">
            <span className="font-mono font-semibold">DESTINATION (Target Delivery)</span>
            <span className="font-mono text-[#2B2B2B] font-bold">Solana SVM</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-mono font-bold text-[#D4A017]">
              ~${estimatedMinOutput.toLocaleString()}
            </div>

            <div className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.15)] font-mono text-xs font-bold text-[#2B2B2B] shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F0C94C]" />
              <span>{destinationAsset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Intent Constraints Horizontal Strip */}
      <div className="glass-sub-box p-3 font-mono text-xs bg-[#F7E7B5]/40 border border-[rgba(43,43,43,0.08)]">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] font-semibold block mb-0.5">Min Output</span>
            <span className="text-[#D4A017] font-bold text-xs">≥ ${estimatedMinOutput} USDC</span>
          </div>

          <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] font-semibold block mb-0.5">Deadline</span>
            <span className="text-[#2B2B2B] font-bold text-xs flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4A017]" /> 10:00 mins
            </span>
          </div>

          <div className="bg-[#FFFDF5] p-2 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] font-semibold block mb-0.5">Max Slippage</span>
            <span className="text-[#2B2B2B] font-bold text-xs flex items-center justify-center gap-1">
              <Percent className="w-3.5 h-3.5 text-[#D4A017]" /> 0.5% Limit
            </span>
          </div>
        </div>
      </div>

      {/* Compact Priority Sliders */}
      <PrioritySliders
        sliders={sliders}
        onChange={onSlidersChange}
        disabled={disabled}
      />

      {/* Primary CTA: Mustard background #D4A017 with Charcoal text #2B2B2B */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-sm font-bold text-[#2B2B2B] shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-4 h-4 text-[#2B2B2B]" />
        <span>Broadcast Intent to Solver Mesh →</span>
      </button>
    </form>
  );
};
