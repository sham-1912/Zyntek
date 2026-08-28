import React from 'react';
import { Check, Loader2, AlertCircle, Circle, Layers } from 'lucide-react';
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
  stepNum: string;
  title: string;
  subtext: string;
}

const LIFECYCLE_STEPS: StepItem[] = [
  { id: 'intent_submitted', stepNum: '01', title: 'Intent Created', subtext: 'EIP-712 Signed' },
  { id: 'funds_locked', stepNum: '02', title: 'Escrow Locked', subtext: 'Vault.sol (EVM)' },
  { id: 'solver_selected', stepNum: '03', title: 'Solver Selected', subtext: 'Rank #1 Winner' },
  { id: 'bond_posted', stepNum: '04', title: 'Bond Staked', subtext: '$500 Collateral' },
  { id: 'cross_chain_execution', stepNum: '05', title: 'SVM Execution', subtext: 'Raydium/Orca' },
  { id: 'destination_confirmed', stepNum: '06', title: 'Delivery OK', subtext: 'SVM Verified' },
  { id: 'verification', stepNum: '07', title: 'Verification', subtext: 'Dual-Consensus' },
  { id: 'settlement_complete', stepNum: '08', title: 'Settlement', subtext: 'Funds Released' },
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
    <div className="glass-card p-6 space-y-6 shadow-md w-full border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#2B2B2B] shadow-xs">
            <Layers className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4A017] font-bold">
                MAIN EXECUTION LIFECYCLE TRACKER
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
              Solver: <strong className="text-[#D4A017]">{selectedSolverName.split('—')[0]}</strong>
            </span>
          )}
          <span className="bg-[#F7E7B5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] text-[#2B2B2B] shadow-xs">
            Bond: <strong>${bondAmountUsd} USDC</strong>
          </span>
        </div>
      </div>

      {/* 8-Stage Sequential Stepper with Clean, Breathable Proportions */}
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
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 relative min-h-[105px] ${
                state === 'completed'
                  ? 'bg-[#F7E7B5]/80 border-[#D4A017] text-[#2B2B2B] shadow-xs'
                  : state === 'active'
                  ? 'bg-[#F0C94C] border-2 border-[#D4A017] text-[#2B2B2B] shadow-md ring-2 ring-[#D4A017]/40'
                  : state === 'failed'
                  ? 'bg-[#B84A39]/15 border-[#B84A39] text-[#B84A39] shadow-sm'
                  : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A] opacity-75'
              }`}
            >
              {/* Step Top: Step Number + Status Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-[#5A5A5A] uppercase">{step.stepNum}</span>

                {state === 'completed' && (
                  <div className="w-4 h-4 rounded-full bg-[#607A3A] text-[#FFFDF5] flex items-center justify-center font-bold shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {state === 'active' && (
                  <div className="w-4 h-4 rounded-full bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-[#D4A017]" />
                  </div>
                )}

                {state === 'failed' && (
                  <div className="w-4 h-4 rounded-full bg-[#B84A39] text-[#FFFDF5] flex items-center justify-center">
                    <AlertCircle className="w-2.5 h-2.5" />
                  </div>
                )}

                {state === 'pending' && (
                  <div className="w-3.5 h-3.5 rounded-full border border-[rgba(43,43,43,0.2)] flex items-center justify-center">
                    <Circle className="w-1 h-1 text-black/20" />
                  </div>
                )}
              </div>

              {/* Step Titles */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-mono font-bold leading-tight text-[#2B2B2B] truncate">
                  {step.title}
                </h4>
                <p className="text-[10px] text-[#5A5A5A] font-sans truncate">{step.subtext}</p>

                <div className="pt-1 font-mono text-[10px] font-bold">
                  {state === 'completed' && <span className="text-[#607A3A]">✓ Cleared</span>}
                  {state === 'active' && <span className="text-[#2B2B2B] animate-pulse">◉ Running</span>}
                  {state === 'failed' && <span className="text-[#B84A39]">❌ Failed</span>}
                  {state === 'pending' && <span className="text-[#5A5A5A]/50">○ Standby</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Connected Topology Flow Nodes (Clean & Well-Proportioned) */}
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
            {intent ? `$${intent.sourceAmount} ${intent.sourceAsset}` : '$500 USDC'}
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
            {selectedBid ? selectedBid.solverName.split('—')[0] : 'Solver B'}
          </div>
          <span className={`text-xs mt-1 block font-bold ${
            isExecuting ? 'text-[#2B2B2B]' : isDelivered ? 'text-[#607A3A]' : 'text-[#5A5A5A]'
          }`}>
            {isExecuting ? '◉ Executing SVM Leg' : isDelivered ? '✓ Fulfilled' : '○ Standby'}
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
            {selectedBid ? `$${selectedBid.expectedOutput} USDC` : '$497.82 USDC'}
          </div>
          <span className={`text-xs mt-1 block font-bold ${isDelivered ? 'text-[#607A3A]' : 'text-[#5A5A5A]'}`}>
            {isDelivered ? '✓ Delivered on SVM' : '○ Awaiting Delivery'}
          </span>
        </div>

        {/* Node 4: Verification & Release */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isVerified
            ? 'bg-[#F7E7B5] border-[#D4A017]/40 text-[#2B2B2B] shadow-xs'
            : 'bg-[#FFFDF5] border-[rgba(43,43,43,0.1)] text-[#5A5A5A]'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#5A5A5A] uppercase font-semibold">4. Verification & Release</span>
            {isVerified ? (
              <Check className="w-4 h-4 text-[#607A3A]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-black/20" />
            )}
          </div>
          <div className="font-bold text-[#2B2B2B] text-sm sm:text-base">
            Dual-Consensus
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
