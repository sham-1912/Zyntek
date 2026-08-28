import React, { useState } from 'react';
import type { PipelineStage, VerificationType, SettlementResult } from '../services/types';
import { CheckCircle2, Loader2, ShieldCheck, ShieldAlert, Lock, Cpu, ArrowRight, ExternalLink, Clock, FileText } from 'lucide-react';

interface PipelineStatusTrackerProps {
  stage: PipelineStage;
  verificationType: VerificationType;
  challengeCountdownSec: number;
  subStatusText: string;
  settlementResult?: SettlementResult;
  intentId?: string;
}

export const PipelineStatusTracker: React.FC<PipelineStatusTrackerProps> = ({
  stage,
  verificationType,
  challengeCountdownSec,
  subStatusText,
  settlementResult,
  intentId,
}) => {
  const [showReceiptsModal, setShowReceiptsModal] = useState<boolean>(false);

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

        {intentId && (
          <span className="text-[11px] font-mono text-indigo-400 px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800 shrink-0">
            ID: {intentId}
          </span>
        )}
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

      {/* Visible Challenge Window Countdown Timer */}
      {stage === 'verifying' && (
        <div className="bg-indigo-950/60 border border-indigo-800 p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            <div>
              <span className="font-bold block">Optimistic Challenge Window Active</span>
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
      )}

      {/* Settlement Result Box & Proof Receipts */}
      {settlementResult && (
        <div
          className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${
            settlementResult.success
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between font-bold text-sm">
            <span>{settlementResult.success ? '✓ Settlement Confirmed' : '⚠ Execution Failure & Bond Slashed'}</span>
            <button
              type="button"
              onClick={() => setShowReceiptsModal(!showReceiptsModal)}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-white flex items-center gap-1 font-sans"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Block Proofs ↗</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-current/20">
            <div>
              <span className="text-slate-400 block text-[10px]">Verification Path</span>
              <span className="font-bold">{settlementResult.verificationType.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Escrow Released</span>
              <span className="font-bold">${settlementResult.escrowReleasedUsd}</span>
            </div>
            {settlementResult.solverBondSlashedUsd && (
              <div>
                <span className="text-slate-400 block text-[10px]">Solver Bond Slashed</span>
                <span className="font-bold text-rose-400">${settlementResult.solverBondSlashedUsd}</span>
              </div>
            )}
            {settlementResult.userRefundedUsd && (
              <div>
                <span className="text-slate-400 block text-[10px]">User Escrow Refunded</span>
                <span className="font-bold text-emerald-400">${settlementResult.userRefundedUsd}</span>
              </div>
            )}
          </div>

          {/* Expanded Block Receipts List */}
          {showReceiptsModal && (
            <div className="mt-3 pt-3 border-t border-current/30 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-white">
                Cryptographic & On-Chain Proof Receipts:
              </span>
              {settlementResult.receipts.map((receipt, idx) => (
                <div key={idx} className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between items-center text-slate-300 font-bold">
                    <span>{receipt.stepName}</span>
                    <a
                      href={receipt.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>{receipt.txHash.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Block #{receipt.blockNumber} | Gas: {receipt.gasUsed} | Proof: {receipt.proofData}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
