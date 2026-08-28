import React from 'react';
import type { PrioritySliders as SlidersType } from '../services/types';
import { getSliderMeaningPreview } from '../services/scoringEngine';
import { DollarSign, Zap, Shield, CheckCircle2, Compass } from 'lucide-react';

interface PrioritySlidersProps {
  sliders: SlidersType;
  onChange: (newSliders: SlidersType) => void;
  disabled?: boolean;
}

export const PrioritySliders: React.FC<PrioritySlidersProps> = ({ sliders, onChange, disabled }) => {
  const sum = sliders.cost + sliders.speed + sliders.safety;
  const meaningPreview = getSliderMeaningPreview(sliders);

  const handleSliderChange = (key: keyof SlidersType, newValue: number) => {
    if (disabled) return;
    const clampedVal = Math.max(0, Math.min(100, Math.round(newValue)));
    const otherKeys = (['cost', 'speed', 'safety'] as const).filter((k) => k !== key);
    const currentOthersSum = sliders[otherKeys[0]] + sliders[otherKeys[1]];
    const remaining = 100 - clampedVal;

    let newOthers = { ...sliders };

    if (currentOthersSum === 0) {
      const split = Math.round(remaining / 2);
      newOthers[otherKeys[0]] = split;
      newOthers[otherKeys[1]] = remaining - split;
    } else {
      const ratio0 = sliders[otherKeys[0]] / currentOthersSum;
      const val0 = Math.round(remaining * ratio0);
      const val1 = remaining - val0;
      newOthers[otherKeys[0]] = Math.max(0, val0);
      newOthers[otherKeys[1]] = Math.max(0, val1);
    }

    onChange({
      ...newOthers,
      [key]: clampedVal,
    });
  };

  return (
    <div className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header & Auto-Balancing Validation Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#F3F6FF] font-mono flex items-center gap-2">
            <span>Dynamic Bid Scoring Weights</span>
          </h3>
          <p className="text-[11px] text-[#8DC2FF]/80 mt-0.5">
            Adjusting weights recalculates solver rankings and winner live. Sum auto-balances to 100%.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-[#1A3152] border border-[#CEF26D]/30 text-[#CEF26D] shrink-0 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Total: {sum}% (100% Normalized)</span>
        </div>
      </div>

      {/* Live Strategy Meaning Preview */}
      <div className="bg-[#101C2C] border border-[#8DC2FF]/20 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono">
        <Compass className="w-4 h-4 text-[#8DC2FF] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#F3F6FF] uppercase text-[10px] tracking-wider block mb-0.5">
            Active Strategy Direction:
          </span>
          <p className="text-[11px] text-[#8DC2FF]/85 font-sans leading-tight">{meaningPreview}</p>
        </div>
      </div>

      {/* 3 Priority Sliders */}
      <div className="space-y-4 pt-1">
        {/* Cost Slider (#CEF26D Sunny Herb) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-[#CEF26D] flex items-center gap-1.5 font-bold font-mono">
              <DollarSign className="w-3.5 h-3.5 text-[#CEF26D]" />
              Cost Priority (Max Output & Lowest Fees)
            </span>
            <span className="font-mono font-bold text-[#CEF26D] text-sm">{sliders.cost}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.cost}
            disabled={disabled}
            onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
            className="w-full slider-cost cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Speed Slider (#8DC2FF Ice Blue) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-[#8DC2FF] flex items-center gap-1.5 font-bold font-mono">
              <Zap className="w-3.5 h-3.5 text-[#8DC2FF]" />
              Speed Priority (Fastest Execution Latency)
            </span>
            <span className="font-mono font-bold text-[#8DC2FF] text-sm">{sliders.speed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.speed}
            disabled={disabled}
            onChange={(e) => handleSliderChange('speed', Number(e.target.value))}
            className="w-full slider-speed cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Safety Slider (#2F6690 Harbor Blue) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-[#8DC2FF] flex items-center gap-1.5 font-bold font-mono">
              <Shield className="w-3.5 h-3.5 text-[#2F6690]" />
              Safety Priority (Reputation & Collateral Bond)
            </span>
            <span className="font-mono font-bold text-[#8DC2FF] text-sm">{sliders.safety}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.safety}
            disabled={disabled}
            onChange={(e) => handleSliderChange('safety', Number(e.target.value))}
            className="w-full slider-safety cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
