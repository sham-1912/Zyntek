import React, { useState } from 'react';
import type { IntentHistoryItem } from '../services/types';
import {
  Award,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  X,
  PlusCircle,
  Radio,
} from 'lucide-react';

interface SolverDashboardProps {
  history: IntentHistoryItem[];
}

interface SolverDetail {
  id: 'solver_a' | 'solver_b' | 'solver_c';
  name: string;
  strategy: string;
  tagline: string;
  reputation: number;
  successRate: number;
  totalCapital: number;
  availableCapital: number;
  activeIntents: number;
  completedIntents: number;
  failedIntents: number;
  avgExecutionSec: number;
  avgSlippagePct: number;
  avgOutputPct: number;
  collateralBond: number;
  riskStatus: 'normal' | 'anomaly';
  riskMessage: string;
  address: string;
}

const SOLVERS_DATA: SolverDetail[] = [
  {
    id: 'solver_b',
    name: 'SOLVER B — Balanced Executor',
    strategy: 'Balanced Executor',
    tagline: 'Balances cost, speed and execution reliability',
    reputation: 94,
    successRate: 98.7,
    totalCapital: 42500,
    availableCapital: 31200,
    activeIntents: 3,
    completedIntents: 128,
    failedIntents: 2,
    avgExecutionSec: 42.8,
    avgSlippagePct: 0.21,
    avgOutputPct: 99.64,
    collateralBond: 500,
    riskStatus: 'normal',
    riskMessage: 'No anomalies detected across 128 intents',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  },
  {
    id: 'solver_a',
    name: 'SOLVER A — Cost Optimizer',
    strategy: 'Cost Optimizer',
    tagline: 'Prioritizes low fees and maximum output',
    reputation: 87,
    successRate: 95.8,
    totalCapital: 35000,
    availableCapital: 24500,
    activeIntents: 1,
    completedIntents: 94,
    failedIntents: 4,
    avgExecutionSec: 52.1,
    avgSlippagePct: 0.18,
    avgOutputPct: 99.82,
    collateralBond: 500,
    riskStatus: 'normal',
    riskMessage: 'Normal competitive bidding behavior',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    id: 'solver_c',
    name: 'SOLVER C — Speed Specialist',
    strategy: 'Speed Specialist',
    tagline: 'Prioritizes rapid execution at a higher fee',
    reputation: 91,
    successRate: 97.2,
    totalCapital: 47300,
    availableCapital: 38100,
    activeIntents: 2,
    completedIntents: 112,
    failedIntents: 3,
    avgExecutionSec: 28.4,
    avgSlippagePct: 0.32,
    avgOutputPct: 99.45,
    collateralBond: 500,
    riskStatus: 'anomaly',
    riskMessage: '2 unusually similar bids — Review recommended',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  },
];

