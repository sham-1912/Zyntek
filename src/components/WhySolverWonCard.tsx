import React, { useState } from 'react';
import type { SolverBid, PrioritySliders } from '../services/types';
import { Award, ChevronDown, ChevronUp, Check, DollarSign, Zap, Shield, Sparkles } from 'lucide-react';

interface WhySolverWonCardProps {
  winningBid?: SolverBid;
  topBid?: SolverBid;
  sliders: PrioritySliders;
}

export const WhySolverWonCard: React.FC<WhySolverWonCardProps> = ({
  winningBid,
  topBid,
  sliders,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const activeBid = winningBid || topBid;

  const costContrib = activeBid ? Number((activeBid.subScores.costScore * (sliders.cost / 100)).toFixed(1)) : 0;
  const speedContrib = activeBid ? Number((activeBid.subScores.speedScore * (sliders.speed / 100)).toFixed(1)) : 0;
  const safetyContrib = activeBid ? Number((activeBid.subScores.safetyScore * (sliders.safety / 100)).toFixed(1)) : 0;

  return (
    <div className="glass-card p-5 space-y-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#CEF26D]/20 border border-[#CEF26D] flex items-center justify-center text-[#CEF26D]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                {winningBid ? `Why ${winningBid.solverName.split('—')[0]} Won` : activeBid ? `Leading Bid Evaluation` : 'Competitive Scoring Formula'}
              </h3>
            </div>
            <p className="text-[11px] text-[#CBD5E1]">
              {activeBid ? `Dynamic Score: ${activeBid.finalScore.toFixed(1)} / 100` : 'Deterministic multi-attribute weighting'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 rounded-lg bg-[rgba(14,30,56,0.65)] text-xs font-mono text-[#8DC2FF] flex items-center gap-1 hover:bg-white/10 transition-all cursor-pointer"
        >
          <span>{isOpen ? 'Less' : 'More'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User Priority Weights Connection */}
      <div className="glass-sub-box p-3 space-y-2">
        <div className="flex items-center justify-between text-[#8DC2FF] font-bold text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#CEF26D]" />
            Active Priority Weights:
          </span>
          <span className="text-[#CBD5E1]">100% Normalized</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-[rgba(10,20,38,0.7)] p-1.5 rounded-lg border border-white/5">
            <span className="text-[9px] text-[#CBD5E1] block">Cost</span>
            <span className="text-[#CEF26D] font-bold">{sliders.cost}%</span>
          </div>
          <div className="bg-[rgba(10,20,38,0.7)] p-1.5 rounded-lg border border-white/5">
            <span className="text-[9px] text-[#CBD5E1] block">Speed</span>
            <span className="text-[#8DC2FF] font-bold">{sliders.speed}%</span>
          </div>
          <div className="bg-[rgba(10,20,38,0.7)] p-1.5 rounded-lg border border-white/5">
            <span className="text-[9px] text-[#CBD5E1] block">Safety</span>
            <span className="text-white font-bold">{sliders.safety}%</span>
          </div>
        </div>
      </div>

      {/* Mathematical Score Contributions */}
      {activeBid && (
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="glass-sub-box p-2 space-y-0.5">
            <div className="flex justify-between items-center text-[#CEF26D] font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" /> Cost
              </span>
              <span>{activeBid.subScores.costScore}</span>
            </div>
            <div className="text-[10px] text-[#CBD5E1] flex justify-between">
              <span>Weighted:</span>
              <span className="text-[#CEF26D] font-bold">+{costContrib}</span>
            </div>
          </div>

          <div className="glass-sub-box p-2 space-y-0.5">
            <div className="flex justify-between items-center text-[#8DC2FF] font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> Speed
              </span>
              <span>{activeBid.subScores.speedScore}</span>
            </div>
            <div className="text-[10px] text-[#CBD5E1] flex justify-between">
              <span>Weighted:</span>
              <span className="text-[#8DC2FF] font-bold">+{speedContrib}</span>
            </div>
          </div>

          <div className="glass-sub-box p-2 space-y-0.5">
            <div className="flex justify-between items-center text-white font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <Shield className="w-3 h-3 text-[#2F6690]" /> Safety
              </span>
              <span>{activeBid.subScores.safetyScore}</span>
            </div>
            <div className="text-[10px] text-[#CBD5E1] flex justify-between">
              <span>Weighted:</span>
              <span className="text-white font-bold">+{safetyContrib}</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Winning Drivers Checklist */}
      {isOpen && activeBid && (
        <div className="glass-sub-box p-3 space-y-1.5 text-[11px] font-mono animate-in fade-in duration-200">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
            Competitive Drivers:
          </span>
          <div className="space-y-1 text-[#CBD5E1]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#CEF26D] shrink-0" />
              <span>Fastest execution time ({activeBid.etaSec}s ETA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#CEF26D] shrink-0" />
              <span>Competitive output (${activeBid.expectedOutput} USDC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#CEF26D] shrink-0" />
              <span>Full collateral bond (${activeBid.collateralOfferedUsd})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
