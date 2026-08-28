import React from 'react';
import { ShieldCheck, AlertTriangle, Check } from 'lucide-react';

export const NetworkHealthCard: React.FC = () => {
  return (
    <div className="glass-card p-5 space-y-3.5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#CEF26D]" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Solver Network Risk & Health
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#CEF26D] bg-[rgba(14,30,56,0.65)] px-2.5 py-0.5 rounded-full font-bold border border-[#CEF26D]/30">
          Health 98.4%
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded-lg glass-sub-box">
          <span className="text-[#CBD5E1] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            Total Collateral Bonded
          </span>
          <span className="text-[#CEF26D] font-bold">$188,100 USDC ✓</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg glass-sub-box">
          <span className="text-[#CBD5E1] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            Bid Clustering & Collusion
          </span>
          <span className="text-white font-bold">PASSED (0 alerts)</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg glass-sub-box">
          <span className="text-[#CBD5E1] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
            Solver Mesh Liquidity Pool
          </span>
          <span className="text-[#8DC2FF] font-bold">$699,000 Verified</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg glass-sub-box">
          <span className="text-[#CBD5E1] flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#E9B872]" />
            Historical Slashing Flag
          </span>
          <span className="text-[#E9B872] font-bold">1 historical (Node C)</span>
        </div>
      </div>

      <div className="glass-sub-box p-2 flex items-center justify-between text-[10px] font-mono text-[#CBD5E1]">
        <span>Slashing Safety Factor</span>
        <span className="text-[#CEF26D] font-bold">100% Capital Covered</span>
      </div>
    </div>
  );
};
