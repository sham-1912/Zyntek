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
    <div className="glass-sub-box p-3.5 space-y-2.5">
      {/* Header & Strategy Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-white font-bold">
          <Compass className="w-4 h-4 text-[#8DC2FF]" />
          <span>Dynamic Weights: <span className="font-normal text-xs text-[#E2E8F0]">{meaningPreview}</span></span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#CEF26D] shrink-0 bg-[rgba(10,20,38,0.7)] px-2 py-0.5 rounded border border-[#CEF26D]/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{sum}% Normalized</span>
        </div>
      </div>

      {/* 3 Inline Sliders with High Contrast Text */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono text-xs">
        {/* Cost Slider */}
        <div className="space-y-1.5 bg-[rgba(10,20,38,0.6)] p-2.5 rounded-lg border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#CEF26D] flex items-center gap-1 font-bold">
              <DollarSign className="w-3.5 h-3.5 text-[#CEF26D]" /> Cost
            </span>
            <span className="font-bold text-[#CEF26D] text-xs">{sliders.cost}%</span>
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

        {/* Speed Slider */}
        <div className="space-y-1.5 bg-[rgba(10,20,38,0.6)] p-2.5 rounded-lg border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8DC2FF] flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-[#8DC2FF]" /> Speed
            </span>
            <span className="font-bold text-[#8DC2FF] text-xs">{sliders.speed}%</span>
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

        {/* Safety Slider */}
        <div className="space-y-1.5 bg-[rgba(10,20,38,0.6)] p-2.5 rounded-lg border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white flex items-center gap-1 font-bold">
              <Shield className="w-3.5 h-3.5 text-[#2F6690]" /> Safety
            </span>
            <span className="font-bold text-[#8DC2FF] text-xs">{sliders.safety}%</span>
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
