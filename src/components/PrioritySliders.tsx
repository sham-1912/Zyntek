import React from 'react';
import type { PrioritySliders as SlidersType } from '../services/types';
import { getSliderMeaningPreview } from '../services/scoringEngine';
import { DollarSign, Zap, Shield, CheckCircle2, Info, Compass } from 'lucide-react';

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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header & Validation Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>User Priority Weights</span>
            <span className="text-xs text-slate-400 font-normal">(Dynamic Bid Scoring Drivers)</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Moving any slider automatically balances the remaining weights to total 100%.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-medium border bg-emerald-950/60 border-emerald-800 text-emerald-400 shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Total: {sum}% (Auto-Balanced)</span>
        </div>
      </div>

      {/* Live "What This Means" Preview Line */}
      <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-300 font-mono">
        <Compass className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-0.5">
            Live Strategy Preview:
          </span>
          <p className="font-sans text-[11px] leading-tight text-slate-300">{meaningPreview}</p>
        </div>
      </div>

      {/* 3 Priority Sliders with Semantic Palette Colors */}
      <div className="space-y-4 pt-1">
        {/* Cost Slider (#D1FE5D Lime Green) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-cost flex items-center gap-1.5 font-bold">
              <DollarSign className="w-3.5 h-3.5 text-cost" />
              Cost Priority (Min Fees & Max Output)
            </span>
            <span className="font-mono font-bold text-cost text-sm">{sliders.cost}%</span>
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

        {/* Speed Slider (#1053D4 Electric Blue) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-speed flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-speed" />
              Speed Priority (Fastest Execution)
            </span>
            <span className="font-mono font-bold text-speed text-sm">{sliders.speed}%</span>
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

        {/* Safety Slider (#7171DE Soft Violet) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-safety flex items-center gap-1.5 font-bold">
              <Shield className="w-3.5 h-3.5 text-safety" />
              Safety Priority (Reputation & Collateral Bond)
            </span>
            <span className="font-mono font-bold text-safety text-sm">{sliders.safety}%</span>
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

      {/* Upfront Expectation Note */}
      <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Automated Execution Note:</strong> You&apos;ll be asked to confirm manually only if solver bids are very close (&le;5% gap), or your intent is high-value ($1,000+).
        </span>
      </div>
    </div>
  );
};
