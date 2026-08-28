import React from 'react';
import { Check, Loader2, AlertCircle, Circle } from 'lucide-react';

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
  { id: 'funds_locked', label: '2. Funds Locked in Escrow', subtext: 'EVM EscrowVault.sol' },
  { id: 'solver_selected', label: '3. Solver Selected', subtext: 'Winning bid ranked' },
  { id: 'bond_posted', label: '4. Solver Bond Posted', subtext: '$500 Collateral locked' },
  { id: 'cross_chain_execution', label: '5. Cross-Chain Execution', subtext: 'Solana SVM leg' },
  { id: 'destination_confirmed', label: '6. Destination Confirmed', subtext: 'Delivery attested' },
  { id: 'verification', label: '7. Verification', subtext: 'Hybrid proof / window' },
  { id: 'settlement_complete', label: '8. Settlement Complete', subtext: 'Escrow released' },
];

interface TransactionLifecycleTrackerProps {
  currentStepId: LifecycleStepId | 'idle';
  isFailed?: boolean;
  failureReason?: string;
  selectedSolverName?: string;
  bondAmountUsd?: number;
}

export const TransactionLifecycleTracker: React.FC<TransactionLifecycleTrackerProps> = ({
  currentStepId,
  isFailed,
  failureReason,
  selectedSolverName,
  bondAmountUsd = 500,
}) => {
  if (currentStepId === 'idle') return null;

  const currentIdx = LIFECYCLE_STEPS.findIndex((s) => s.id === currentStepId);

  return (
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#A9A7FF] font-bold">
              Transaction Lifecycle Tracker
            </span>
            {selectedSolverName && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#20203A] text-[#D1FE5D] border border-[#D1FE5D]/30 font-mono font-bold">
                Solver: {selectedSolverName}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-0.5">
            Cross-Chain Intent Execution Lifecycle
          </h3>
          <p className="text-xs text-[#A5A5B8] mt-1 font-sans">
            End-to-end verifiable state transitions from EVM deposit to Solana settlement.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#A9A7FF] bg-[#20203A] px-3 py-1.5 rounded-lg border border-white/10 shrink-0 self-start sm:self-auto">
          <span>Bond: ${bondAmountUsd} USDC</span>
        </div>
      </div>

      {/* 8-Stage Sequential Flow Grid */}
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
                  ? 'bg-[#151526] border-[#D1FE5D]/60 text-white'
                  : state === 'active'
                  ? 'bg-[#20203A] border-[#1053D4] text-white shadow-lg shadow-[#1053D4]/20 ring-1 ring-[#1053D4]'
                  : state === 'failed'
                  ? 'bg-[#FF7032]/15 border-[#FF7032] text-[#FF7032] shadow-lg shadow-[#FF7032]/20'
                  : 'bg-[#151526]/50 border-white/5 text-[#A5A5B8] opacity-60'
              }`}
            >
              {/* Top Status Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold opacity-60">0{idx + 1}</span>

                {state === 'completed' && (
                  <div className="w-5 h-5 rounded-full bg-[#D1FE5D]/20 border border-[#D1FE5D] flex items-center justify-center text-[#D1FE5D]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {state === 'active' && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1053D4] animate-ping" />
                    <Loader2 className="w-4 h-4 text-[#A9A7FF] animate-spin" />
                  </div>
                )}

                {state === 'failed' && (
                  <div className="w-5 h-5 rounded-full bg-[#FF7032]/20 border border-[#FF7032] flex items-center justify-center text-[#FF7032]">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}

                {state === 'pending' && (
                  <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                    <Circle className="w-2 h-2 text-white/20" />
                  </div>
                )}
              </div>

              {/* Label & Status */}
              <div>
                <h4
                  className={`text-[11px] font-mono font-bold leading-tight ${
                    state === 'completed'
                      ? 'text-[#D1FE5D]'
                      : state === 'active'
                      ? 'text-white'
                      : state === 'failed'
                      ? 'text-[#FF7032]'
                      : 'text-[#A5A5B8]'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[9px] text-[#A5A5B8] font-mono mt-0.5">{step.subtext}</p>

                <div className="mt-1.5 font-mono text-[9px] font-bold">
                  {state === 'completed' && <span className="text-[#D1FE5D]">✓ Completed</span>}
                  {state === 'active' && <span className="text-[#A9A7FF] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1053D4]" />◉ Active</span>}
                  {state === 'failed' && <span className="text-[#FF7032]">❌ FAILED</span>}
                  {state === 'pending' && <span className="text-[#A5A5B8]">○ Pending</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Failure Alert Banner */}
      {isFailed && (
        <div className="bg-[#FF7032]/15 border-2 border-[#FF7032] rounded-xl p-4 flex items-start gap-3 text-xs text-white font-mono animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-[#FF7032] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#FF7032] uppercase tracking-wider block">
              Execution Failure Detected at Step {currentIdx + 1}
            </span>
            <p className="text-[#A5A5B8] text-xs font-sans">
              {failureReason || 'Solver failed to confirm destination delivery before the deadline.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
