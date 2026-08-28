import React, { useState } from 'react';
import type { UserIntent, ChainId, PrioritySliders as SlidersType } from '../services/types';
import { ArrowRight, ChevronDown, Search, Loader2, CheckCircle2 } from 'lucide-react';

interface IntentFormProps {
  onPreCommitTrigger: (intent: UserIntent) => void;
  disabled?: boolean;
}

export const IntentForm: React.FC<IntentFormProps> = ({ onPreCommitTrigger, disabled }) => {
  const [sourceChain, setSourceChain] = useState<ChainId>('ethereum');
  const [sourceAsset] = useState<string>('USDC');
  const [sourceAmount, setSourceAmount] = useState<number>(1000);

  const [destinationChain, setDestinationChain] = useState<ChainId>('solana');
  const [destinationAsset] = useState<string>('USDC');

  // Submit button morphing state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Sliders with auto-rebalancing to sum to 100%
  const [sliders, setSliders] = useState<SlidersType>({
    cost: 30,
    speed: 50,
    safety: 20,
  });

  const handleSliderChange = (changedKey: keyof SlidersType, newValue: number) => {
    const clampedVal = Math.min(100, Math.max(0, newValue));
    const otherKeys = (['cost', 'speed', 'safety'] as (keyof SlidersType)[]).filter(
      (k) => k !== changedKey
    );
    const oldOtherSum = sliders[otherKeys[0]] + sliders[otherKeys[1]];
    const newOtherSum = 100 - clampedVal;

    let newOther1 = 0;
    let newOther2 = 0;

    if (oldOtherSum === 0) {
      newOther1 = Math.round(newOtherSum / 2);
      newOther2 = newOtherSum - newOther1;
    } else {
      newOther1 = Math.round((sliders[otherKeys[0]] / oldOtherSum) * newOtherSum);
      newOther2 = newOtherSum - newOther1;
    }

    setSliders({
      cost: changedKey === 'cost' ? clampedVal : (otherKeys[0] === 'cost' ? newOther1 : newOther2),
      speed: changedKey === 'speed' ? clampedVal : (otherKeys[0] === 'speed' ? newOther1 : newOther2),
      safety: changedKey === 'safety' ? clampedVal : (otherKeys[0] === 'safety' ? newOther1 : newOther2),
    });
  };

  const getStrategyPreviewText = () => {
    if (sliders.speed >= 50) return 'Strategy: Fast-path priority execution relayers via private Flashbots pool';
    if (sliders.cost >= 50) return 'Strategy: Low-cost DEX aggregator routing with minimal protocol fees';
    if (sliders.safety >= 50) return 'Strategy: Maximum collateral security (150% bond) with ZK-Oracle verification';
    return 'Strategy: Balanced execution route with optimal fee & speed trade-offs';
  };

  const estimatedMinOutput = Number((sourceAmount * 0.99).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || isSubmitting || sourceAmount <= 0) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // Morphing loading state
    setIsSubmitting(false);
    setSubmitSuccess(true);
    await new Promise((r) => setTimeout(r, 350)); // Checkmark pulse

    const newIntent: UserIntent = {
      intentId: `int_${Math.random().toString(36).substr(2, 8)}`,
      sourceChain,
      sourceAsset,
      sourceAmount,
      destinationChain,
      destinationAsset,
      minAcceptableOutput: estimatedMinOutput,
      deadlineMinutes: 10,
      sliders,
      timestamp: Date.now(),
    };

    setSubmitSuccess(false);
    onPreCommitTrigger(newIntent);
  };

  const sliderTotal = sliders.cost + sliders.speed + sliders.safety;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header (Matching Image 1: CREATE AN INTENT) */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1915] uppercase font-sans">
          CREATE AN INTENT
        </h1>
        <p className="text-sm text-[#6B6659]">
          Define your cross-chain transaction parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Networks & Amount (Matching Image 1) */}
        <div className="ix-card p-6 space-y-6 ix-card-hover">
          
          {/* Source & Destination Network Selection */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* Source Network */}
            <div className="ix-card-subtle p-4 space-y-2 relative">
              <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
                Source Network
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFECE6] border border-[#DFD9CD] flex items-center justify-center font-bold text-xs font-mono text-[#38352F]">
                    Ξ
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1A1915]">
                      {sourceChain === 'ethereum' ? 'Ethereum' : 'Arbitrum'}
                    </div>
                    <div className="text-xs font-mono text-[#7A7568]">{sourceAsset}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSourceChain(sourceChain === 'ethereum' ? 'arbitrum' : 'ethereum')}
                  className="text-[#7A7568] hover:text-[#1A1915] p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Circle Arrow (Overlay) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-[#DFD9CD] shadow-xs items-center justify-center text-[#7A7568]">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Destination Network */}
            <div className="ix-card-subtle p-4 space-y-2 relative">
              <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
                Destination Network
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center font-bold text-xs font-mono text-[#8C6407]">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1A1915]">
                      {destinationChain === 'solana' ? 'Solana' : 'Polygon'}
                    </div>
                    <div className="text-xs font-mono text-[#7A7568]">{destinationAsset}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDestinationChain(destinationChain === 'solana' ? 'polygon' : 'solana')}
                  className="text-[#7A7568] hover:text-[#1A1915] p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Amount to Transfer Box */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
              Amount to Transfer
            </label>

            <div className="ix-card-subtle p-3 sm:p-4 flex items-center justify-between gap-4 border border-[#E8E4DA] focus-within:border-[#C69214] transition-colors">
              <input
                type="number"
                min="10"
                max="100000"
                value={sourceAmount}
                onChange={(e) => setSourceAmount(Number(e.target.value))}
                className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#1A1915] outline-none border-none p-0 focus:ring-0"
                placeholder="1,000"
              />

              <div className="px-3 py-1.5 rounded-lg bg-white border border-[#DFD9CD] font-mono font-bold text-sm text-[#38352F] shrink-0 shadow-2xs">
                USDC
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSourceAmount(amt)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ix-btn-active ${
                    sourceAmount === amt
                      ? 'bg-[#C69214] text-white font-bold'
                      : 'bg-white border border-[#E8E4DA] text-[#6B6659] hover:border-[#C69214]'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Card 2: Solver Priorities Sliders (Matching Image 1) */}
        <div className="ix-card p-6 space-y-6 ix-card-hover">
          <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3">
            <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider">
              Solver Priorities
            </span>
            <span className="text-xs font-mono text-[#C69214] font-semibold transition-all duration-200">
              Auto-Balanced (Total: {sliderTotal}%)
            </span>
          </div>

          <div className="space-y-5">
            {/* Slider 1: Cost Efficiency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-[#1A1915]">
                <div className="flex items-center gap-2">
                  <span>💳</span>
                  <span>Cost Efficiency</span>
                </div>
                <span className="font-mono font-bold text-[#1A1915] transition-all duration-200">{sliders.cost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.cost}
                onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
                className="ix-slider transition-all duration-200 ease-out"
              />
            </div>

            {/* Slider 2: Execution Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-[#1A1915]">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Execution Speed</span>
                </div>
                <span className="font-mono font-bold text-[#1A1915] transition-all duration-200">{sliders.speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.speed}
                onChange={(e) => handleSliderChange('speed', Number(e.target.value))}
                className="ix-slider transition-all duration-200 ease-out"
              />
            </div>

            {/* Slider 3: Security Margin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-[#1A1915]">
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Security Margin</span>
                </div>
                <span className="font-mono font-bold text-[#1A1915] transition-all duration-200">{sliders.safety}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.safety}
                onChange={(e) => handleSliderChange('safety', Number(e.target.value))}
                className="ix-slider transition-all duration-200 ease-out"
              />
            </div>
          </div>

          {/* Live Strategy Preview Line */}
          <div className="pt-2 border-t border-[#E8E4DA] text-xs text-[#6B6659] italic flex items-center gap-2 font-sans transition-all duration-300">
            <span>{getStrategyPreviewText()}</span>
          </div>
        </div>

        {/* Morphing Submit Button */}
        <button
          type="submit"
          disabled={disabled || isSubmitting || submitSuccess}
          className={`w-full py-4 px-6 ix-btn-gold ix-btn-active text-base uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer ${
            submitSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>FINDING OPTIMAL SOLVERS...</span>
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white animate-stroke-draw" />
              <span>SOLVERS FOUND!</span>
            </>
          ) : (
            <>
              <span>FIND SOLVERS</span>
              <Search className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>

      </form>

    </div>
  );
};
