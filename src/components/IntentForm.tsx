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
    <form onSubmit={handleSubmit} className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header & Connected Wallet Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#F3F6FF] font-mono flex items-center gap-2">
            <span>State Cross-Chain Intent & Constraints</span>
          </h2>
          <p className="text-xs text-[#8DC2FF]/80 mt-0.5">
            Declare your target outcome & safety guardrails. Solvers compete to fulfill within parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {walletState.isConnected ? (
            <span className="px-2.5 py-1 rounded bg-[#1A3152] border border-[#8DC2FF]/30 text-[#8DC2FF] font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-pulse" />
              <span>{walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}</span>
              <span className="text-[#8DC2FF]/60 font-normal">({walletState.balanceEth} ETH)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectWalletClick}
              className="px-3 py-1.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] text-[#F3F6FF] font-semibold flex items-center gap-1.5 shadow-md transition-all font-mono cursor-pointer"
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
        <div className="bg-[#101C2C] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#8DC2FF]/70">
            <span className="font-mono">SOURCE (Deposit into Escrow)</span>
            <span className="font-mono text-[#8DC2FF]">Ethereum L1</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={sourceAmount}
              onChange={(e) => handleAmountUpdate(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full bg-transparent text-2xl font-mono font-bold text-[#F3F6FF] focus:outline-none"
              placeholder="500"
            />

            <div className="flex items-center gap-2 bg-[#1A3152] px-3 py-1.5 rounded-lg border border-[#8DC2FF]/30 font-mono text-sm font-semibold text-[#F3F6FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F6690]" />
              <span>{sourceAsset}</span>
            </div>
          </div>
        </div>

        {/* Direction Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-[#1A3152] p-2 rounded-full border border-[#8DC2FF]/30 shadow-lg text-[#8DC2FF]">
            <ArrowDownUp className="w-4 h-4" />
          </div>
        </div>

        {/* Target Destination Asset Box */}
        <div className="bg-[#101C2C] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#8DC2FF]/70">
            <span className="font-mono">DESTINATION (Target Delivery)</span>
            <span className="font-mono text-[#8DC2FF]">Solana SVM</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl font-mono font-bold text-[#CEF26D]">
              ~${estimatedMinOutput.toLocaleString()} USDC
            </div>

            <div className="flex items-center gap-2 bg-[#1A3152] px-3 py-1.5 rounded-lg border border-[#8DC2FF]/30 font-mono text-sm font-semibold text-[#F3F6FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DC2FF]" />
              <span>{destinationAsset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Intent Constraints Panel */}
      <div className="bg-[#1A3152]/70 border border-[#8DC2FF]/20 rounded-xl p-4 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between text-[#8DC2FF] text-[11px] font-bold border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#CEF26D]" />
            MANDATORY INTENT CONSTRAINTS
          </span>
          <span className="text-[#8DC2FF]/60">Enforced on-chain</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[#8DC2FF]/80">
          <div className="bg-[#101C2C] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#8DC2FF]/70">Minimum Acceptable</span>
            <span className="text-[#CEF26D] font-bold">≥ ${estimatedMinOutput} USDC</span>
          </div>

          <div className="bg-[#101C2C] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#8DC2FF]/70">Execution Deadline</span>
            <span className="text-[#F3F6FF] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8DC2FF]" /> 10:00 mins
            </span>
          </div>

          <div className="bg-[#101C2C] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] block text-[#8DC2FF]/70">Maximum Slippage</span>
            <span className="text-[#F3F6FF] font-bold flex items-center gap-1">
              <Percent className="w-3 h-3 text-[#8DC2FF]" /> 0.5% Limit
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
        className="w-full py-3.5 rounded-xl bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-sm font-bold text-[#F3F6FF] shadow-lg shadow-[#2F6690]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Broadcast Intent to Solver Mesh</span>
      </button>
    </form>
  );
};
