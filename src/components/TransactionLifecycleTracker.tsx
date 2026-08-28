import React from 'react';
import { Check, Loader2, AlertCircle, Circle, Layers, ShieldCheck } from 'lucide-react';
import type { UserIntent, SolverBid, PipelineStage } from '../services/types';

export type LifecycleStepId =
  | 'intent_submitted'
  | 'funds_locked'
  | 'solver_selected'
  | 'bond_posted'
  | 'cross_chain_execution'
  | 'destination_confirmed'
  | 'verification'
  | 'settlement_complete';

export type StepState = 'completed' | 'active' | 'pending' | 'failed';

export interface StepItem {
  id: LifecycleStepId;
  label: string;
  subtext: string;
}

const LIFECYCLE_STEPS: StepItem[] = [
  { id: 'intent_submitted', label: '1. Intent Submitted', subtext: 'Outcome signed' },
  { id: 'funds_locked', label: '2. Escrow Locked', subtext: 'EVM Vault' },
  { id: 'solver_selected', label: '3. Solver Selected', subtext: 'Ranked winner' },
  { id: 'bond_posted', label: '4. Bond Posted', subtext: '$500 Collateral' },
  { id: 'cross_chain_execution', label: '5. Execution', subtext: 'Solana SVM' },
  { id: 'destination_confirmed', label: '6. Destination OK', subtext: 'Delivery verified' },
  { id: 'verification', label: '7. Verification', subtext: 'Optimistic / ZK' },
  { id: 'settlement_complete', label: '8. Settlement', subtext: 'Funds released' },
];

interface TransactionLifecycleTrackerProps {
  currentStepId: LifecycleStepId | 'idle';
  isFailed?: boolean;
  failureReason?: string;
  selectedSolverName?: string;
  bondAmountUsd?: number;
  intent?: UserIntent | null;
  selectedBid?: SolverBid | null;
  stage?: PipelineStage;
}

