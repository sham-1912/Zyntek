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
  { id: 'intent_submitted', label: '1. Intent Submitted', subtext: 'Signed EIP-712' },
  { id: 'funds_locked', label: '2. Escrow Locked', subtext: 'EVM Vault.sol' },
  { id: 'solver_selected', label: '3. Solver Selected', subtext: 'Ranked Winner' },
  { id: 'bond_posted', label: '4. Bond Posted', subtext: '$500 Collateral' },
  { id: 'cross_chain_execution', label: '5. Execution', subtext: 'Solana SVM' },
  { id: 'destination_confirmed', label: '6. Destination OK', subtext: 'Delivery Verified' },
  { id: 'verification', label: '7. Verification', subtext: 'Optimistic / ZK' },
  { id: 'settlement_complete', label: '8. Settlement', subtext: 'Funds Released' },
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
    <div className="glass-card p-6 space-y-6 shadow-md w-full border border-[rgba(43,43,43,0.12)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#2B2B2B] shadow-xs">
            <Layers className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4A017] font-bold">
                Main Execution Lifecycle Tracker
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/40 font-mono font-bold shadow-xs">
                {currentStepId === 'settlement_complete' ? '✓ Settled' : currentStepId !== 'idle' ? '● In Progress' : '○ Standby'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B] font-headline mt-0.5">
              Cross-Chain Verification & Settlement Pipeline
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs text-[#5A5A5A]">
          {selectedSolverName && (
            <span className="text-[#2B2B2B] bg-[#F7E7B5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              Solver: <span className="font-bold text-[#D4A017]">{selectedSolverName.split('—')[0]}</span>
            </span>
          )}
          <span className="bg-[#F7E7B5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] text-[#2B2B2B] shadow-xs">
            Bond: <span className="font-bold text-[#2B2B2B]">${bondAmountUsd} USDC</span>
          </span>
        </div>
      </div>

      {/* 8-Stage Sequential Stepper with Readable Font Sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-300 relative min-h-[110px] ${
                state === 'completed'
                  ? 'bg-[#F7E7B5] border-[#D4A017] text-[#2B2B2B] shadow-xs'
                  : state === 'active'
                  ? 'bg-[#F0C94C] border-[#D4A017] text-[#2B2B2B] shadow-md ring-2 ring-[#D4A017]/50'
                  : state === 'failed'
                  ? 'bg-[#B84A39]/15 border-[#B84A39] text-[#B84A39] shadow-sm'
                  : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A] opacity-75'
              }`}
            >
              {/* Step Top */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold opacity-80">0{idx + 1}</span>

                {state === 'completed' && (
                  <div className="w-5 h-5 rounded-full bg-[#D4A017] text-[#2B2B2B] flex items-center justify-center font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {state === 'active' && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 text-[#2B2B2B] animate-spin" />
                  </div>
                )}

                {state === 'failed' && (
                  <div className="w-5 h-5 rounded-full bg-[#B84A39] text-[#FFFDF5] flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}

                {state === 'pending' && (
                  <div className="w-4 h-4 rounded-full border border-[rgba(43,43,43,0.25)] flex items-center justify-center">
                    <Circle className="w-1.5 h-1.5 text-black/20" />
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="space-y-0.5">
                <h4
                  className={`text-xs sm:text-[13px] font-mono font-bold leading-tight ${
                    state === 'completed'
                      ? 'text-[#2B2B2B]'
                      : state === 'active'
                      ? 'text-[#2B2B2B]'
                      : state === 'failed'
                      ? 'text-[#B84A39]'
                      : 'text-[#2B2B2B]'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-[#5A5A5A] font-mono">{step.subtext}</p>

                <div className="pt-1 font-mono text-[11px] font-bold">
                  {state === 'completed' && <span className="text-[#607A3A]">✓ OK</span>}
                  {state === 'active' && <span className="text-[#2B2B2B]">◉ Active</span>}
                  {state === 'failed' && <span className="text-[#B84A39]">❌ FAIL</span>}
                  {state === 'pending' && <span className="text-[#5A5A5A]/50">○ Standby</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Connected Topology Flow Nodes (Clear & Well-Proportioned) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono pt-2 border-t border-[rgba(43,43,43,0.08)]">
        {/* Node 1: Ethereum Source */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isEscrowLocked
            ? 'bg-[#F7E7B5] border-[#D4A017]/40 text-[#2B2B2B] shadow-xs'
            : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#5A5A5A] uppercase font-semibold">1. Ethereum Escrow</span>
            {isEscrowLocked ? (
              <Check className="w-4 h-4 text-[#607A3A]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-black/20" />
            )}
          </div>
          <div className="font-bold text-[#2B2B2B] text-sm sm:text-base">
            {intent ? `$${intent.sourceAmount} ${intent.sourceAsset}` : '500 USDC'}
          </div>
          <span className={`text-xs mt-1 block font-bold ${isEscrowLocked ? 'text-[#607A3A]' : 'text-[#5A5A5A]'}`}>
            {isEscrowLocked ? '✓ Funds in Escrow' : '○ Standby'}
          </span>
        </div>

        {/* Node 2: Solver Network */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isExecuting
            ? 'bg-[#F0C94C] border-[#D4A017] text-[#2B2B2B] shadow-md ring-2 ring-[#D4A017]/40'
            : isDelivered
            ? 'bg-[#F7E7B5] border-[#D4A017]/40 text-[#2B2B2B] shadow-xs'
            : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#5A5A5A] uppercase font-semibold">2. Solver Mesh</span>
            {isExecuting ? (
              <Loader2 className="w-4 h-4 text-[#2B2B2B] animate-spin" />
            ) : isDelivered ? (
              <Check className="w-4 h-4 text-[#607A3A]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-black/20" />
            )}
          </div>
          <div className="font-bold text-[#2B2B2B] text-sm sm:text-base">
            {selectedBid ? selectedBid.solverName.split('—')[0] : 'Alpha / Flash'}
          </div>
          <span className={`text-xs mt-1 block font-bold ${
            isExecuting ? 'text-[#2B2B2B]' : isDelivered ? 'text-[#607A3A]' : 'text-[#5A5A5A]'
          }`}>
            {isExecuting ? '◉ Executing SVM Leg' : isDelivered ? '✓ Fulfill OK' : '○ Standby'}
          </span>
        </div>

        {/* Node 3: Solana Destination */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isDelivered
            ? 'bg-[#F7E7B5] border-[#D4A017]/40 text-[#2B2B2B] shadow-xs'
            : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#5A5A5A] uppercase font-semibold">3. Solana Target</span>
            {isDelivered ? (
              <Check className="w-4 h-4 text-[#607A3A]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-black/20" />
            )}
          </div>
          <div className="font-bold text-[#D4A017] text-sm sm:text-base">
            {selectedBid ? `~$${selectedBid.expectedOutput} USDC` : '~492.50 USDC'}
          </div>
          <span className={`text-xs mt-1 block font-bold ${isDelivered ? 'text-[#607A3A]' : 'text-[#5A5A5A]'}`}>
            {isDelivered ? '✓ Delivered' : '○ Awaiting Delivery'}
          </span>
        </div>

        {/* Node 4: Verification & Release */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isVerified
            ? 'bg-[#F7E7B5] border-[#D4A017]/40 text-[#2B2B2B] shadow-xs'
            : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#5A5A5A] uppercase font-semibold">4. Verification</span>
            {isVerified ? (
              <ShieldCheck className="w-4 h-4 text-[#607A3A]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-black/20" />
            )}
          </div>
          <div className="font-bold text-[#2B2B2B] text-sm sm:text-base">
            Optimistic / ZK
          </div>
          <span className={`text-xs mt-1 block font-bold ${isVerified ? 'text-[#607A3A]' : 'text-[#5A5A5A]'}`}>
            {isVerified ? '✓ Settlement Final' : '○ Pending Proof'}
          </span>
        </div>
      </div>

      {/* Failure Alert Banner */}
      {isFailed && (
        <div className="bg-[#B84A39]/15 border-2 border-[#B84A39] rounded-xl p-4 flex items-start gap-3 text-xs text-[#B84A39] font-mono animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-[#B84A39] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#B84A39] uppercase tracking-wider block">
              Execution Failure Detected at Step {currentIdx + 1}
            </span>
            <p className="text-[#5A5A5A] text-xs font-sans">
              {failureReason || 'Solver failed to confirm destination delivery before the deadline.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
