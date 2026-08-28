import React from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Radio, CheckCircle2, RefreshCw } from 'lucide-react';
import type { ContractSimulationState } from '../services/types';

interface NetworkStatusOverviewProps {
  contractState: ContractSimulationState;
  activeSolversCount?: number;
}

export const NetworkStatusOverview: React.FC<NetworkStatusOverviewProps> = ({
  contractState,
  activeSolversCount = 5,
}) => {
  return (
    <div className="glass-card p-5 space-y-4 flex flex-col justify-between h-full shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(14,30,56,0.8)] border border-[#8DC2FF]/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#8DC2FF] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Network Status & Telemetry
            </h3>
            <span className="text-[11px] text-[#E2E8F0] font-sans">
              Decentralized Mesh & Chain Relayers
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#CEF26D] bg-[rgba(14,30,56,0.8)] px-2.5 py-1 rounded-full border border-[#CEF26D]/40 font-bold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CEF26D] animate-ping" />
          ● Network Live
        </span>
      </div>

      {/* 4 Metric Cards Grid - Structured to fill available vertical height */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs flex-1">
        {/* Solvers Mesh */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#8DC2FF] font-bold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8DC2FF]" /> Solver Mesh
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#CEF26D]" />
          </div>
          <div>
            <span className="text-lg font-bold text-white font-mono block">
              {activeSolversCount} / 5 Active
            </span>
            <span className="text-[10px] text-[#CEF26D] font-bold block mt-0.5">
              100% Quorum Online
            </span>
          </div>
        </div>

        {/* Protocol Latency */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#8DC2FF] font-bold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E9B872]" /> SVM Latency
            </span>
            <span className="text-[9px] text-[#8DC2FF] bg-[rgba(10,20,38,0.7)] px-1.5 py-0.5 rounded border border-[#8DC2FF]/20">
              RPC #1
            </span>
          </div>
          <div>
            <span className="text-lg font-bold text-white font-mono block">
              ~412 ms
            </span>
            <span className="text-[10px] text-[#CBD5E1] block mt-0.5">
              Slot #2847192 Verified
            </span>
          </div>
        </div>

        {/* Escrow TVL */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#8DC2FF] font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#CEF26D]" /> Escrow TVL
            </span>
            <span className="w-2 h-2 rounded-full bg-[#CEF26D]" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#CEF26D] font-mono block">
              ${contractState.escrowLockedUsd.toLocaleString()} USDC
            </span>
            <span className="text-[10px] text-[#CBD5E1] block mt-0.5">
              EVM EscrowVault.sol
            </span>
          </div>
        </div>

        {/* Bond Capacity */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#8DC2FF] font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8DC2FF]" /> Bond Collateral
            </span>
            <span className="w-2 h-2 rounded-full bg-[#8DC2FF]" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#8DC2FF] font-mono block">
              ${contractState.solverBondLockedUsd.toLocaleString()} USDC
            </span>
            <span className="text-[10px] text-[#CBD5E1] block mt-0.5">
              SolverBonding.sol
            </span>
          </div>
        </div>
      </div>

      {/* Relayer & Dispute Telemetry Strip */}
      <div className="glass-sub-box p-3 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1.5">
          <span className="text-[#E2E8F0] flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-[#8DC2FF]" /> Dual-Consensus Bridge:
          </span>
          <span className="text-[#CEF26D] font-bold">EVM ⇄ SVM Relayed</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#CBD5E1]">Active Dispute Monitors:</span>
          <span className="text-[#CEF26D] font-bold">0 Disputes (100% Finalized)</span>
        </div>
      </div>
    </div>
  );
};