export const SolverDashboard: React.FC<SolverDashboardProps> = () => {
  const [selectedProfile, setSelectedProfile] = useState<SolverDetail | null>(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-[#2B2B2B]">
      
      {/* =========================================================================
          1. SOLVER NETWORK OVERVIEW — TOP BANNER
         ========================================================================= */}
      <div className="glass-card p-6 sm:p-8 space-y-5 border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(43,43,43,0.08)] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
              <Cpu className="w-6 h-6 text-[#D4A017]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2B2B2B] font-headline uppercase tracking-tight">
                  SOLVER NETWORK
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7E7B5] text-[#2B2B2B] font-mono font-bold border border-[#D4A017]/40 shadow-xs">
                  Permissionless Marketplace
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-0.5">
                Decentralized solver agents competing dynamically across output, fees, speed and collateral bonds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#2B2B2B] bg-[#F7E7B5] px-3 py-1.5 rounded-xl border border-[#D4A017]/30 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
              ● 3 / 3 Solvers Online
            </span>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer uppercase tracking-wider"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Solver</span>
            </button>
          </div>
        </div>

        {/* 4 Hero Network Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] block uppercase font-bold">Active Solvers</span>
            <span className="text-2xl font-bold text-[#2B2B2B] leading-tight mt-0.5 block">3 / 3</span>
            <span className="text-[10px] text-[#607A3A] font-bold">100% Quorum</span>
          </div>

          <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] block uppercase font-bold">Total Liquidity</span>
            <span className="text-2xl font-bold text-[#D4A017] leading-tight mt-0.5 block">$124.8K</span>
            <span className="text-[10px] text-[#5A5A5A]">EVM + SVM Pools</span>
          </div>

          <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] block uppercase font-bold">Network Success</span>
            <span className="text-2xl font-bold text-[#607A3A] leading-tight mt-0.5 block">98.2%</span>
            <span className="text-[10px] text-[#5A5A5A]">334 Fulfilled</span>
          </div>

          <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[10px] text-[#5A5A5A] block uppercase font-bold">Avg Execution</span>
            <span className="text-2xl font-bold text-[#2B2B2B] leading-tight mt-0.5 block">42.8s</span>
            <span className="text-[10px] text-[#5A5A5A]">Cross-Chain Settlement</span>
          </div>
        </div>

        {/* Network Status Sub-Bar */}
        <div className="bg-[#FFFDF5] p-3 rounded-xl border border-[rgba(43,43,43,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5A5A5A] shadow-xs">
          <div className="flex items-center gap-4">
            <span>Capital Available: <strong className="text-[#2B2B2B]">$124,800 USDC</strong></span>
            <span>Active Intents: <strong className="text-[#D4A017]">04</strong></span>
            <span>Pending Executions: <strong className="text-[#2B2B2B]">02</strong></span>
          </div>
          <span className="text-[10px] text-[#607A3A] font-bold">✓ Dual-Consensus Bridge Relayers Synced</span>
        </div>
      </div>

      {/* =========================================================================
          2. ROW 1: INDIVIDUAL SOLVER CARDS (7 COLS) + CAPITAL & LIQUIDITY MAP (5 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: 3 Individual Solver Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
              Competing Solver Agents
            </h2>
            <span className="text-xs text-[#5A5A5A] font-mono">3 Specialized Strategies</span>
          </div>

          <div className="space-y-3">
            {SOLVERS_DATA.map((solver) => (
              <div
                key={solver.id}
                className="glass-card p-5 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] hover:border-[#D4A017] transition-all space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(43,43,43,0.08)] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#607A3A]" />
                    <div>
                      <h3 className="text-sm font-bold text-[#2B2B2B] font-mono">{solver.name}</h3>
                      <p className="text-xs text-[#5A5A5A] font-sans">{solver.tagline}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#D4A017] bg-[#F7E7B5] px-2.5 py-1 rounded-lg border border-[#D4A017]/30 self-start sm:self-auto">
                    {solver.reputation} REP
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  <div className="bg-[#F7E7B5]/50 p-2 rounded-lg border border-[rgba(43,43,43,0.06)]">
                    <span className="text-[10px] text-[#5A5A5A] block">Success Rate</span>
                    <span className="text-sm font-bold text-[#607A3A]">{solver.successRate}%</span>
                  </div>

                  <div className="bg-[#F7E7B5]/50 p-2 rounded-lg border border-[rgba(43,43,43,0.06)]">
                    <span className="text-[10px] text-[#5A5A5A] block">Capital</span>
                    <span className="text-sm font-bold text-[#2B2B2B]">${(solver.totalCapital / 1000).toFixed(1)}K</span>
                  </div>

                  <div className="bg-[#F7E7B5]/50 p-2 rounded-lg border border-[rgba(43,43,43,0.06)]">
                    <span className="text-[10px] text-[#5A5A5A] block">Avg Execution</span>
                    <span className="text-sm font-bold text-[#2B2B2B]">{solver.avgExecutionSec}s</span>
                  </div>

                  <div className="bg-[#F7E7B5]/50 p-2 rounded-lg border border-[rgba(43,43,43,0.06)]">
                    <span className="text-[10px] text-[#5A5A5A] block">Avg Slippage</span>
                    <span className="text-sm font-bold text-[#2B2B2B]">{solver.avgSlippagePct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono border-t border-[rgba(43,43,43,0.08)] pt-2.5">
                  <span className="text-[#5A5A5A]">Intents: {solver.completedIntents} fulfilled · {solver.failedIntents} slashed</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProfile(solver)}
                    className="px-3 py-1.5 rounded-lg bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-bold transition-all shadow-xs cursor-pointer uppercase"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Capital & Liquidity Map (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
              Capital & Liquidity Map
            </h2>
            <span className="text-xs text-[#5A5A5A] font-mono">Cross-Chain Distribution</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-5 flex-1 flex flex-col justify-between shadow-xs">
            {/* Capital Distribution */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider block border-b border-[rgba(43,43,43,0.08)] pb-1.5 font-headline">
                Chain Capital Allocation
              </span>

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Ethereum (EVM Escrows):</span>
                    <span className="font-bold text-[#2B2B2B]">$78.4K (62.8%)</span>
                  </div>
                  <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#D4A017] h-full rounded-full" style={{ width: '62.8%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Solana (SVM Liquidity):</span>
                    <span className="font-bold text-[#2B2B2B]">$46.4K (37.2%)</span>
                  </div>
                  <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#F0C94C] h-full rounded-full" style={{ width: '37.2%' }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <span className="font-bold text-[#2B2B2B]">Total Committed Capital:</span>
                <span className="font-bold text-[#D4A017] text-sm">$124,800 USDC</span>
              </div>
            </div>

            {/* Asset Breakdown */}
            <div className="space-y-2.5 font-mono text-xs border-t border-[rgba(43,43,43,0.08)] pt-4">
              <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider block font-headline">
                Asset Liquidity Availability
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F7E7B5]/60 p-2.5 rounded-xl border border-[rgba(43,43,43,0.08)]">
                  <span className="text-[10px] text-[#5A5A5A] block">USDC Vaults</span>
                  <span className="text-sm font-bold text-[#2B2B2B]">$82.4K</span>
                </div>
                <div className="bg-[#F7E7B5]/60 p-2.5 rounded-xl border border-[rgba(43,43,43,0.08)]">
                  <span className="text-[10px] text-[#5A5A5A] block">ETH Reserves</span>
                  <span className="text-sm font-bold text-[#2B2B2B]">$21.6K</span>
                </div>
                <div className="bg-[#F7E7B5]/60 p-2.5 rounded-xl border border-[rgba(43,43,43,0.08)]">
                  <span className="text-[10px] text-[#5A5A5A] block">SOL Reserves</span>
                  <span className="text-sm font-bold text-[#2B2B2B]">$12.8K</span>
                </div>
                <div className="bg-[#F7E7B5]/60 p-2.5 rounded-xl border border-[rgba(43,43,43,0.08)]">
                  <span className="text-[10px] text-[#5A5A5A] block">Other Assets</span>
                  <span className="text-sm font-bold text-[#2B2B2B]">$8.0K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ROW 2: SOLVER PERFORMANCE & REPUTATION (6 COLS) + ACCOUNTABILITY (6 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Explainable Reputation Card */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#D4A017]" />
              <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                Explainable Reputation Model
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#D4A017] bg-[#F7E7B5] px-2.5 py-1 rounded-lg border border-[#D4A017]/30">
              94 / 100 Overall
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-2.5 rounded-xl">
              <span>Execution Success Rate:</span>
              <span className="font-bold text-[#607A3A]">98.7% (126 / 128)</span>
            </div>
            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-2.5 rounded-xl">
              <span>Verification History:</span>
              <span className="font-bold text-[#607A3A]">99.2% Valid Groth16</span>
            </div>
            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-2.5 rounded-xl">
              <span>Deadline Reliability:</span>
              <span className="font-bold text-[#2B2B2B]">97.4% on-time</span>
            </div>
            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-2.5 rounded-xl">
              <span>Dispute & Slashing Record:</span>
              <span className="font-bold text-[#607A3A]">Clean (0 active disputes)</span>
            </div>
          </div>

          {/* 30-day Interactive SVG Reputation Graph */}
          <div className="bg-[#2B2B2B] text-[#FFFDF5] p-4 rounded-xl font-mono text-xs space-y-2.5 shadow-inner border border-black/20">
            <div className="flex items-center justify-between">
              <span className="text-[#F0C94C] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-pulse" />
                30-Day Historical Reputation Graph
              </span>
              <span className="text-[11px] text-[#CEF26D] font-bold bg-white/10 px-2 py-0.5 rounded">
                Current: 94.0 pts (+4.0)
              </span>
            </div>

            {/* Real SVG Chart */}
            <div className="relative w-full h-36 pt-2">
              <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A017" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#D4A017" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="30" y1="20" x2="390" y2="20" stroke="#444" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="30" y1="50" x2="390" y2="50" stroke="#444" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="30" y1="80" x2="390" y2="80" stroke="#444" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="30" y1="110" x2="390" y2="110" stroke="#555" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="24" y="23" textAnchor="end" fill="#888" fontSize="8" fontFamily="monospace">100</text>
                <text x="24" y="53" textAnchor="end" fill="#888" fontSize="8" fontFamily="monospace">95</text>
                <text x="24" y="83" textAnchor="end" fill="#888" fontSize="8" fontFamily="monospace">90</text>
                <text x="24" y="113" textAnchor="end" fill="#888" fontSize="8" fontFamily="monospace">85</text>

                {/* Gradient Area Fill */}
                <polygon
                  points="30,80 80,80 140,50 200,50 260,25 320,38 385,38 385,110 30,110"
                  fill="url(#repGradient)"
                />

                {/* Curved Trend Line */}
                <polyline
                  points="30,80 80,80 140,50 200,50 260,25 320,38 385,38"
                  fill="none"
                  stroke="#F0C94C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Data Points */}
                <circle cx="30" cy="80" r="3" fill="#FFFDF5" stroke="#D4A017" strokeWidth="1.5" />
                <circle cx="80" cy="80" r="3" fill="#FFFDF5" stroke="#D4A017" strokeWidth="1.5" />
                <circle cx="140" cy="50" r="3" fill="#FFFDF5" stroke="#D4A017" strokeWidth="1.5" />
                <circle cx="200" cy="50" r="3" fill="#FFFDF5" stroke="#D4A017" strokeWidth="1.5" />
                <circle cx="260" cy="25" r="3.5" fill="#CEF26D" stroke="#2B2B2B" strokeWidth="1.5" />
                <circle cx="320" cy="38" r="3" fill="#FFFDF5" stroke="#D4A017" strokeWidth="1.5" />
                <circle cx="385" cy="38" r="4.5" fill="#F0C94C" stroke="#FFFDF5" strokeWidth="2" />

                {/* Floating Tooltip at Peak */}
                <rect x="235" y="6" width="50" height="14" rx="3" fill="#CEF26D" />
                <text x="260" y="16" textAnchor="middle" fill="#2B2B2B" fontSize="8" fontWeight="bold" fontFamily="monospace">98.0 Peak</text>

                {/* Current Value Marker */}
                <rect x="355" y="20" width="38" height="14" rx="3" fill="#D4A017" />
                <text x="374" y="30" textAnchor="middle" fill="#2B2B2B" fontSize="8" fontWeight="bold" fontFamily="monospace">94.0</text>
              </svg>
            </div>

            {/* X-Axis Timeline */}
            <div className="flex justify-between text-[10px] text-[#888] font-mono px-6 pt-1 border-t border-white/10">
              <span>30d ago (90.0)</span>
              <span>21d</span>
              <span>14d</span>
              <span>7d (98.0)</span>
              <span className="text-[#F0C94C] font-bold">Today (94.0)</span>
            </div>
          </div>
        </div>

        {/* Accountability & Economic Security Panel */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
              <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                Solver Accountability & Collateral
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#607A3A] bg-[#607A3A]/15 px-2.5 py-1 rounded-lg">
              Full Bond Enforced
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
              <span className="text-[10px] text-[#5A5A5A] block">Required Bond</span>
              <span className="text-base font-bold text-[#2B2B2B] mt-0.5 block">$500 USDC</span>
            </div>
            <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
              <span className="text-[10px] text-[#5A5A5A] block">Posted Bond</span>
              <span className="text-base font-bold text-[#607A3A] mt-0.5 block">$500 ✓</span>
            </div>
            <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
              <span className="text-[10px] text-[#5A5A5A] block">Capital At Risk</span>
              <span className="text-base font-bold text-[#D4A017] mt-0.5 block">$500 USDC</span>
            </div>
          </div>

          {/* Slashing Rules */}
          <div className="bg-[#F7E7B5]/40 p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] space-y-1.5 font-mono text-xs">
            <span className="text-[11px] font-bold text-[#2B2B2B] uppercase block">
              Self-Enforcing Failure Protocols:
            </span>
            <div className="text-[#5A5A5A] text-[11px] space-y-1">
              <div>→ <strong>Timeout / Failure:</strong> Full $500 bond slashed instantly</div>
              <div>→ <strong>User Escrow:</strong> 100% refunded with zero capital loss</div>
              <div>→ <strong>Reputation:</strong> -25 points deduction & mesh flag</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. ROW 3: RISK MONITOR (6 COLS) + LIVE SOLVER ACTIVITY (6 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Risk Monitor Card */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#D4A017]" />
              <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                Solver Risk Monitor & Collusion Watch
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#2B2B2B] bg-[#F7E7B5] px-2.5 py-1 rounded-lg border border-[#D4A017]/30">
              Audit Guard
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-3 rounded-xl">
              <span>SOLVER A:</span>
              <span className="text-[#607A3A] font-bold">✓ Normal bidding behavior</span>
            </div>

            <div className="flex justify-between items-center bg-[#F7E7B5]/50 p-3 rounded-xl">
              <span>SOLVER B:</span>
              <span className="text-[#607A3A] font-bold">✓ No anomalies detected</span>
            </div>

            {/* Solver C Anomaly Flag */}
            <div
              onClick={() => setIsRiskModalOpen(true)}
              className="flex justify-between items-center bg-[#F0C94C]/20 border border-[#D4A017] p-3 rounded-xl cursor-pointer hover:bg-[#F0C94C]/30 transition-all shadow-xs"
            >
              <div>
                <span className="font-bold text-[#2B2B2B]">SOLVER C:</span>
                <span className="text-[#B84A39] font-bold block text-[11px]">
                  ⚠ 2 unusually similar bids — Review recommended
                </span>
              </div>
              <span className="text-xs text-[#D4A017] font-bold underline">Inspect Signal →</span>
            </div>
          </div>
        </div>

        {/* Live Solver Activity Stream */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-[#D4A017] animate-pulse" />
              <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                Live Solver Activity Feed
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#607A3A] bg-[#607A3A]/15 px-2.5 py-1 rounded-lg">
              ● Relayer Stream
            </span>
          </div>

          <div className="bg-[#2B2B2B] text-[#FFFDF5] p-3.5 rounded-xl space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto shadow-inner">
            <div className="text-[11px]"><span className="text-[#F0C94C] font-bold">[10:42:18]</span> Solver B joined auction #INT-8492</div>
            <div className="text-[11px]"><span className="text-[#F0C94C] font-bold">[10:42:19]</span> Solver A submitted bid ($497.50 output)</div>
            <div className="text-[11px]"><span className="text-[#F0C94C] font-bold">[10:42:19]</span> Solver B submitted bid ($497.82 output, 42.8s)</div>
            <div className="text-[11px]"><span className="text-[#F0C94C] font-bold">[10:42:20]</span> Solver C submitted bid ($496.80 output, 28.4s)</div>
            <div className="text-[11px] text-[#CEF26D]"><span className="text-[#F0C94C] font-bold">[10:42:22]</span> Solver B selected as Rank #1 Winner</div>
            <div className="text-[11px] text-[#CEF26D]"><span className="text-[#F0C94C] font-bold">[10:42:23]</span> Solver B posted $500 collateral bond</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. ROW 4: RECENT BID HISTORY (7 COLS) + ACCOUNTABILITY HISTORY (5 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recent Bids Competition Table */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
              Recent Intent Bids & Marketplace Outcomes
            </h3>
            <span className="text-xs text-[#5A5A5A] font-mono">Last 4 Competitions</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="grid grid-cols-5 text-[10px] text-[#5A5A5A] font-bold uppercase pb-1 border-b border-[rgba(43,43,43,0.06)]">
              <span>Intent</span>
              <span>Output</span>
              <span>Fee</span>
              <span>Time</span>
              <span className="text-right">Result</span>
            </div>

            <div className="grid grid-cols-5 items-center p-2 rounded-lg bg-[#F7E7B5]/60 font-bold">
              <span className="text-[#2B2B2B]">#8492</span>
              <span className="text-[#D4A017]">$497.82</span>
              <span className="text-[#2B2B2B]">$1.20</span>
              <span className="text-[#2B2B2B]">42.8s</span>
              <span className="text-right text-[#607A3A]">✓ WON</span>
            </div>

            <div className="grid grid-cols-5 items-center p-2 rounded-lg bg-[#FFFDF5] border border-[rgba(43,43,43,0.06)]">
              <span className="text-[#2B2B2B]">#8487</span>
              <span className="text-[#2B2B2B]">$998.31</span>
              <span className="text-[#2B2B2B]">$0.80</span>
              <span className="text-[#2B2B2B]">51.2s</span>
              <span className="text-right text-[#5A5A5A]">✕ LOST</span>
            </div>

            <div className="grid grid-cols-5 items-center p-2 rounded-lg bg-[#F7E7B5]/60 font-bold">
              <span className="text-[#2B2B2B]">#8479</span>
              <span className="text-[#D4A017]">$249.41</span>
              <span className="text-[#2B2B2B]">$0.40</span>
              <span className="text-[#2B2B2B]">31.7s</span>
              <span className="text-right text-[#607A3A]">✓ WON</span>
            </div>

            <div className="grid grid-cols-5 items-center p-2 rounded-lg bg-[#FFFDF5] border border-[rgba(43,43,43,0.06)]">
              <span className="text-[#2B2B2B]">#8472</span>
              <span className="text-[#2B2B2B]">$499.02</span>
              <span className="text-[#2B2B2B]">$1.10</span>
              <span className="text-[#2B2B2B]">39.4s</span>
              <span className="text-right text-[#5A5A5A]">✕ LOST</span>
            </div>
          </div>
        </div>

        {/* Accountability / Slashing History */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
            <h3 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
              Accountability & Slashing Log
            </h3>
            <span className="text-xs text-[#B84A39] font-mono font-bold">Audit Enforced</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="bg-[#B84A39]/10 border border-[#B84A39]/30 p-3 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-[#B84A39]">
                <span>Intent #8392: Deadline Missed</span>
                <span>-$500 Bond</span>
              </div>
              <p className="text-[11px] text-[#5A5A5A]">
                Penalty: $500 slashed to reserve · User 100% refunded · Reputation: -4 pts
              </p>
            </div>

            <div className="bg-[#B84A39]/10 border border-[#B84A39]/30 p-3 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-[#B84A39]">
                <span>Intent #8174: Challenge Lost</span>
                <span>-$250 Bond</span>
              </div>
              <p className="text-[11px] text-[#5A5A5A]">
                Penalty: $250 slashed · User compensated · Reputation: -3 pts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. MODAL: DETAILED SOLVER PROFILE & LIFECYCLE STEPPER
         ========================================================================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDF5] border-2 border-[#D4A017] rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-[#2B2B2B] max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[rgba(43,43,43,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center font-bold text-lg font-mono shadow-xs">
                  {selectedProfile.id === 'solver_b' ? 'B' : selectedProfile.id === 'solver_a' ? 'A' : 'C'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2B2B2B] font-headline">{selectedProfile.name}</h3>
                  <span className="text-xs text-[#5A5A5A] font-mono truncate max-w-sm block">
                    Wallet: {selectedProfile.address}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="p-1.5 rounded-lg hover:bg-[#F7E7B5] text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
                <span className="text-[10px] text-[#5A5A5A] block">Reputation</span>
                <span className="text-lg font-bold text-[#D4A017]">{selectedProfile.reputation} / 100</span>
              </div>

              <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
                <span className="text-[10px] text-[#5A5A5A] block">Success Rate</span>
                <span className="text-lg font-bold text-[#607A3A]">{selectedProfile.successRate}%</span>
              </div>

              <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
                <span className="text-[10px] text-[#5A5A5A] block">Bond Available</span>
                <span className="text-lg font-bold text-[#2B2B2B]">${selectedProfile.collateralBond} USDC</span>
              </div>

              <div className="bg-[#F7E7B5]/60 p-3 rounded-xl border border-[rgba(43,43,43,0.08)]">
                <span className="text-[10px] text-[#5A5A5A] block">Total Capital</span>
                <span className="text-lg font-bold text-[#2B2B2B]">${(selectedProfile.totalCapital / 1000).toFixed(1)}K</span>
              </div>
            </div>

            {/* Solver Lifecycle (Key Feature from Prompt) */}
            <div className="space-y-2.5 font-mono text-xs">
              <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider block font-headline">
                Deterministic Solver Protocol Lifecycle
              </span>

              <div className="bg-[#F7E7B5]/40 p-4 rounded-xl border border-[rgba(43,43,43,0.08)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#2B2B2B]">
                  <span>REGISTERED</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span>ONLINE</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span>DISCOVERED INTENT</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span>SUBMITTED BID</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span className="text-[#D4A017]">SELECTED</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span>POSTED BOND</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span>EXECUTING</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A017]" />
                  <span className="text-[#607A3A]">VERIFIED & PAID</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[rgba(43,43,43,0.08)] pt-4 text-xs font-mono">
              <span className="text-[#607A3A] font-bold">● Active Protocol Agent</span>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 rounded-xl bg-[#2B2B2B] text-[#FFFDF5] font-bold hover:bg-[#3B3B3B] transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL: RISK SIGNAL AUDIT
         ========================================================================= */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDF5] border-2 border-[#D4A017] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-[#2B2B2B]">
            <div className="flex items-start justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-[#D4A017]" />
                <div>
                  <h3 className="text-base font-bold text-[#2B2B2B] font-headline">RISK SIGNAL AUDIT</h3>
                  <p className="text-xs text-[#5A5A5A]">Coordinated bidding detection report</p>
                </div>
              </div>

              <button onClick={() => setIsRiskModalOpen(false)} className="p-1 text-[#5A5A5A] hover:text-[#2B2B2B] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F7E7B5]/60 p-4 rounded-xl space-y-2 font-mono text-xs border border-[rgba(43,43,43,0.08)]">
              <div className="flex justify-between">
                <span>Observed Bid Similarity:</span>
                <span className="font-bold text-[#D4A017]">87.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Observed Across:</span>
                <span className="font-bold text-[#2B2B2B]">4 Recent Intents</span>
              </div>
              <div className="flex justify-between">
                <span>Signal Classification:</span>
                <span className="font-bold text-[#B84A39]">Possible Coordinated Bidding</span>
              </div>
            </div>

            <p className="text-xs text-[#5A5A5A] font-sans">
              <strong>Notice:</strong> No automatic penalty has been applied. Manual review is recommended to preserve open marketplace integrity.
            </p>

            <button
              type="button"
              onClick={() => setIsRiskModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4A017] text-[#2B2B2B] font-mono text-xs font-bold hover:bg-[#E0AB1E] transition-all cursor-pointer uppercase"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: REGISTER SOLVER CONCEPT
         ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDF5] border-2 border-[#D4A017] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-[#2B2B2B]">
            <div className="flex items-start justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2B2B2B] font-headline">SOLVER REGISTRATION</h3>
                <p className="text-xs text-[#5A5A5A]">Protocol Concept Interface</p>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="p-1 text-[#5A5A5A] hover:text-[#2B2B2B] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-[#5A5A5A] uppercase block">Solver Agent Name</label>
                <input
                  type="text"
                  defaultValue="Solver Delta — Arbitrage Route"
                  className="w-full bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.15)] rounded-lg p-2 mt-1 text-[#2B2B2B] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#5A5A5A] uppercase block">Supported Chains</label>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 bg-[#FFFDF5] border rounded text-[#2B2B2B]">Ethereum</span>
                  <span className="px-2 py-1 bg-[#FFFDF5] border rounded text-[#2B2B2B]">Solana</span>
                  <span className="px-2 py-1 bg-[#FFFDF5] border rounded text-[#2B2B2B]">Arbitrum</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#5A5A5A] uppercase block">Collateral Requirement</label>
                <span className="font-bold text-[#D4A017] text-sm block mt-1">$500 USDC (Minimum)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4A017] text-[#2B2B2B] font-mono text-xs font-bold hover:bg-[#E0AB1E] transition-all cursor-pointer uppercase"
            >
              Register Solver Node →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
