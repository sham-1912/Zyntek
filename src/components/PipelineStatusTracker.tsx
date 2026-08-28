import React, { useState } from 'react';
import type { PipelineStage, VerificationType, SettlementResult } from '../services/types';
import { ProofModal } from './ProofModal';
import { ExternalLink, Check } from 'lucide-react';

interface PipelineStatusTrackerProps {
  stage: PipelineStage;
  verificationType: VerificationType;
  challengeCountdownSec?: number;
  subStatusText?: string;
  settlementResult?: SettlementResult;
  intentId?: string;
  solverBondUsd?: number;
  intentAmountUsd?: number;
  solverName?: string;
}

export const PipelineStatusTracker: React.FC<PipelineStatusTrackerProps> = ({
  stage,
  verificationType,
  challengeCountdownSec = 15,
  intentId = 'INT-8492',
  intentAmountUsd = 1000,
  solverName = 'AlphaNode',
  settlementResult,
}) => {
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const formattedIntentId = intentId.startsWith('INT-') ? intentId : `#INT-${intentId.slice(-4).toUpperCase()}`;
  const isHighValue = intentAmountUsd >= 1000;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getStageIndex = () => {
    switch (stage) {
      case 'escrow_mining':
      case 'escrow_locked':
        return 0;
      case 'solver_committed':
      case 'bidding_window':
        return 1;
      case 'executing_cross_chain':
        return 2;
      case 'verifying':
        return 3;
      case 'settled':
      case 'slashed_refunded':
        return 4;
      default:
        return 2;
    }
  };

  const activeStepIdx = getStageIndex();

  const timelineSteps = [
    {
      title: 'Intent Locked',
      desc: 'User constraints securely recorded on origin chain.',
      txHash: '0x8f2a...9b41',
      gas: '65,420 gas',
    },
    {
      title: 'Solver Selected',
      desc: `Optimal execution path committed by ${solverName}.`,
      txHash: '0x3c7b...e4f1',
      gas: '84,210 gas',
    },
    {
      title: 'Cross-chain Transit',
      desc: 'Assets bridging via secure relay network. Awaiting confirmations.',
      sourceTx: '0x8f2a...9b41',
      estCompletion: '~45 seconds',
      gas: '42,100 gas',
    },
    {
      title: 'Destination Delivery',
      desc: 'Execution of final constraints on target chain.',
      gas: '120,500 gas',
    },
    {
      title: 'Settlement',
      desc: 'Final verification and solver compensation.',
      gas: '95,000 gas',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header (Matching Image 4: Intent Execution) */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
          Intent Execution
        </h1>
        <p className="text-sm text-[#6B6659] font-sans">
          Live tracking and technical telemetry for active intent <span className="font-mono text-[#1A1915] font-semibold">{formattedIntentId}</span>.
        </p>
      </div>

      {/* Main Execution Card (Matching Image 4) */}
      <div className="ix-card p-6 space-y-6">
        
        {/* Top State Banner & Elapsed Time */}
        <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
          <div>
            <span className="text-[10px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
              Current State
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C69214] animate-pulse" />
              <h2 className="text-lg font-bold text-[#1A1915] font-sans">
                {timelineSteps[activeStepIdx].title}
              </h2>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-[#7A7568] uppercase tracking-wider block">
              Elapsed Time
            </span>
            <span className="text-lg font-bold text-[#1A1915]">
              00:01:42
            </span>
          </div>
        </div>

        {/* Timeline Steps List (Matching Image 4) */}
        <div className="space-y-6 pl-2">
          {timelineSteps.map((step, idx) => {
            const isDone = idx < activeStepIdx || stage === 'settled';
            const isCurrent = idx === activeStepIdx && stage !== 'settled';
            const isFailed = stage === 'slashed_refunded' && idx === activeStepIdx;

            return (
              <div key={idx} className="relative flex items-start gap-4">
                
                {/* Connecting Vertical Line */}
                {idx < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 bottom-0 w-[2px] -mb-6 transition-colors duration-500 ${
                      isDone ? 'bg-[#C69214]' : 'bg-[#E8E4DA]'
                    }`}
                  />
                )}

                {/* Circle Icon Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    isFailed
                      ? 'bg-[#FDEDEC] border-2 border-[#922B21] text-[#922B21] animate-red-pulse-fail'
                      : isDone
                      ? 'bg-[#C69214] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-2 border-[#C69214] text-[#C69214] ring-4 ring-[#C69214]/15'
                      : 'bg-white border-2 border-[#E8E4DA] text-[#C5BEB0]'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                      <path
                        className="animate-stroke-draw"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  )}
                </div>

                {/* Content Details */}
                <div className="space-y-2 pt-0.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={`text-base font-bold font-sans transition-colors duration-200 ${
                      isFailed ? 'text-[#922B21]' : isCurrent || isDone ? 'text-[#1A1915]' : 'text-[#7A7568]'
                    }`}>
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#7A7568]">
                      {step.gas}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6659] leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Active Step Highlight Box (Source Tx & Est Completion & Animated Transit Path Dot) */}
                  {isCurrent && idx === 2 && (
                    <div className="ix-card-subtle p-3 mt-2 space-y-2 font-mono text-xs max-w-lg border-[#D8D2C4] relative overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-[#7A7568] uppercase block">Source Tx</span>
                          <a
                            href={`#tx-${step.sourceTx}`}
                            className="font-bold text-[#1A1915] hover:text-[#C69214] flex items-center gap-1"
                          >
                            <span>{step.sourceTx}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#7A7568] uppercase block">Est. Completion</span>
                          <span className="font-bold text-[#1A1915]">{step.estCompletion}</span>
                        </div>
                      </div>

                      {/* Animated Transit Path Line */}
                      <div className="relative w-full h-1 bg-[#E8E4DA] rounded-full overflow-hidden">
                        <div className="w-3 h-3 rounded-full bg-[#C69214] animate-transit-dot" />
                      </div>
                    </div>
                  )}

                  {/* Indeterminate Shimmer Progress Bar during ZK Verification */}
                  {isCurrent && idx === 3 && (verificationType === 'zk_oracle' || isHighValue) && (
                    <div className="w-full h-2 rounded-full overflow-hidden animate-shimmer-indeterminate mt-2 border border-[#E5D19E]" />
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Hybrid Verification Tiering Label */}
        <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#7A7568]">VERIFICATION TIER:</span>
            <span className="px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#E5D19E] text-[#8C6407] font-bold uppercase transition-all duration-300">
              {verificationType === 'zk_oracle' || isHighValue
                ? 'ZK-Oracle Path (High-Value Tier ≥ $1,000)'
                : `Optimistic Path (Challenge Window: 00:${challengeCountdownSec < 10 ? '0' : ''}${challengeCountdownSec})`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="text-[#C69214] hover:underline font-semibold flex items-center gap-1 ix-btn-active"
          >
            <span>View Proof / Inspect Payload</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Cards Row Below (Matching Image 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Target Solver */}
        <div className="ix-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-[#7A7568] uppercase tracking-wider block">
            @ Target Solver
          </span>
          <div className="text-base font-bold text-[#1A1915] font-sans">{solverName}</div>
          <div className="text-xs font-mono text-[#7A7568]">Reputation: High (98.4%)</div>
        </div>

        {/* Card 2: Confidence Score */}
        <div className="ix-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-[#7A7568] uppercase tracking-wider block">
            @ Confidence Score
          </span>
          <div className="text-2xl font-extrabold text-[#C69214] font-mono">99.9%</div>
          <div className="text-xs font-mono text-[#7A7568]">Based on path liquidity</div>
        </div>

        {/* Card 3: Intent Hash */}
        <div className="ix-card p-4 space-y-1">
          <span className="text-[10px] font-mono text-[#7A7568] uppercase tracking-wider block">
            &lt;&gt; Intent Hash
          </span>
          <div className="text-xs font-mono font-bold text-[#1A1915] truncate">
            0x9d4a8f...32b1e4
          </div>
          <button
            type="button"
            onClick={() => handleCopyHash('0x9d4a8f32b1e477a10985c2e4f1')}
            className="text-[11px] font-mono text-[#C69214] hover:underline flex items-center gap-1"
          >
            {copiedHash ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <span>Copy to clipboard</span>
            )}
          </button>
        </div>

      </div>

      {/* Verification Proof Payload Modal */}
      {showProofModal && (
        <ProofModal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          verificationType={verificationType}
          intentId={intentId}
          settlementResult={settlementResult}
        />
      )}

    </div>
  );
};
