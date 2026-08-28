import React, { useState } from 'react';
import type { SolverBid, PrioritySliders } from '../services/types';
import { Award, ChevronDown, ChevronUp, Check, DollarSign, Zap, Shield, Sparkles } from 'lucide-react';

interface WhySolverWonCardProps {
  winningBid: SolverBid;
  sliders: PrioritySliders;
}

export const WhySolverWonCard: React.FC<WhySolverWonCardProps> = ({
  winningBid,
  sliders,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const costContrib = Number((winningBid.subScores.costScore * (sliders.cost / 100)).toFixed(1));
  const speedContrib = Number((winningBid.subScores.speedScore * (sliders.speed / 100)).toFixed(1));
  const safetyContrib = Number((winningBid.subScores.safetyScore * (sliders.safety / 100)).toFixed(1));

  return (
    <div className="bg-[#151526] border border-[#D1FE5D]/40 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Accordion Toggle Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#D1FE5D]/20 border border-[#D1FE5D] flex items-center justify-center text-[#D1FE5D]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">
                Why {winningBid.solverName} Won
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#D1FE5D]/20 text-[#D1FE5D] border border-[#D1FE5D]/30">
                Final Score: {winningBid.finalScore.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-[#A5A5B8] font-sans mt-0.5">
              Transparent multi-attribute scoring dynamically calculated from your active priority weights.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-[#20203A] text-xs font-mono text-[#A9A7FF] flex items-center gap-1 hover:bg-[#20203A]/80 transition-all"
        >
          <span>{isOpen ? 'Collapse' : 'Explain'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-white/10 text-xs font-mono animate-in fade-in duration-200">
          {/* User Priority Weights Connection */}
          <div className="bg-[#0B0B14] p-3.5 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[#A9A7FF] font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D1FE5D]" />
                Your Active Priority Driver Weights:
              </span>
              <span className="text-[#A5A5B8]">Auto-Balanced to 100%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#151526] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#A5A5B8] block">Cost Weight</span>
                <span className="text-[#D1FE5D] font-bold">{sliders.cost}%</span>
              </div>
              <div className="bg-[#151526] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#A5A5B8] block">Speed Weight</span>
                <span className="text-[#1053D4] font-bold">{sliders.speed}%</span>
              </div>
              <div className="bg-[#151526] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#A5A5B8] block">Safety Weight</span>
                <span className="text-[#7171DE] font-bold">{sliders.safety}%</span>
              </div>
            </div>
          </div>

          {/* Mathematical Score Contributions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#20203A] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#D1FE5D] font-bold">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Cost Score
                </span>
                <span>{winningBid.subScores.costScore}</span>
              </div>
              <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#D1FE5D] font-bold">+{costContrib}</span>
              </div>
            </div>

            <div className="bg-[#20203A] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#1053D4] font-bold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Speed Score
                </span>
                <span>{winningBid.subScores.speedScore}</span>
              </div>
              <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#1053D4] font-bold">+{speedContrib}</span>
              </div>
            </div>

            <div className="bg-[#20203A] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#7171DE] font-bold">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Safety Score
                </span>
                <span>{winningBid.subScores.safetyScore}</span>
              </div>
              <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#7171DE] font-bold">+{safetyContrib}</span>
              </div>
            </div>
          </div>

          {/* Key Winning Reasons Checklist */}
          <div className="bg-[#20203A]/60 p-3.5 rounded-xl border border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
              Key Competitive Winning Drivers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#A5A5B8]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
                <span>Fastest execution time ({winningBid.etaSec}s ETA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
                <span>Competitive output (${winningBid.expectedOutput} USDC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
                <span>Full collateral coverage (${winningBid.collateralOfferedUsd})</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
                <span>Verified track record ({winningBid.safetyRating}/100 safety score)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
