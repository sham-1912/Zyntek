import React, { useState } from 'react';
import type { PipelineStage, VerificationType, SettlementResult } from '../services/types';
import { ProofModal } from './ProofModal';
import { SettlementSummaryCard } from './SettlementSummaryCard';
import { CheckCircle2, Loader2, ShieldCheck, ShieldAlert, Lock, Cpu, ArrowRight, Clock, FileText, Info } from 'lucide-react';

interface PipelineStatusTrackerProps {
  stage: PipelineStage;
  verificationType: VerificationType;
  challengeCountdownSec: number;
  subStatusText: string;
  settlementResult?: SettlementResult;
  intentId?: string;
  solverBondUsd?: number;
  intentAmountUsd?: number;
}

export const PipelineStatusTracker: React.FC<PipelineStatusTrackerProps> = ({
  stage,
  verificationType,
  challengeCountdownSec,
  subStatusText,
  settlementResult,
  intentId,
  solverBondUsd,
  intentAmountUsd,
}) => {
  const [showProofModal, setShowProofModal] = useState<boolean>(false);

  if (stage === 'idle') return null;

  const steps = [
    { id: 'escrow', label: '1. EVM Escrow Locked', icon: Lock },
    { id: 'commit', label: '2. Solver Bond Committed', icon: Cpu },
    { id: 'execute', label: '3. Solana Leg Executed', icon: ArrowRight },
    { id: 'verify', label: `4. Hybrid Verify (${verificationType === 'zk_oracle' ? 'ZK/Oracle' : 'Optimistic'})`, icon: ShieldCheck },
    { id: 'settle', label: stage === 'slashed_refunded' ? '5. Bond Slashed & Refunded' : '5. Settlement Finalized', icon: CheckCircle2 },
  ];

  const getStepStatus = (index: number) => {
    switch (stage) {
      case 'escrow_mining':
      case 'escrow_locked':
        return index === 0 ? 'active' : index < 0 ? 'completed' : 'pending';
      case 'solver_committed':
        return index === 1 ? 'active' : index < 1 ? 'completed' : 'pending';
      case 'executing_cross_chain':
        return index === 2 ? 'active' : index < 2 ? 'completed' : 'pending';
      case 'verifying':
        return index === 3 ? 'active' : index < 3 ? 'completed' : 'pending';
      case 'settled':
        return 'completed';
      case 'slashed_refunded':
        return index === 4 ? 'failed' : 'completed';
      default:
        return 'pending';
    }
  };

  const collateralRatio = solverBondUsd && intentAmountUsd ? Math.round((solverBondUsd / intentAmountUsd) * 100) : 100;

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Cross-Chain Status Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{subStatusText || 'Live protocol state transitions across EVM & Solana'}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {solverBondUsd && (
            <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-slate-900 border border-cyan-800/80 font-bold">
              {collateralRatio}% Collateralized
            </span>
          )}
          {intentId && (
            <span className="text-[11px] font-mono text-indigo-400 px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800">
              ID: {intentId}
            </span>
          )}
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const status = getStepStatus(idx);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                status === 'completed'
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : status === 'active'
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 animate-pulse-glow shadow-lg shadow-indigo-900/50'
                  : status === 'failed'
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4" />
                {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {status === 'active' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                {status === 'failed' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold leading-tight">{step.label}</p>
                <span className="text-[10px] font-mono capitalize opacity-75">
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage 7 Hybrid Verification Challenge Countdown & Path Note */}
      {stage === 'verifying' && (
        <div className="bg-indigo-950/60 border border-indigo-800 p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <Clock className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              <div>
                <span className="font-bold block">
                  {verificationType === 'zk_oracle'
                    ? 'ZK/Oracle Attestation Verification Active'
                    : 'Optimistic Challenge Window Active'}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  In production, this window is typically 15–30 minutes. Compressed for demo.
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-amber-400">0:{challengeCountdownSec.toString().padStart(2, '0')}</span>
              <span className="block text-[10px] text-slate-500">Auto-settles if unchallenged</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-900/60 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-sans">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              {verificationType === 'zk_oracle'
                ? 'High-Value Intent Path ($1,000+): Stronger ZK/Oracle attestation required.'
                : 'Standard Intent Path (<$1,000): Fast optimistic verification window.'}
            </span>

            {settlementResult?.proofPayload && (
              <button
                type="button"
                onClick={() => setShowProofModal(true)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold font-mono"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Proof ↗</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage 8 Settlement Summary Card */}
      {settlementResult && (
        <>
          <SettlementSummaryCard result={settlementResult} />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowProofModal(true)}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-bold"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Inspect Cryptographic Proof Payload & Receipts ↗</span>
            </button>
          </div>
        </>
      )}

      {/* Proof Modal */}
      {settlementResult?.proofPayload && (
        <ProofModal
          isOpen={showProofModal}
          proofPayload={settlementResult.proofPayload}
          onClose={() => setShowProofModal(false)}
        />
      )}
    </div>
  );
};
