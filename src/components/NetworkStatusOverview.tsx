import React from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Radio } from 'lucide-react';
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
    <div className="glass-card p-5 space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#8DC2FF] animate-pulse" />
          <h3 className="text-xs font-bold text-[#F3F6FF] uppercase font-mono tracking-wider">
            Network Status & Telemetry
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#CEF26D] bg-[rgba(14,30,56,0.65)] px-2.5 py-1 rounded-full border border-[#CEF26D]/30 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CEF26D] animate-ping" />
          ● Network Live
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
        {/* Solvers Mesh */}
        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#8DC2FF]" /> Solver Mesh
          </span>
          <span className="text-sm font-bold text-[#F3F6FF]">
            {activeSolversCount} / 5 Active
          </span>
          <span className="text-[9px] text-[#CEF26D] block">100% Quorum Ready</span>
        </div>

        {/* Protocol Latency */}
        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#E9B872]" /> SVM Latency
          </span>
          <span className="text-sm font-bold text-[#F3F6FF]">
            ~412 ms
          </span>
          <span className="text-[9px] text-[#8DC2FF]/80 block">Slot #2847192</span>
        </div>

        {/* Escrow TVL */}
        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#CEF26D]" /> Escrow TVL
          </span>
          <span className="text-sm font-bold text-[#CEF26D]">
            ${contractState.escrowLockedUsd.toLocaleString()} USDC
          </span>
          <span className="text-[9px] text-[#8DC2FF]/80 block">EVM EscrowVault.sol</span>
        </div>

        {/* Bond Capacity */}
        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#8DC2FF]" /> Bond Collateral
          </span>
          <span className="text-sm font-bold text-[#8DC2FF]">
            ${contractState.solverBondLockedUsd.toLocaleString()} USDC
          </span>
          <span className="text-[9px] text-[#8DC2FF]/80 block">SolverBonding.sol</span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="glass-sub-box p-2.5 flex items-center justify-between text-[10px] font-mono text-[#8DC2FF]/75">
        <span>Dual-Consensus SVM/EVM Bridge</span>
        <span className="text-[#CEF26D] font-bold">0 Disputes Active</span>
      </div>
    </div>
  );
};
