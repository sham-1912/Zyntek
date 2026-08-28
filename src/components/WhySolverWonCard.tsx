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
    <div className="bg-[#162A46] border border-[#CEF26D]/50 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Accordion Toggle Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#CEF26D]/20 border border-[#CEF26D] flex items-center justify-center text-[#CEF26D]">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F3F6FF] font-mono">
                Why {winningBid.solverName} Won
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#CEF26D]/20 text-[#CEF26D] border border-[#CEF26D]/30">
                Final Score: {winningBid.finalScore.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-[#8DC2FF]/80 font-sans mt-0.5">
              Transparent multi-attribute scoring dynamically calculated from your active priority weights.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-[#1A3152] text-xs font-mono text-[#8DC2FF] flex items-center gap-1 hover:bg-[#1A3152]/80 transition-all cursor-pointer"
        >
          <span>{isOpen ? 'Collapse' : 'Explain'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-white/10 text-xs font-mono animate-in fade-in duration-200">
          {/* User Priority Weights Connection */}
          <div className="bg-[#101C2C] p-3.5 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[#8DC2FF] font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#CEF26D]" />
                Your Active Priority Driver Weights:
              </span>
              <span className="text-[#8DC2FF]/60">Auto-Balanced to 100%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#162A46] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#8DC2FF]/70 block">Cost Weight</span>
                <span className="text-[#CEF26D] font-bold">{sliders.cost}%</span>
              </div>
              <div className="bg-[#162A46] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#8DC2FF]/70 block">Speed Weight</span>
                <span className="text-[#8DC2FF] font-bold">{sliders.speed}%</span>
              </div>
              <div className="bg-[#162A46] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#8DC2FF]/70 block">Safety Weight</span>
                <span className="text-[#2F6690] font-bold">{sliders.safety}%</span>
              </div>
            </div>
          </div>

          {/* Mathematical Score Contributions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1A3152] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#CEF26D] font-bold">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Cost Score
                </span>
                <span>{winningBid.subScores.costScore}</span>
              </div>
              <div className="text-[11px] text-[#8DC2FF]/70 flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#CEF26D] font-bold">+{costContrib}</span>
              </div>
            </div>

            <div className="bg-[#1A3152] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#8DC2FF] font-bold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Speed Score
                </span>
                <span>{winningBid.subScores.speedScore}</span>
              </div>
              <div className="text-[11px] text-[#8DC2FF]/70 flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#8DC2FF] font-bold">+{speedContrib}</span>
              </div>
            </div>

            <div className="bg-[#1A3152] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between items-center text-[#8DC2FF] font-bold">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#2F6690]" /> Safety Score
                </span>
                <span>{winningBid.subScores.safetyScore}</span>
              </div>
              <div className="text-[11px] text-[#8DC2FF]/70 flex justify-between">
                <span>Weighted Contrib:</span>
                <span className="text-[#8DC2FF] font-bold">+{safetyContrib}</span>
              </div>
            </div>
          </div>

          {/* Key Winning Reasons Checklist */}
          <div className="bg-[#1A3152]/70 p-3.5 rounded-xl border border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-[#F3F6FF] uppercase tracking-wider block">
              Key Competitive Winning Drivers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#8DC2FF]/85">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
                <span>Fastest execution time ({winningBid.etaSec}s ETA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
                <span>Competitive output (${winningBid.expectedOutput} USDC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
                <span>Full collateral coverage (${winningBid.collateralOfferedUsd})</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
                <span>Verified track record ({winningBid.safetyRating}/100 safety score)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
