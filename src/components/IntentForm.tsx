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
    <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header & Connected Wallet Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>Active Cross-Chain Intent & Constraints</span>
            </h2>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[rgba(14,30,56,0.8)] text-[#8DC2FF] border border-[#8DC2FF]/40 font-bold shadow-sm">
              Ethereum L1 → Solana SVM
            </span>
          </div>
          <p className="text-xs text-[#E2E8F0] mt-0.5 font-sans">
            Declare target outcome & safety constraints. Decentralized solvers bid to execute.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {walletState.isConnected ? (
            <span className="px-3 py-1 rounded-lg glass-sub-box text-white font-semibold flex items-center gap-2 shadow-sm border border-[#8DC2FF]/30">
              <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-pulse" />
              <span className="text-[#8DC2FF] font-bold">{walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}</span>
              <span className="text-[#CBD5E1] font-normal">({walletState.balanceEth} ETH)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectWalletClick}
              className="px-3 py-1.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] text-white font-bold flex items-center gap-1.5 shadow-md transition-all font-mono text-xs cursor-pointer"
            >
              <Plug className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Side-by-Side Route Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Source Box */}
        <div className="glass-sub-box p-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[#E2E8F0]">
            <span className="font-mono font-semibold">SOURCE (Deposit into Escrow)</span>
            <span className="font-mono text-[#8DC2FF] font-bold">Ethereum L1</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <input
              type="number"
              value={sourceAmount}
              onChange={(e) => handleAmountUpdate(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
              placeholder="500"
            />

            <div className="flex items-center gap-1.5 bg-[rgba(22,42,70,0.85)] px-3 py-1.5 rounded-lg border border-[#8DC2FF]/40 font-mono text-xs font-bold text-white shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F6690]" />
              <span>{sourceAsset}</span>
            </div>
          </div>
        </div>

        {/* Target Destination Box */}
        <div className="glass-sub-box p-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[#E2E8F0]">
            <span className="font-mono font-semibold">DESTINATION (Target Delivery)</span>
            <span className="font-mono text-[#8DC2FF] font-bold">Solana SVM</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-mono font-bold text-[#CEF26D]">
              ~${estimatedMinOutput.toLocaleString()}
            </div>

            <div className="flex items-center gap-1.5 bg-[rgba(22,42,70,0.85)] px-3 py-1.5 rounded-lg border border-[#8DC2FF]/40 font-mono text-xs font-bold text-white shrink-0 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DC2FF]" />
              <span>{destinationAsset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Intent Constraints Horizontal Strip */}
      <div className="glass-sub-box p-3 font-mono text-xs">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[rgba(10,20,38,0.8)] p-2 rounded-lg border border-white/10">
            <span className="text-[10px] text-[#CBD5E1] font-semibold block mb-0.5">Min Output</span>
            <span className="text-[#CEF26D] font-bold text-xs">≥ ${estimatedMinOutput} USDC</span>
          </div>

          <div className="bg-[rgba(10,20,38,0.8)] p-2 rounded-lg border border-white/10">
            <span className="text-[10px] text-[#CBD5E1] font-semibold block mb-0.5">Deadline</span>
            <span className="text-white font-bold text-xs flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8DC2FF]" /> 10:00 mins
            </span>
          </div>

          <div className="bg-[rgba(10,20,38,0.8)] p-2 rounded-lg border border-white/10">
            <span className="text-[10px] text-[#CBD5E1] font-semibold block mb-0.5">Max Slippage</span>
            <span className="text-white font-bold text-xs flex items-center justify-center gap-1">
              <Percent className="w-3.5 h-3.5 text-[#8DC2FF]" /> 0.5% Limit
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

      {/* Broadcast Intent Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3 rounded-xl bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-xs font-bold text-white shadow-lg shadow-[#2F6690]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Broadcast Intent to Solver Mesh</span>
      </button>
    </form>
  );
};
