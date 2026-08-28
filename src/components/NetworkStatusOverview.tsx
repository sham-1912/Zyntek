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
    <div className="glass-card p-5 space-y-4 flex flex-col justify-between h-full shadow-md border border-[rgba(43,43,43,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#D4A017] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#2B2B2B] uppercase font-mono tracking-wider">
              Network Status & Telemetry
            </h3>
            <span className="text-[11px] text-[#5A5A5A] font-sans">
              Decentralized Mesh & Chain Relayers
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#2B2B2B] bg-[#F7E7B5] px-2.5 py-1 rounded-full border border-[#D4A017]/40 font-bold shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-ping" />
          ● Network Live
        </span>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs flex-1">
        {/* Solvers Mesh */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#D4A017]" /> Solver Mesh
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#2B2B2B] font-mono block">
              {activeSolversCount} / 5 Active
            </span>
            <span className="text-[10px] text-[#607A3A] font-bold block mt-0.5">
              100% Quorum Online
            </span>
          </div>
        </div>

        {/* Protocol Latency */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F0C94C]" /> SVM Latency
            </span>
            <span className="text-[9px] text-[#2B2B2B] bg-[#FFFDF5] px-1.5 py-0.5 rounded border border-[rgba(43,43,43,0.1)]">
              RPC #1
            </span>
          </div>
          <div>
            <span className="text-lg font-bold text-[#2B2B2B] font-mono block">
              ~412 ms
            </span>
            <span className="text-[10px] text-[#5A5A5A] block mt-0.5">
              Slot #2847192 Verified
            </span>
          </div>
        </div>

        {/* Escrow TVL */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#D4A017]" /> Escrow TVL
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#D4A017] font-mono block">
              ${contractState.escrowLockedUsd.toLocaleString()} USDC
            </span>
            <span className="text-[10px] text-[#5A5A5A] block mt-0.5">
              EVM EscrowVault.sol
            </span>
          </div>
        </div>

        {/* Bond Capacity */}
        <div className="glass-sub-box p-3.5 space-y-1.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2B2B2B]" /> Bond Collateral
            </span>
            <span className="w-2 h-2 rounded-full bg-[#2B2B2B]" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#2B2B2B] font-mono block">
              ${contractState.solverBondLockedUsd.toLocaleString()} USDC
            </span>
            <span className="text-[10px] text-[#5A5A5A] block mt-0.5">
              SolverBonding.sol
            </span>
          </div>
        </div>
      </div>

      {/* Relayer & Dispute Telemetry Strip */}
      <div className="glass-sub-box p-3 space-y-2 font-mono text-xs bg-[#F7E7B5]/40 border border-[rgba(43,43,43,0.08)]">
        <div className="flex items-center justify-between text-[11px] border-b border-[rgba(43,43,43,0.08)] pb-1.5">
          <span className="text-[#2B2B2B] flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-[#D4A017]" /> Dual-Consensus Bridge:
          </span>
          <span className="text-[#D4A017] font-bold">EVM ⇄ SVM Relayed</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#5A5A5A]">Active Dispute Monitors:</span>
          <span className="text-[#607A3A] font-bold">0 Disputes (100% Finalized)</span>
        </div>
      </div>
    </div>
  );
};
