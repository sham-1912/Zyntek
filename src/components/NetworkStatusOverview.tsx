import React from 'react';
import { ShieldCheck, Cpu, Zap, Radio, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';
import type { ContractSimulationState } from '../services/types';

interface NetworkStatusOverviewProps {
  contractState: ContractSimulationState;
  activeSolversCount?: number;
}

export const NetworkStatusOverview: React.FC<NetworkStatusOverviewProps> = ({
  contractState,
  activeSolversCount = 3,
}) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full shadow-md border border-[rgba(43,43,43,0.12)] space-y-4 bg-[#FFFDF5]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center shadow-xs">
            <Radio className="w-4 h-4 text-[#D4A017] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
              Network Status & Trust Model
            </h3>
            <span className="text-xs text-[#5A5A5A] font-sans">
              Decentralized Mesh & Chain Relayers
            </span>
          </div>
        </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#2B2B2B] bg-[#F7E7B5] px-2.5 py-1 rounded-full border border-[#D4A017]/30 font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
            <span>Network Live</span>
          </div>
      </div>

      {/* 2x2 Telemetry Grid: Compact inside, generous between */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
        {/* Solvers Mesh */}
        <div className="glass-sub-box p-2.5 space-y-1 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#D4A017]" /> Solver Mesh
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" />
          </div>
          <span className="text-base font-bold text-[#2B2B2B] block leading-tight">
            {activeSolversCount} / 3 Online
          </span>
          <span className="text-[10px] text-[#607A3A] font-bold block">
            100% Quorum Active
          </span>
        </div>

        {/* Protocol Latency */}
        <div className="glass-sub-box p-2.5 space-y-1 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#F0C94C]" /> SVM Latency
            </span>
            <span className="text-[9px] text-[#2B2B2B] bg-[#FFFDF5] px-1 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">
              RPC #1
            </span>
          </div>
          <span className="text-base font-bold text-[#2B2B2B] block leading-tight">
            ~412 ms
          </span>
          <span className="text-[10px] text-[#5A5A5A] block">
            Slot #2847192 Verified
          </span>
        </div>

        {/* Escrow TVL */}
        <div className="glass-sub-box p-2.5 space-y-1 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#D4A017]" /> Escrow TVL
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
          </div>
          <span className="text-base font-bold text-[#D4A017] block leading-tight">
            ${contractState.escrowLockedUsd.toLocaleString()} USDC
          </span>
          <span className="text-[10px] text-[#5A5A5A] block">
            EVM EscrowVault.sol
          </span>
        </div>

        {/* Bond Capacity */}
        <div className="glass-sub-box p-2.5 space-y-1 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div className="flex items-center justify-between text-[11px] text-[#2B2B2B] font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2B2B2B]" /> Bond Collateral
            </span>
            <span className="w-2 h-2 rounded-full bg-[#2B2B2B]" />
          </div>
          <span className="text-base font-bold text-[#2B2B2B] block leading-tight">
            ${contractState.solverBondLockedUsd.toLocaleString()} USDC
          </span>
          <span className="text-[10px] text-[#5A5A5A] block">
            SolverBonding.sol
          </span>
        </div>
      </div>

      {/* Trust-Minimized Model Strip (Directive 13) */}
      <div className="glass-sub-box p-3 space-y-2 font-mono text-xs bg-[#F7E7B5]/40 border border-[rgba(43,43,43,0.08)]">
        <div className="flex items-center justify-between text-[11px] border-b border-[rgba(43,43,43,0.08)] pb-1.5">
          <span className="text-[#2B2B2B] font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D4A017]" />
            Trust Model: Minimal Trust Required
          </span>
          <span className="text-[#607A3A] font-bold">Self-Enforcing</span>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#5A5A5A]">
          <div className="flex items-center gap-1 text-[#2B2B2B]">
            <CheckCircle2 className="w-3 h-3 text-[#607A3A] shrink-0" />
            <span>Escrow vault protected</span>
          </div>
          <div className="flex items-center gap-1 text-[#2B2B2B]">
            <CheckCircle2 className="w-3 h-3 text-[#607A3A] shrink-0" />
            <span>Solver collateral bond</span>
          </div>
          <div className="flex items-center gap-1 text-[#2B2B2B]">
            <CheckCircle2 className="w-3 h-3 text-[#607A3A] shrink-0" />
            <span>Independent verification</span>
          </div>
          <div className="flex items-center gap-1 text-[#2B2B2B]">
            <CheckCircle2 className="w-3 h-3 text-[#607A3A] shrink-0" />
            <span>Automatic refund/slashing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
