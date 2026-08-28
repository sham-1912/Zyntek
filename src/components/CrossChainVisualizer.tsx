import React from 'react';
import type { UserIntent, SolverBid, PipelineStage } from '../services/types';
import { Layers, RefreshCw } from 'lucide-react';

interface CrossChainVisualizerProps {
  intent?: UserIntent | null;
  selectedBid?: SolverBid | null;
  stage: PipelineStage;
}

export const CrossChainVisualizer: React.FC<CrossChainVisualizerProps> = ({ intent, selectedBid, stage }) => {
  const isExecuting = stage !== 'idle' && stage !== 'settled' && stage !== 'slashed_refunded';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Live Cross-Chain Architecture Visualizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            EVM → SVM CPI
          </span>
          {isExecuting && (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live Pipeline
            </span>
          )}
        </div>
      </div>

      {/* 3-Node Cross-Chain Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Stage 1: Ethereum EVM Escrow */}
        <div className="bg-slate-950/80 border border-indigo-900/50 rounded-xl p-4 space-y-2 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
              Source Chain (EVM)
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Ethereum L1
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">IntentEscrow.sol</h4>
            <p className="text-[11px] font-mono text-slate-400">0x71C8...4A92</p>
          </div>
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Locked Deposit:</span>
            <span className="text-emerald-400 font-bold">
              ${intent ? intent.sourceAmount : 500} USDC
            </span>
          </div>
        </div>

        {/* Stage 2: Off-Chain Solver Competition Mesh */}
        <div className="bg-slate-950/80 border border-amber-900/50 rounded-xl p-4 space-y-2 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Auction & Relayer Mesh
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
              3 Solvers Active
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              {selectedBid ? selectedBid.solverName : 'Scoring Engine'}
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              {selectedBid ? `Bond: $${selectedBid.collateralOfferedUsd} USDC` : 'Bidding in Progress...'}
            </p>
          </div>
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Verification:</span>
            <span className="text-cyan-400 font-bold">
              {intent && intent.sourceAmount >= 1000 ? 'ZK-Oracle Proof' : 'Optimistic 15s'}
            </span>
          </div>
        </div>

        {/* Stage 3: Solana SVM Destination CPI */}
        <div className="bg-slate-950/80 border border-cyan-900/50 rounded-xl p-4 space-y-2 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Destination Chain (SVM)
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Solana Mainnet
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">ZyntekSolanaCPI</h4>
            <p className="text-[11px] font-mono text-slate-400">ZynT1111...1111</p>
          </div>
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Output Delivered:</span>
            <span className="text-cyan-300 font-bold">
              {selectedBid ? `$${selectedBid.proposedOutput} USDC` : '$496.00 USDC'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
