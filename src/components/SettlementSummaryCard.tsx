import React, { useState } from 'react';
import type { SettlementResult } from '../services/types';
import { ProofModal } from './ProofModal';
import { CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';

interface SettlementSummaryCardProps {
  result: SettlementResult;
  onResetToSwap?: () => void;
}

export const SettlementSummaryCard: React.FC<SettlementSummaryCardProps> = ({ result, onResetToSwap }) => {
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const comparison = result.balanceComparison;

  // Failure & Slashing State (Matching Image 8)
  if (!result.success) {
    const userRefund = result.userRefundedUsd ?? 1000;
    const bondSlashed = result.solverBondSlashedUsd ?? 50;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#922B21] font-sans">
            Intent Execution Failed — Solver Stake Slashed
          </h1>
          <p className="text-sm text-[#6B6659] font-sans">
            Solver failed to deliver destination asset within deadline. Automated slashing and full user refund executed.
          </p>
        </div>

        {/* Solver Stake Slashed Card (Matching Image 8) */}
        <div className="ix-card p-6 space-y-6 border-[#F5B7B1] bg-[#FDEDEC]/30">
          
          <div className="flex items-center justify-between border-b border-[#F5B7B1] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#922B21]" />
              <span className="font-bold text-sm text-[#922B21] font-sans">Solver Collateral Slashing Receipt</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#922B21] px-2.5 py-0.5 rounded bg-[#FDEDEC] border border-[#F5B7B1]">
              Status: SLASHED & REFUNDED
            </span>
          </div>

          <p className="text-xs text-[#5D6D7E] leading-relaxed font-sans">
            Per IntentX protocol rules, the solver&apos;s collateral bond was partially slashed to cover full user compensation, protocol treasury fee, and the decentralized insurance reserve.
          </p>

          {/* Partial Slashing Math & Protocol Fee Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="ix-card-subtle p-3 space-y-1 border-[#F5B7B1] bg-white">
              <span className="text-[10px] text-[#7A7568] uppercase block">Full User Refund</span>
              <span className="text-base font-bold text-[#1B5E20]">${userRefund.toFixed(2)} USDC</span>
            </div>

            <div className="ix-card-subtle p-3 space-y-1 border-[#F5B7B1] bg-white">
              <span className="text-[10px] text-[#7A7568] uppercase block">Total Bond Slashed</span>
              <span className="text-base font-bold text-[#922B21]">${bondSlashed.toFixed(2)} USDC</span>
            </div>

            <div className="ix-card-subtle p-3 space-y-1 border-[#F5B7B1] bg-white">
              <span className="text-[10px] text-[#7A7568] uppercase block">Protocol Treasury</span>
              <span className="text-base font-bold text-[#38352F]">${(result.protocolReserveUsd || 25).toFixed(2)} USDC</span>
            </div>

            <div className="ix-card-subtle p-3 space-y-1 border-[#F5B7B1] bg-white">
              <span className="text-[10px] text-[#7A7568] uppercase block">Insurance Pool</span>
              <span className="text-base font-bold text-[#8C6407]">${(result.protocolReserveUsd || 25).toFixed(2)} USDC</span>
            </div>
          </div>

          {/* Links Row */}
          <div className="pt-3 border-t border-[#F5B7B1] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowProofModal(true)}
              className="text-[#922B21] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Inspect Slashing Proof Payload</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {onResetToSwap && (
              <button
                type="button"
                onClick={onResetToSwap}
                className="ix-btn-gold px-4 py-2 text-xs"
              >
                Create New Intent
              </button>
            )}
          </div>

        </div>

        {showProofModal && (
          <ProofModal
            isOpen={showProofModal}
            onClose={() => setShowProofModal(false)}
            verificationType="zk_oracle"
            intentId="INT-8492"
            settlementResult={result}
          />
        )}

      </div>
    );
  }

  // Success Settlement View (Matching Image 6)
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Title (Matching Image 6) */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
          Intent Settlement Complete
        </h1>
        <p className="text-sm text-[#6B6659] font-sans">
          Cross-chain execution verified and settled on-chain.
        </p>
      </div>

      {/* Main Settlement Cards Grid (Matching Image 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Verification Status */}
        <div className="ix-card p-6 space-y-4">
          <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
            Verification Status
          </span>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF6ED] border border-[#A8E0B7] flex items-center justify-center text-[#1B5E20]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#1B5E20] font-mono">VERIFIED</div>
              <div className="text-xs font-mono text-[#7A7568]">100% Cryptographically Validated</div>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono border-t border-[#E8E4DA] pt-3 text-[#6B6659]">
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-bold text-[#1A1915]">Optimistic + ZK-Oracle Path</span>
            </div>
            <div className="flex justify-between">
              <span>Challenge Window:</span>
              <span className="font-bold text-[#1A1915]">Passed (No Disputes)</span>
            </div>
            <div className="flex justify-between">
              <span>Attestation Signer:</span>
              <span className="font-bold text-[#1A1915]">0xOracle...77A1</span>
            </div>
          </div>
        </div>

        {/* Card 2: Settlement Details / Payout Breakdown */}
        <div className="ix-card p-6 space-y-4">
          <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
            Settlement Details
          </span>

          <div className="space-y-2 text-xs font-mono text-[#6B6659]">
            <div className="flex justify-between">
              <span>User Escrow Released:</span>
              <span className="font-bold text-[#1A1915]">${(comparison?.beforeSourceAmount || 1000).toFixed(2)} USDC</span>
            </div>

            <div className="flex justify-between">
              <span>Solver Execution Fee:</span>
              <span className="font-bold text-[#1A1915]">$1.50 USDC</span>
            </div>

            <div className="flex justify-between">
              <span>Protocol Reserve Cut:</span>
              <span className="font-bold text-[#1A1915]">$0.25 USDC</span>
            </div>

            <div className="flex justify-between border-t border-[#E8E4DA] pt-2 font-bold text-sm text-[#1B5E20]">
              <span>Net User Outcome Delivered:</span>
              <span>${(comparison?.afterDestinationAmount || 998.25).toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

      </div>

      {/* Links & Ganache Verification Bar (Matching Image 6) */}
      <div className="ix-card p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="text-[#C69214] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Proof / Inspect Payload</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <a
            href={`#ganache-${result.txHash}`}
            className="text-[#7A7568] hover:text-[#1A1915] flex items-center gap-1"
          >
            <span>View in Explorer ({result.txHash.slice(0, 10)}...)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {onResetToSwap && (
          <button
            type="button"
            onClick={onResetToSwap}
            className="ix-btn-gold px-5 py-2 text-xs"
          >
            Create Next Intent
          </button>
        )}
      </div>

      {showProofModal && (
        <ProofModal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          verificationType="optimistic"
          intentId="INT-8492"
          settlementResult={result}
        />
      )}

    </div>
  );
};
