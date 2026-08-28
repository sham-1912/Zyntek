import React from 'react';
import type { SettlementResult } from '../services/types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface SettlementSummaryCardProps {
  result: SettlementResult;
}

export const SettlementSummaryCard: React.FC<SettlementSummaryCardProps> = ({ result }) => {
  const comparison = result.balanceComparison;

  if (!result.success) {
    return (
      <div className="bg-alert/15 border-2 border-alert rounded-2xl p-5 space-y-4 font-mono text-xs text-alert shadow-2xl shadow-alert/10">
        <div className="flex items-center justify-between font-bold text-sm border-b border-alert/30 pb-3">
          <span className="flex items-center gap-2 text-alert">
            <ShieldCheck className="w-5 h-5 text-alert animate-bounce" />
            <span>⚠ Verification Failure & Automated Refund Executed</span>
          </span>
          <span className="text-metadata">Tx: {result.txHash.slice(0, 10)}...</span>
        </div>

        <p className="text-slate-200 font-sans text-xs">
          The solver failed to confirm destination asset delivery within deadline. Per protocol rules, the solver&apos;s collateral bond was slashed and full escrow refunded.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-metadata text-slate-400 block">User Escrow Refunded</span>
            <span className="text-cost font-bold text-sm">${result.userRefundedUsd} USDC</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-metadata text-slate-400 block">Solver Collateral Slashed</span>
            <span className="text-alert font-bold text-sm">${result.solverBondSlashedUsd} USDC</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-metadata text-slate-400 block">Protocol Reserve</span>
            <span className="text-safety font-bold text-sm">${result.protocolReserveUsd || 25} USDC</span>
          </div>
        </div>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="glass-panel p-6 space-y-5 border-cost/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cost/20 border border-cost/40 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-cost" />
          </div>
          <div>
            <h3 className="text-section font-bold text-white font-mono">Stage 5 — Settlement Finalized</h3>
            <p className="text-metadata">Two-Sided Verified Outcome Ledger</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-metadata text-slate-400 block">Latency</span>
          <span className="text-speed font-bold text-xs">{(result.executionTimeMs / 1000).toFixed(2)}s Total</span>
        </div>
      </div>

      {/* Two-Sided Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* User Balance Outcome */}
        <div className="bg-slate-950/80 p-4 rounded-xl space-y-2 border border-cost/30">
          <div className="flex justify-between items-center text-cost font-bold border-b border-slate-800 pb-2">
            <span>USER BALANCES</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cost/20 text-cost">Recipient</span>
          </div>
          <div className="space-y-1 text-slate-300 text-metadata">
            <div className="flex justify-between">
              <span>Ethereum L1 Escrow:</span>
              <span className="text-alert font-bold">-${comparison.beforeSourceAmount} {comparison.beforeSourceAsset}</span>
            </div>
            <div className="flex justify-between">
              <span>Solana Wallet Received:</span>
              <span className="text-cost font-bold">+${comparison.afterDestinationAmount} {comparison.afterDestinationAsset}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-white">
              <span>Net Intent Delivered:</span>
              <span className="text-cost text-sm">${result.escrowReleasedUsd} USDC</span>
            </div>
          </div>
        </div>

        {/* Solver Balance Outcome */}
        <div className="bg-slate-950/80 p-4 rounded-xl space-y-2 border border-slate-800">
          <div className="flex justify-between items-center text-safety font-bold border-b border-slate-800 pb-2">
            <span>SOLVER BALANCES ({result.winningSolverId})</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-safety/20 text-safety">Fulfiller</span>
          </div>
          <div className="space-y-1 text-slate-300 text-metadata">
            <div className="flex justify-between">
              <span>EVM Escrow Released:</span>
              <span className="text-cost font-bold">+${result.escrowReleasedUsd} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Solana Outflow Delivered:</span>
              <span className="text-alert font-bold">-${comparison.afterDestinationAmount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Solver Fee Earned:</span>
              <span className="text-cost font-bold">+${comparison.solverFeeUsd} USDC</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-white">
              <span>Solver Net Profit:</span>
              <span className="text-cost text-sm">+${comparison.solverPayoutUsd} USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
