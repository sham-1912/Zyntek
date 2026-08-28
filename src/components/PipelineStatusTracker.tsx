import React from 'react';
import type { PipelineStage } from '../services/types';
import { Check, Circle, Loader2, Sparkles } from 'lucide-react';

interface PipelineStatusTrackerProps {
  stage: PipelineStage;
  subStatusText?: string;
  intentId?: string;
  winningSolverName?: string;
}

interface StepDef {
  key: PipelineStage;
  label: string;
  description: string;
}

const PIPELINE_STEPS: StepDef[] = [
  { key: 'intent', label: 'INTENT', description: 'User state declared' },
  { key: 'escrow', label: 'ESCROW', description: 'Locked on EVM L1' },
  { key: 'auction', label: 'SOLVER AUCTION', description: 'Real-time bidding' },
  { key: 'winner', label: 'WINNER', description: 'Top scored solver' },
  { key: 'commitment', label: 'SOLVER COMMITMENT', description: 'Collateral bonded' },
  { key: 'execution', label: 'CROSS-CHAIN EXECUTION', description: 'Solana leg fulfilled' },
  { key: 'verification', label: 'VERIFICATION', description: 'Hybrid proof / window' },
  { key: 'settlement', label: 'SETTLEMENT', description: 'Final escrow released' },
];

const STAGE_ORDER: PipelineStage[] = [
  'intent',
  'escrow',
  'auction',
  'winner',
  'commitment',
  'execution',
  'verification',
  'settlement',
];

export const PipelineStatusTracker: React.FC<PipelineStatusTrackerProps> = ({
  stage,
  subStatusText,
  intentId,
  winningSolverName,
}) => {
  if (stage === 'idle') return null;

  const currentIdx = STAGE_ORDER.indexOf(stage);

  return (
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#A9A7FF] font-bold">
              Protocol Lifecycle
            </span>
            {winningSolverName && stage !== 'intent' && stage !== 'escrow' && stage !== 'auction' && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#20203A] text-[#D1FE5D] border border-[#D1FE5D]/30 font-mono font-bold">
                Winner: {winningSolverName}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-0.5">
            Intent → Settlement Live Pipeline
          </h3>
          <p className="text-xs text-[#A5A5B8] mt-1 font-sans">
            {subStatusText || 'Live protocol state transitions across EVM & Solana SVM'}
          </p>
        </div>

        {intentId && (
          <div className="px-3 py-1.5 rounded-lg bg-[#20203A] border border-white/10 text-xs font-mono text-[#A9A7FF] shrink-0 self-start sm:self-auto">
            ID: {intentId}
          </div>
        )}
      </div>

      {/* 8-Stage Pipeline Steps Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 relative">
        {PIPELINE_STEPS.map((step, idx) => {
          const isCompleted = currentIdx > idx || stage === 'settlement';
          const isActive = currentIdx === idx && stage !== 'settlement';
          const isUpcoming = currentIdx < idx && stage !== 'settlement';

          return (
            <div
              key={step.key}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 relative ${
                isCompleted
                  ? 'bg-[#151526] border-[#D1FE5D]/60 text-white'
                  : isActive
                  ? 'bg-[#20203A] border-[#1053D4] text-white shadow-lg shadow-[#1053D4]/20 ring-1 ring-[#1053D4]'
                  : 'bg-[#151526]/50 border-white/5 text-[#A5A5B8] opacity-60'
              }`}
            >
              {/* Top Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold opacity-60">
                  0{idx + 1}
                </span>

                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-[#D1FE5D]/20 border border-[#D1FE5D] flex items-center justify-center text-[#D1FE5D]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {isActive && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1053D4] animate-ping" />
                    <Loader2 className="w-4 h-4 text-[#A9A7FF] animate-spin" />
                  </div>
                )}

                {isUpcoming && (
                  <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                    <Circle className="w-2 h-2 text-white/20" />
                  </div>
                )}
              </div>

              {/* Step Label & Status */}
              <div>
                <h4
                  className={`text-[11px] font-mono font-bold uppercase tracking-tight ${
                    isCompleted
                      ? 'text-[#D1FE5D]'
                      : isActive
                      ? 'text-[#FFFFFF]'
                      : 'text-[#A5A5B8]'
                  }`}
                >
                  {step.label}
                </h4>

                <div className="mt-1">
                  {isCompleted && (
                    <span className="text-[9px] font-mono text-[#D1FE5D] font-bold">
                      ✓ Completed
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[9px] font-mono text-[#A9A7FF] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1053D4]" />
                      ACTIVE
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[9px] font-mono text-[#A5A5B8]">
                      ○ Upcoming
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settlement Finalized Hero Highlight */}
      {stage === 'settlement' && (
        <div className="bg-[#20203A] border-2 border-[#D1FE5D] rounded-xl p-4 text-center space-y-1 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-center gap-2 text-[#D1FE5D] font-mono text-xs uppercase font-bold tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D1FE5D]" />
            <span>Settlement Finalized on Solana SVM</span>
          </div>
          <p className="text-xs text-[#A5A5B8]">
            Funds delivered to recipient. Solver collateral returned with execution fee reward.
          </p>
        </div>
      )}
    </div>
  );
};
