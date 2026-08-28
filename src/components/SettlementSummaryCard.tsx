import React from 'react';
import type { SettlementResult } from '../services/types';
import { CheckCircle2, Wallet, ShieldCheck } from 'lucide-react';

interface SettlementSummaryCardProps {
  result: SettlementResult;
}

export const SettlementSummaryCard: React.FC<SettlementSummaryCardProps> = ({ result }) => {
  const comparison = result.balanceComparison;

  if (!result.success) {
    return (
      <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-5 space-y-4 font-mono text-xs text-rose-200">
        <div className="flex items-center justify-between font-bold text-sm border-b border-rose-900/60 pb-3">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <span>⚠ Verification Failure & Automated Refund Executed</span>
          </span>
          <span className="text-[11px] text-slate-400">Tx: {result.txHash.slice(0, 10)}...</span>
        </div>

        <p className="text-slate-300 font-sans text-xs">
          The solver failed to confirm destination asset delivery within deadline. Per protocol rules, the solver&apos;s collateral bond was slashed and full escrow refunded.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">User Escrow Refunded</span>
            <span className="text-emerald-400 font-bold text-sm">${result.userRefundedUsd} USDC</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Solver Collateral Slashed</span>
            <span className="text-rose-400 font-bold text-sm">${result.solverBondSlashedUsd} USDC</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Protocol Insurance Reserve</span>
            <span className="text-indigo-400 font-bold text-sm">${result.protocolReserveUsd || 25} USDC</span>
          </div>
        </div>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="glass-panel p-6 space-y-5 border-emerald-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Stage 8 — Settlement Finalized</h3>
            <p className="text-[11px] text-slate-400">Two-Sided Verified Outcome Ledger</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 font-bold">
          Status: SETTLED (100% Verified)
        </span>
      </div>

      {/* Before / After User Asset Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before (Source Deposited) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">1. Escrow Deposited (Before)</span>
          <div className="text-lg font-bold text-indigo-400">
            ${comparison.beforeSourceAmount.toFixed(2)} {comparison.beforeSourceAsset}
          </div>
          <span className="text-[11px] text-slate-500 block">Chain: {comparison.beforeSourceChain}</span>
        </div>

        {/* After (Destination Received) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/80 space-y-1.5 font-mono text-xs">
          <span className="text-emerald-400 text-[10px] uppercase tracking-wider block font-bold">2. Outcome Delivered (After)</span>
          <div className="text-lg font-bold text-emerald-400">
            ${comparison.afterDestinationAmount.toFixed(2)} {comparison.afterDestinationAsset}
          </div>
          <span className="text-[11px] text-slate-400 block">Chain: {comparison.afterDestinationChain}</span>
        </div>
      </div>

      {/* Explicit Line-Item Arithmetic Payout Ledger */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
        <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold border-b border-slate-900 pb-1">
          Exact Protocol Payout Arithmetic Ledger ($500.00 Total Match)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Delivered Outcome</span>
            <span className="text-emerald-400 font-bold text-xs">${comparison.afterDestinationAmount.toFixed(2)} USDC</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Solver Execution Fee</span>
            <span className="text-cyan-400 font-bold text-xs">${comparison.solverFeeUsd.toFixed(2)} USDC</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Protocol Security & Routing Fee</span>
            <span className="text-indigo-400 font-bold text-xs">${comparison.protocolFeeUsd.toFixed(2)} USDC</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-sans pt-1 text-right">
          Sum: ${comparison.afterDestinationAmount.toFixed(2)} + ${comparison.solverFeeUsd.toFixed(2)} + ${comparison.protocolFeeUsd.toFixed(2)} = <strong className="text-white font-mono">${comparison.beforeSourceAmount.toFixed(2)} USDC</strong>
        </div>
      </div>

      {/* Two-Sided Protocol Fairness Summary */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            Solver Total Payout: <strong className="text-cyan-400">${comparison.solverPayoutUsd} USDC</strong> (${comparison.afterDestinationAmount} delivery + ${comparison.solverFeeUsd} fee)
          </span>
        </div>

        <span className="text-[11px] text-slate-400 font-sans">
          ✓ Released from Escrow automatically upon proof validation.
        </span>
      </div>
    </div>
  );
};
