import React from 'react';
import { Check, Loader2, Circle, Layers, ShieldCheck } from 'lucide-react';
import type { UserIntent, SolverBid, PipelineStage } from '../services/types';

interface CrossChainVisualizerProps {
  intent: UserIntent | null;
  selectedBid: SolverBid | null;
  stage: PipelineStage;
}

export const CrossChainVisualizer: React.FC<CrossChainVisualizerProps> = ({
  intent,
  selectedBid,
  stage,
}) => {
  const isEscrowLocked = stage !== 'idle' && stage !== 'intent';
  const isExecuting = stage === 'execution' || stage === 'executing_cross_chain';
  const isDelivered = stage === 'verification' || stage === 'settlement' || stage === 'settled';
  const isVerified = stage === 'settlement' || stage === 'settled';

  return (
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#A9A7FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Cross-Chain Topology: Ethereum L1 → Solver Mesh → Solana SVM
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#D1FE5D] font-bold">
          {stage === 'settlement' || stage === 'settled' ? '✓ Settled' : stage !== 'idle' ? '◉ Live' : '○ Standby'}
        </span>
      </div>

      {/* 4 Connected Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        {/* Node 1: Ethereum Source */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isEscrowLocked
            ? 'bg-[#20203A] border-[#D1FE5D]/50 text-white'
            : 'bg-[#0B0B14] border-white/5 text-[#A5A5B8]'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-[#A5A5B8] uppercase">1. Ethereum Source</span>
            {isEscrowLocked ? (
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            {intent ? `$${intent.sourceAmount} ${intent.sourceAsset}` : '500 USDC'}
          </div>
          <span className={`text-[10px] mt-1 block font-bold ${isEscrowLocked ? 'text-[#D1FE5D]' : 'text-[#A5A5B8]'}`}>
            {isEscrowLocked ? '✓ Funds in Escrow' : '○ Awaiting Deposit'}
          </span>
        </div>

        {/* Node 2: Solver Network */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isExecuting
            ? 'bg-[#20203A] border-[#1053D4] text-white shadow-lg shadow-[#1053D4]/20'
            : isDelivered
            ? 'bg-[#20203A] border-[#D1FE5D]/50 text-white'
            : 'bg-[#0B0B14] border-white/5 text-[#A5A5B8]'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-[#A5A5B8] uppercase">2. Solver Mesh</span>
            {isExecuting ? (
              <Loader2 className="w-3.5 h-3.5 text-[#1053D4] animate-spin" />
            ) : isDelivered ? (
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            {selectedBid ? selectedBid.solverName.split('—')[0] : 'Alpha / Flash'}
          </div>
          <span className={`text-[10px] mt-1 block font-bold ${
            isExecuting ? 'text-[#A9A7FF]' : isDelivered ? 'text-[#D1FE5D]' : 'text-[#A5A5B8]'
          }`}>
            {isExecuting ? '◉ Executing Leg' : isDelivered ? '✓ Fulfill Completed' : '○ Standby'}
          </span>
        </div>

        {/* Node 3: Solana Destination */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isDelivered
            ? 'bg-[#20203A] border-[#D1FE5D]/50 text-white'
            : 'bg-[#0B0B14] border-white/5 text-[#A5A5B8]'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-[#A5A5B8] uppercase">3. Solana Target</span>
            {isDelivered ? (
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-[#D1FE5D] text-xs">
            {selectedBid ? `~$${selectedBid.expectedOutput} USDC` : '~496.50 USDC'}
          </div>
          <span className={`text-[10px] mt-1 block font-bold ${isDelivered ? 'text-[#D1FE5D]' : 'text-[#A5A5B8]'}`}>
            {isDelivered ? '✓ Delivered' : '○ Awaiting Delivery'}
          </span>
        </div>

        {/* Node 4: Verification & Release */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isVerified
            ? 'bg-[#20203A] border-[#D1FE5D]/50 text-white'
            : 'bg-[#0B0B14] border-white/5 text-[#A5A5B8]'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-[#A5A5B8] uppercase">4. Verification</span>
            {isVerified ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#D1FE5D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            Optimistic / ZK
          </div>
          <span className={`text-[10px] mt-1 block font-bold ${isVerified ? 'text-[#D1FE5D]' : 'text-[#A5A5B8]'}`}>
            {isVerified ? '✓ Settlement Final' : '○ Pending Proof'}
          </span>
        </div>
      </div>
    </div>
  );
};
