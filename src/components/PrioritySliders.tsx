import React from 'react';
import { PrioritySliders as SlidersType } from '../services/types';
import { DollarSign, Zap, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrioritySlidersProps {
  sliders: SlidersType;
  onChange: (newSliders: SlidersType) => void;
  disabled?: boolean;
}

export const PrioritySliders: React.FC<PrioritySlidersProps> = ({ sliders, onChange, disabled }) => {
  const sum = sliders.cost + sliders.speed + sliders.safety;
  const isValid = sum === 100;

  // Proportional rebalancing logic to maintain sum strictly equal to 100%
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>User Priority Weights</span>
            <span className="text-xs text-slate-400 font-normal">(Dynamic Bid Scoring Drivers)</span>
          </h3>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-medium border ${
            isValid
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
              : 'bg-amber-950/60 border-amber-800 text-amber-400'
          }`}
        >
          {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>Total: {sum}% {isValid ? '(Valid)' : '(Rebalancing)'}</span>
        </div>
      </div>

      {/* 3 Priority Sliders */}
      <div className="space-y-4 pt-1">
        {/* Cost Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-indigo-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              Cost Priority (Min Fees & Output)
            </span>
            <span className="font-mono font-bold text-indigo-400">{sliders.cost}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.cost}
            disabled={disabled}
            onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
          />
        </div>

        {/* Speed Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Speed Priority (Fastest Execution)
            </span>
            <span className="font-mono font-bold text-amber-400">{sliders.speed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.speed}
            disabled={disabled}
            onChange={(e) => handleSliderChange('speed', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
          />
        </div>

        {/* Safety Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Safety Priority (Reputation & Bond)
            </span>
            <span className="font-mono font-bold text-cyan-400">{sliders.safety}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.safety}
            disabled={disabled}
            onChange={(e) => handleSliderChange('safety', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