export const TransactionLifecycleTracker: React.FC<TransactionLifecycleTrackerProps> = ({
  currentStepId,
  isFailed,
  failureReason,
  selectedSolverName,
  bondAmountUsd = 500,
  intent,
  selectedBid,
  stage = 'idle',
}) => {
  const currentIdx = LIFECYCLE_STEPS.findIndex((s) => s.id === currentStepId);

  const isEscrowLocked = stage !== 'idle' && stage !== 'intent';
  const isExecuting = stage === 'execution' || stage === 'executing_cross_chain';
  const isDelivered = stage === 'verification' || stage === 'settlement' || stage === 'settled';
  const isVerified = stage === 'settlement' || stage === 'settled';

  return (
    <div className="glass-card p-6 space-y-6 shadow-xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(22,42,70,0.8)] border border-[#2F6690]/60 flex items-center justify-center text-[#8DC2FF]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8DC2FF] font-bold">
                Main Execution Lifecycle Tracker
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(14,30,56,0.65)] text-[#CEF26D] border border-[#CEF26D]/30 font-mono font-bold">
                {currentStepId === 'settlement_complete' ? '✓ Settled' : currentStepId !== 'idle' ? '● In Progress' : '○ Standby'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono mt-0.5">
              Cross-Chain Verification & Settlement Pipeline
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#CBD5E1]">
          {selectedSolverName && (
            <span className="text-white bg-[rgba(14,30,56,0.65)] px-3 py-1.5 rounded-lg border border-white/10">
              Solver: <span className="font-bold text-[#CEF26D]">{selectedSolverName.split('—')[0]}</span>
            </span>
          )}
          <span className="bg-[rgba(14,30,56,0.65)] px-3 py-1.5 rounded-lg border border-white/10">
            Bond: <span className="font-bold text-[#8DC2FF]">${bondAmountUsd} USDC</span>
          </span>
        </div>
      </div>

      {/* 8-Stage Sequential Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {LIFECYCLE_STEPS.map((step, idx) => {
          let state: StepState = 'pending';

          if (isFailed && idx === currentIdx) {
            state = 'failed';
          } else if (currentIdx > idx || (currentStepId === 'settlement_complete' && !isFailed)) {
            state = 'completed';
          } else if (currentIdx === idx) {
            state = 'active';
          }

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 relative ${
                state === 'completed'
                  ? 'bg-[rgba(22,42,70,0.7)] border-[#CEF26D]/60 text-white'
                  : state === 'active'
                  ? 'bg-[rgba(26,49,82,0.9)] border-[#8DC2FF] text-white shadow-lg shadow-[#2F6690]/30 ring-1 ring-[#8DC2FF]'
                  : state === 'failed'
                  ? 'bg-[#FF7032]/20 border-[#FF7032] text-[#FF7032] shadow-lg shadow-[#FF7032]/20'
                  : 'bg-[rgba(14,30,56,0.5)] border-white/5 text-[#CBD5E1] opacity-60'
              }`}
            >
              {/* Step Top */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold opacity-60">0{idx + 1}</span>

                {state === 'completed' && (
                  <div className="w-4 h-4 rounded-full bg-[#CEF26D]/20 border border-[#CEF26D] flex items-center justify-center text-[#CEF26D]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {state === 'active' && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DC2FF] animate-ping" />
                    <Loader2 className="w-3.5 h-3.5 text-[#8DC2FF] animate-spin" />
                  </div>
                )}

                {state === 'failed' && (
                  <div className="w-4 h-4 rounded-full bg-[#FF7032]/20 border border-[#FF7032] flex items-center justify-center text-[#FF7032]">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                )}

                {state === 'pending' && (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center">
                    <Circle className="w-1.5 h-1.5 text-white/20" />
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div>
                <h4
                  className={`text-[10px] font-mono font-bold leading-tight ${
                    state === 'completed'
                      ? 'text-[#CEF26D]'
                      : state === 'active'
                      ? 'text-white'
                      : state === 'failed'
                      ? 'text-[#FF7032]'
                      : 'text-[#CBD5E1]'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[9px] text-[#CBD5E1]/70 font-mono mt-0.5">{step.subtext}</p>

                <div className="mt-1 font-mono text-[9px] font-bold">
                  {state === 'completed' && <span className="text-[#CEF26D]">✓ OK</span>}
                  {state === 'active' && <span className="text-[#8DC2FF]">◉ Active</span>}
                  {state === 'failed' && <span className="text-[#FF7032]">❌ FAIL</span>}
                  {state === 'pending' && <span className="text-[#CBD5E1]/50">○ Wait</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Connected Topology Flow Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs pt-2 border-t border-white/10">
        {/* Node 1: Ethereum Source */}
        <div className={`p-3 rounded-xl border transition-all ${
          isEscrowLocked
            ? 'glass-sub-box border-[#CEF26D]/60 text-white'
            : 'bg-[rgba(14,30,56,0.5)] border-white/5 text-[#CBD5E1]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#CBD5E1] uppercase">1. Ethereum Escrow</span>
            {isEscrowLocked ? (
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            {intent ? `$${intent.sourceAmount} ${intent.sourceAsset}` : '500 USDC'}
          </div>
          <span className={`text-[10px] mt-0.5 block font-bold ${isEscrowLocked ? 'text-[#CEF26D]' : 'text-[#CBD5E1]'}`}>
            {isEscrowLocked ? '✓ Funds in Escrow' : '○ Standby'}
          </span>
        </div>

        {/* Node 2: Solver Network */}
        <div className={`p-3 rounded-xl border transition-all ${
          isExecuting
            ? 'glass-sub-box border-[#8DC2FF] text-white shadow-lg shadow-[#2F6690]/30'
            : isDelivered
            ? 'glass-sub-box border-[#CEF26D]/60 text-white'
            : 'bg-[rgba(14,30,56,0.5)] border-white/5 text-[#CBD5E1]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#CBD5E1] uppercase">2. Solver Mesh</span>
            {isExecuting ? (
              <Loader2 className="w-3.5 h-3.5 text-[#8DC2FF] animate-spin" />
            ) : isDelivered ? (
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            {selectedBid ? selectedBid.solverName.split('—')[0] : 'Alpha / Flash'}
          </div>
          <span className={`text-[10px] mt-0.5 block font-bold ${
            isExecuting ? 'text-[#8DC2FF]' : isDelivered ? 'text-[#CEF26D]' : 'text-[#CBD5E1]'
          }`}>
            {isExecuting ? '◉ Executing SVM Leg' : isDelivered ? '✓ Fulfill OK' : '○ Standby'}
          </span>
        </div>

        {/* Node 3: Solana Destination */}
        <div className={`p-3 rounded-xl border transition-all ${
          isDelivered
            ? 'glass-sub-box border-[#CEF26D]/60 text-white'
            : 'bg-[rgba(14,30,56,0.5)] border-white/5 text-[#CBD5E1]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#CBD5E1] uppercase">3. Solana Target</span>
            {isDelivered ? (
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-[#CEF26D] text-xs">
            {selectedBid ? `~$${selectedBid.expectedOutput} USDC` : '~492.50 USDC'}
          </div>
          <span className={`text-[10px] mt-0.5 block font-bold ${isDelivered ? 'text-[#CEF26D]' : 'text-[#CBD5E1]'}`}>
            {isDelivered ? '✓ Delivered' : '○ Awaiting Delivery'}
          </span>
        </div>

        {/* Node 4: Verification & Release */}
        <div className={`p-3 rounded-xl border transition-all ${
          isVerified
            ? 'glass-sub-box border-[#CEF26D]/60 text-white'
            : 'bg-[rgba(14,30,56,0.5)] border-white/5 text-[#CBD5E1]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#CBD5E1] uppercase">4. Verification</span>
            {isVerified ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#CEF26D]" />
            ) : (
              <Circle className="w-3 h-3 text-white/20" />
            )}
          </div>
          <div className="font-bold text-white text-xs">
            Optimistic / ZK
          </div>
          <span className={`text-[10px] mt-0.5 block font-bold ${isVerified ? 'text-[#CEF26D]' : 'text-[#CBD5E1]'}`}>
            {isVerified ? '✓ Settlement Final' : '○ Pending Proof'}
          </span>
        </div>
      </div>

      {/* Failure Alert Banner */}
      {isFailed && (
        <div className="bg-[#FF7032]/20 border-2 border-[#FF7032] rounded-xl p-4 flex items-start gap-3 text-xs text-white font-mono animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-[#FF7032] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#FF7032] uppercase tracking-wider block">
              Execution Failure Detected at Step {currentIdx + 1}
            </span>
            <p className="text-[#CBD5E1] text-xs font-sans">
              {failureReason || 'Solver failed to confirm destination delivery before the deadline.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
