import React from 'react';
import type { UserIntent } from '../services/types';
import { Sparkles, ShieldAlert, Zap, ShieldCheck } from 'lucide-react';

interface JudgePresetsBarProps {
  onSelectPreset: (intentData: Partial<UserIntent>, autoSubmit?: boolean, forceFailure?: boolean) => void;
  isPipelineRunning: boolean;
}

export const JudgePresetsBar: React.FC<JudgePresetsBarProps> = ({ onSelectPreset, isPipelineRunning }) => {
  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-md shadow-2xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Hackathon Judge Demo Controls
            </h3>
            <p className="text-[11px] text-slate-400">
              Instant 1-click test scenarios to verify Optimistic, ZK-Oracle, and Bond Slashing mechanics
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
          1-Click Presets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Preset 1: Standard Optimistic Intent ($500) */}
        <button
          disabled={isPipelineRunning}
          onClick={() =>
            onSelectPreset(
              {
                sourceChain: 'ethereum',
                sourceAsset: 'USDC',
                sourceAmount: 500,
                destinationChain: 'solana',
                destinationAsset: 'USDC',
                minAcceptableOutput: 495,
                sliders: { cost: 50, speed: 30, safety: 20 },
              },
              false,
              false
            )
          }
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Standard Swap ($500)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Optimistic
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              15s challenge window verification
            </p>
          </div>
        </button>

        {/* Preset 2: High-Value ZK-Oracle Intent ($5,000) */}
        <button
          disabled={isPipelineRunning}
          onClick={() =>
            onSelectPreset(
              {
                sourceChain: 'ethereum',
                sourceAsset: 'USDC',
                sourceAmount: 5000,
                destinationChain: 'solana',
                destinationAsset: 'USDC',
                minAcceptableOutput: 4960,
                sliders: { cost: 20, speed: 20, safety: 60 },
              },
              false,
              false
            )
          }
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                High-Value Swap ($5,000)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                ZK-Oracle
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Triggers ZK cryptographic proof
            </p>
          </div>
        </button>

        {/* Preset 3: Simulate Solver Default ($1,000) */}
        <button
          disabled={isPipelineRunning}
          onClick={() =>
            onSelectPreset(
              {
                sourceChain: 'ethereum',
                sourceAsset: 'USDC',
                sourceAmount: 1000,
                destinationChain: 'solana',
                destinationAsset: 'USDC',
                minAcceptableOutput: 990,
                sliders: { cost: 30, speed: 30, safety: 40 },
              },
              false,
              true
            )
          }
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-rose-900/40 hover:border-rose-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                Simulate Solver Fault
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                Bond Slash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Tests collateral slash & user refund
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
