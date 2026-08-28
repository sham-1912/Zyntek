import React from 'react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { Cpu, Layers, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'swap' | 'intents' | 'solvers') => void;
  intentsCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, intentsCount = 1204 }) => {
  const tvl = useAnimatedNumber(284.5, { duration: 1200, decimals: 1 });
  const activeNodes = useAnimatedNumber(142, { duration: 1000, decimals: 0 });
  const animIntents = useAnimatedNumber(intentsCount, { duration: 1000, decimals: 0 });
  const reserve = useAnimatedNumber(520400, { duration: 1200, decimals: 0 });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
          Protocol Overview
        </h1>
        <p className="text-sm text-[#6B6659] font-sans">
          Real-time metrics, liquidity telemetry, and active solver competition across IntentX networks.
        </p>
      </div>

      {/* 4 Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        <div className="ix-card p-5 space-y-2 ix-card-hover">
          <div className="flex items-center justify-between text-[#7A7568]">
            <span className="text-[10px] uppercase tracking-wider">TOTAL VALUE LOCKED</span>
            <Layers className="w-4 h-4 text-[#C69214]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1915]">${tvl.toFixed(1)}M</div>
          <div className="text-[11px] text-[#C69214] font-sans">+12.4% vs last week</div>
        </div>

        <div className="ix-card p-5 space-y-2 ix-card-hover">
          <div className="flex items-center justify-between text-[#7A7568]">
            <span className="text-[10px] uppercase tracking-wider">ACTIVE SOLVERS</span>
            <Cpu className="w-4 h-4 text-[#C69214]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1915]">{activeNodes} Nodes</div>
          <div className="text-[11px] text-[#1B5E20] font-sans">100% Operational Status</div>
        </div>

        <div className="ix-card p-5 space-y-2 ix-card-hover">
          <div className="flex items-center justify-between text-[#7A7568]">
            <span className="text-[10px] uppercase tracking-wider">INTENTS PROCESSED</span>
            <Activity className="w-4 h-4 text-[#C69214]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1915]">{animIntents.toLocaleString()}</div>
          <div className="text-[11px] text-[#1B5E20] font-sans">99.4% Avg Success Rate</div>
        </div>

        <div className="ix-card p-5 space-y-2 ix-card-hover">
          <div className="flex items-center justify-between text-[#7A7568]">
            <span className="text-[10px] uppercase tracking-wider">PROTOCOL RESERVE</span>
            <ShieldCheck className="w-4 h-4 text-[#C69214]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1915]">${reserve.toLocaleString()}</div>
          <div className="text-[11px] text-[#7A7568] font-sans">Insurance Vault Collateral</div>
        </div>

      </div>

      {/* Hero Quick Action Banner (Shortcut to /swap) */}
      <div className="ix-card p-8 bg-[#FAF5E8] border-[#E5D19E] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 rounded bg-white border border-[#E5D19E] text-[#8C6407] text-[10px] font-mono font-bold uppercase tracking-wider">
            IntentX Cross-Chain Engine
          </span>
          <h2 className="text-2xl font-bold text-[#1A1915] font-sans">
            Submit a Cross-Chain Intent
          </h2>
          <p className="text-xs text-[#6B6659] leading-relaxed">
            State your target outcome on Ethereum or Solana. Solvers dynamically bid with zero-slippage liquidity, bond collateral, and sub-second verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('swap')}
            className="ix-btn-gold px-6 py-3 text-sm uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <span>Create Intent</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Section: Active Solvers & Recent Protocol Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Solvers Column */}
        <div className="ix-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3">
            <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider">
              Top Protocol Solvers
            </span>
            <button
              type="button"
              onClick={() => onNavigate('solvers')}
              className="text-xs font-mono text-[#C69214] hover:underline"
            >
              View Marketplace →
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915] font-sans">NexusRoute</div>
                <div className="text-[10px] text-[#7A7568]">99.9 Rep • TVL $142.5M</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] text-[10px] font-bold">
                1,204 Bids
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915] font-sans">OmniRouter</div>
                <div className="text-[10px] text-[#7A7568]">99.1 Rep • TVL $88.1M</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] text-[10px] font-bold">
                891 Bids
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915] font-sans">FlashSolve</div>
                <div className="text-[10px] text-[#7A7568]">98.5 Rep • TVL $45.2M</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] text-[10px] font-bold">
                432 Bids
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Column */}
        <div className="ix-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3">
            <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider">
              Recent Intent Activity
            </span>
            <button
              type="button"
              onClick={() => onNavigate('intents')}
              className="text-xs font-mono text-[#C69214] hover:underline"
            >
              My Intents →
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915]">ETH USDC → SOL USDC</div>
                <div className="text-[10px] text-[#7A7568]">ID: #INT-8492</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#EAF6ED] text-[#1B5E20] text-[10px] font-bold">
                Settled ($1,000)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915]">ETH USDC → ARB USDC</div>
                <div className="text-[10px] text-[#7A7568]">ID: #INT-3c7b</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#EAF6ED] text-[#1B5E20] text-[10px] font-bold">
                Settled ($500)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1915]">ARB USDC → SOL USDC</div>
                <div className="text-[10px] text-[#7A7568]">ID: #INT-9e1f</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] text-[10px] font-bold">
                Executing ($2,500)
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
