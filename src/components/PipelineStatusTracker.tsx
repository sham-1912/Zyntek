import React, { useState } from 'react';
import type { PipelineStage, VerificationType, SettlementResult } from '../services/types';
import { ProofModal } from './ProofModal';
import { SettlementSummaryCard } from './SettlementSummaryCard';
import { CheckCircle2, Loader2, ShieldCheck, ShieldAlert, Lock, Cpu, ArrowRight, Clock, FileText, Info, Award } from 'lucide-react';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-section font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Cross-Chain Protocol Pipeline</span>
          </h3>
          <p className="text-body text-slate-400 mt-0.5">{subStatusText || 'Live protocol state transitions across EVM & Solana'}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {solverBondUsd && (
            <span className="text-metadata text-safety px-2.5 py-1 rounded bg-slate-900 border border-safety/40 font-bold">
              {collateralRatio}% Collateralized
            </span>
          )}
          {intentId && (
            <span className="text-metadata text-indigo-300 px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800">
              ID: {intentId}
            </span>
          )}
        </div>
      </div>

      {/* Requirement 4: Hero Treatment for Stage Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const status = getStepStatus(idx);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all ${
                status === 'completed'
                  ? 'bg-emerald-950/40 border-cost text-cost shadow-md shadow-cost/10'
                  : status === 'active'
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 animate-pulse-glow shadow-lg shadow-indigo-900/50'
                  : status === 'failed'
                  ? 'bg-alert/15 border-alert text-alert'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  status === 'completed'
                    ? 'bg-cost/20 border border-cost/40'
                    : status === 'active'
                    ? 'bg-indigo-500/20 border border-indigo-500/40'
                    : status === 'failed'
                    ? 'bg-alert/20 border border-alert/40'
                    : 'bg-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-cost" />}
                {status === 'active' && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
                {status === 'failed' && <ShieldAlert className="w-5 h-5 text-alert" />}
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold leading-tight">{step.label}</p>
                <span className="text-metadata font-mono capitalize mt-1 block">
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requirement 4: Standalone Hero Settlement Amount Readout */}
      {settlementResult && (
        <div className="bg-slate-950/90 border-2 border-cost rounded-2xl p-6 text-center space-y-2 shadow-2xl shadow-cost/10 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-center gap-2 text-cost font-mono text-xs uppercase font-bold tracking-widest">
            <Award className="w-4 h-4 text-cost" />
            <span>Final Settlement Outcome Delivered</span>
          </div>
          <div className="text-hero text-cost font-mono tracking-tight">
            ${settlementResult.escrowReleasedUsd} USDC
          </div>
          <p className="text-body text-slate-300 font-sans">
            Delivered directly to destination wallet on Solana (TX: {settlementResult.proofPayload?.solanaTxSignature.slice(0, 10) || settlementResult.txHash.slice(0, 10)}...)
          </p>
        </div>
      )}

      {/* Stage Execution Details */}
      {stage === 'executing_cross_chain' && (
        <div className="bg-slate-900/90 border border-cyan-500/50 p-4 rounded-xl space-y-2 font-mono text-xs text-cyan-200">
          <span className="font-bold text-white uppercase text-[10px] tracking-wider block border-b border-cyan-900/60 pb-1">
            Solana Destination Leg Execution Substeps:
          </span>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2 text-cost font-bold">
              <span>✓ 3a. Solver broadcasting transaction on Solana network</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <Loader2 className="w-3 h-3 animate-spin shrink-0 text-amber-400" />
              <span>3b. Awaiting block finality confirmation (Slot #2847192)...</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>⏳ 3c. Finalizing cross-chain delivery attestation proof</span>
            </div>
          </div>
        </div>
      )}

      {/* Verification Challenge Note */}
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
                <span className="text-metadata text-slate-400 font-sans">
                  In production, this window is typically 15–30 minutes. Compressed for demo.
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-hero-sm font-bold text-amber-400 font-mono">0:{challengeCountdownSec.toString().padStart(2, '0')}</span>
              <span className="block text-metadata">Auto-settles if unchallenged</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-900/60 text-metadata">
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

      {/* Settlement Details */}
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
