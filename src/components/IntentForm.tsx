import React, { useState, useEffect } from 'react';
import type { UserIntent, ChainId, PrioritySliders as SlidersType } from '../services/types';
import { PrioritySliders } from './PrioritySliders';
import { web3Provider } from '../services/web3Provider';
import type { WalletState } from '../services/web3Provider';
import { Send, ArrowDownUp, Plug, Sliders, Clock, Percent } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="bg-[#151526] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header & Connected Wallet Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>State Cross-Chain Intent & Constraints</span>
          </h2>
          <p className="text-xs text-[#A5A5B8] mt-0.5">
            Declare your target outcome & safety guardrails. Solvers compete to fulfill within parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {walletState.isConnected ? (
            <span className="px-2.5 py-1 rounded bg-[#20203A] border border-white/10 text-[#A9A7FF] font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D1FE5D] animate-pulse" />
              <span>{walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}</span>
              <span className="text-[#A5A5B8] font-normal">({walletState.balanceEth} ETH)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectWalletClick}
              className="px-3 py-1.5 rounded-lg bg-[#1053D4] hover:bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md transition-all font-mono cursor-pointer"
            >
              <Plug className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Source & Destination Grids */}
      <div className="space-y-3">
        {/* Source Asset & Amount Box */}
        <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#A5A5B8]">
            <span className="font-mono">SOURCE (Deposit into Escrow)</span>
            <span className="font-mono text-[#A9A7FF]">Ethereum L1</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={sourceAmount}
              onChange={(e) => handleAmountUpdate(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
              placeholder="500"
            />

            <div className="flex items-center gap-2 bg-[#20203A] px-3 py-1.5 rounded-lg border border-white/10 font-mono text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1053D4]" />
              <span>{sourceAsset}</span>
            </div>
          </div>
        </div>

        {/* Direction Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-[#20203A] p-2 rounded-full border border-white/10 shadow-lg text-[#A9A7FF]">
            <ArrowDownUp className="w-4 h-4" />
          </div>
        </div>

        {/* Target Destination Asset Box */}
        <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#A5A5B8]">
            <span className="font-mono">DESTINATION (Target Delivery)</span>
            <span className="font-mono text-[#7171DE]">Solana SVM</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl font-mono font-bold text-[#D1FE5D]">
              ~${estimatedMinOutput.toLocaleString()} USDC
            </div>

            <div className="flex items-center gap-2 bg-[#20203A] px-3 py-1.5 rounded-lg border border-white/10 font-mono text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7171DE]" />
              <span>{destinationAsset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 7: Explicit Intent Constraints Panel */}
      <div className="bg-[#20203A]/60 border border-white/10 rounded-xl p-4 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between text-[#A9A7FF] text-[11px] font-bold border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#D1FE5D]" />
            MANDATORY INTENT CONSTRAINTS
          </span>
          <span className="text-[#A5A5B8]">Enforced on-chain</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[#A5A5B8]">
          <div className="bg-[#0B0B14] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#A5A5B8]">Minimum Acceptable</span>
            <span className="text-[#D1FE5D] font-bold">≥ ${estimatedMinOutput} USDC</span>
          </div>

          <div className="bg-[#0B0B14] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#A5A5B8]">Execution Deadline</span>
            <span className="text-white font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A9A7FF]" /> 10:00 mins
            </span>
          </div>

          <div className="bg-[#0B0B14] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#A5A5B8]">Maximum Slippage</span>
            <span className="text-white font-bold flex items-center gap-1">
              <Percent className="w-3 h-3 text-[#1053D4]" /> 0.5% Limit
            </span>
          </div>
        </div>
      </div>

      {/* Priority Weights (Cost / Speed / Safety) */}
      <PrioritySliders
        sliders={sliders}
        onChange={onSlidersChange}
        disabled={disabled}
      />

      {/* Broadcast Intent Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3.5 rounded-xl bg-[#1053D4] hover:bg-blue-600 font-mono text-sm font-bold text-white shadow-lg shadow-[#1053D4]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Broadcast Intent to Solver Mesh</span>
      </button>
    </form>
  );
};
