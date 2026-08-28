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
    <div className="glass-card p-5 space-y-4 shadow-md flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D4A017] flex items-center justify-center text-[#2B2B2B] shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
                {winningBid ? `Why ${winningBid.solverName.split('—')[0]} Won` : activeBid ? `Leading Bid Evaluation` : 'Competitive Scoring Formula'}
              </h3>
            </div>
            <p className="text-[11px] text-[#5A5A5A]">
              {activeBid ? `Dynamic Score: ${activeBid.finalScore.toFixed(1)} / 100` : 'Deterministic multi-attribute weighting'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 rounded-lg bg-[#F7E7B5] text-xs font-mono text-[#2B2B2B] flex items-center gap-1 hover:bg-[#F0C94C]/40 transition-all cursor-pointer border border-[rgba(43,43,43,0.08)] shadow-xs"
        >
          <span>{isOpen ? 'Less' : 'More'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User Priority Weights Connection */}
      <div className="glass-sub-box p-3 space-y-2 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
        <div className="flex items-center justify-between text-[#2B2B2B] font-bold text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            Active Priority Weights:
          </span>
          <span className="text-[#5A5A5A]">100% Normalized</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-[#FFFDF5] p-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[9px] text-[#5A5A5A] block font-semibold">Cost</span>
            <span className="text-[#D4A017] font-bold">{sliders.cost}%</span>
          </div>
          <div className="bg-[#FFFDF5] p-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[9px] text-[#5A5A5A] block font-semibold">Speed</span>
            <span className="text-[#2B2B2B] font-bold">{sliders.speed}%</span>
          </div>
          <div className="bg-[#FFFDF5] p-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <span className="text-[9px] text-[#5A5A5A] block font-semibold">Safety</span>
            <span className="text-[#2B2B2B] font-bold">{sliders.safety}%</span>
          </div>
        </div>
      </div>

      {/* Mathematical Score Contributions */}
      {activeBid && (
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="bg-[#FFFDF5] p-2 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <div className="flex justify-between items-center text-[#D4A017] font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" /> Cost
              </span>
              <span>{activeBid.subScores.costScore}</span>
            </div>
            <div className="text-[10px] text-[#5A5A5A] flex justify-between">
              <span>Weighted:</span>
              <span className="text-[#D4A017] font-bold">+{costContrib}</span>
            </div>
          </div>

          <div className="bg-[#FFFDF5] p-2 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <div className="flex justify-between items-center text-[#2B2B2B] font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-[#F0C94C]" /> Speed
              </span>
              <span>{activeBid.subScores.speedScore}</span>
            </div>
            <div className="text-[10px] text-[#5A5A5A] flex justify-between">
              <span>Weighted:</span>
              <span className="text-[#2B2B2B] font-bold">+{speedContrib}</span>
            </div>
          </div>

          <div className="bg-[#FFFDF5] p-2 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
            <div className="flex justify-between items-center text-[#2B2B2B] font-bold text-[11px]">
              <span className="flex items-center gap-0.5">
                <Shield className="w-3 h-3 text-[#2B2B2B]" /> Safety
              </span>
              <span>{activeBid.subScores.safetyScore}</span>
            </div>
            <div className="text-[10px] text-[#5A5A5A] flex justify-between">
              <span>Weighted:</span>
              <span className="text-[#2B2B2B] font-bold">+{safetyContrib}</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Winning Drivers Checklist */}
      {isOpen && activeBid && (
        <div className="glass-sub-box p-3 space-y-1.5 text-[11px] font-mono animate-in fade-in duration-200 bg-[#F7E7B5]/40 border border-[rgba(43,43,43,0.08)]">
          <span className="text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider block">
            Competitive Drivers:
          </span>
          <div className="space-y-1 text-[#5A5A5A]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#607A3A] shrink-0 font-bold" />
              <span className="text-[#2B2B2B]">Fastest execution time ({activeBid.etaSec}s ETA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#607A3A] shrink-0 font-bold" />
              <span className="text-[#2B2B2B]">Competitive output (${activeBid.expectedOutput} USDC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#607A3A] shrink-0 font-bold" />
              <span className="text-[#2B2B2B]">Full collateral bond (${activeBid.collateralOfferedUsd})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
