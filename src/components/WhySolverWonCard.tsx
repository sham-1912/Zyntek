import React, { useState } from 'react';
import type { SolverBid, PrioritySliders } from '../services/types';
import { Award, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

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

  const costContrib = activeBid ? Number((activeBid.subScores.costScore * (sliders.cost / 100)).toFixed(1)) : 32.1;
  const speedContrib = activeBid ? Number((activeBid.subScores.speedScore * (sliders.speed / 100)).toFixed(1)) : 41.8;
  const safetyContrib = activeBid ? Number((activeBid.subScores.safetyScore * (sliders.safety / 100)).toFixed(1)) : 17.5;
  const finalScore = activeBid ? activeBid.finalScore.toFixed(1) : '91.4';

  const highestWeight =
    sliders.speed >= sliders.cost && sliders.speed >= sliders.safety
      ? 'speed'
      : sliders.cost >= sliders.safety
      ? 'cost'
      : 'safety';

  return (
    <div className="glass-card p-6 flex flex-col justify-start h-full border border-[rgba(43,43,43,0.12)] space-y-4 bg-[#FFFDF5]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4A017] flex items-center justify-center text-[#2B2B2B] shadow-xs shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] font-headline uppercase tracking-wider">
              {winningBid
                ? `Why ${winningBid.solverName.split('—')[0]} Won`
                : activeBid
                ? `Leading Bid Evaluation`
                : 'Competitive Scoring Formula'}
            </h3>
            <p className="text-xs text-[#5A5A5A] font-sans">
              Dynamic multi-attribute scoring model
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 rounded-lg bg-[#F7E7B5] text-xs font-mono text-[#2B2B2B] flex items-center gap-1 hover:bg-[#F0C94C]/40 transition-all cursor-pointer border border-[rgba(43,43,43,0.08)] shadow-xs font-semibold"
        >
          <span>{isOpen ? 'Less' : 'More'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Visual Score Breakdown Bars (Directive 6) */}
      <div className="glass-sub-box p-3.5 space-y-3 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
        <div className="flex items-center justify-between font-mono">
          <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider">
            {activeBid ? activeBid.solverName.split('—')[0] : 'SOLVER B'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-[#D4A017] leading-none">
              {finalScore}
            </span>
            <span className="text-[10px] text-[#5A5A5A] font-bold">FINAL SCORE</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2 font-mono text-xs">
          {/* COST BAR */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-[#2B2B2B]">COST</span>
              <span className="font-bold text-[#D4A017]">+{costContrib}</span>
            </div>
            <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D4A017] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (costContrib / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* SPEED BAR */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-[#2B2B2B]">SPEED</span>
              <span className="font-bold text-[#2B2B2B]">+{speedContrib}</span>
            </div>
            <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#F0C94C] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (speedContrib / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* SAFETY BAR */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-[#2B2B2B]">SAFETY</span>
              <span className="font-bold text-[#2B2B2B]">+{safetyContrib}</span>
            </div>
            <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2B2B2B] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (safetyContrib / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Narrative Takeaway Badge */}
        <div className="bg-[#FFFDF5] p-2.5 rounded-lg border border-[rgba(43,43,43,0.08)] flex items-center gap-2 text-xs font-mono shadow-xs">
          <TrendingUp className="w-4 h-4 text-[#D4A017] shrink-0" />
          <span className="text-[#2B2B2B] font-medium">
            {activeBid?.solverName.split('—')[0] || 'Solver'} wins because your intent prioritizes{' '}
            <strong className="text-[#D4A017] uppercase">{highestWeight}</strong>.
          </span>
        </div>
      </div>

      {/* User Preferences Summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-[#F7E7B5]/40 py-1.5 px-2 rounded-lg border border-[rgba(43,43,43,0.08)]">
          <span className="text-[10px] text-[#5A5A5A] block">Cost Pref</span>
          <span className="text-[#D4A017] font-bold">{sliders.cost}%</span>
        </div>
        <div className="bg-[#F7E7B5]/40 py-1.5 px-2 rounded-lg border border-[rgba(43,43,43,0.08)]">
          <span className="text-[10px] text-[#5A5A5A] block">Speed Pref</span>
          <span className="text-[#2B2B2B] font-bold">{sliders.speed}%</span>
        </div>
        <div className="bg-[#F7E7B5]/40 py-1.5 px-2 rounded-lg border border-[rgba(43,43,43,0.08)]">
          <span className="text-[10px] text-[#5A5A5A] block">Safety Pref</span>
          <span className="text-[#2B2B2B] font-bold">{sliders.safety}%</span>
        </div>
      </div>
    </div>
  );
};
