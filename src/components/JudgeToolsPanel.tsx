import React, { useState } from 'react';
import { Wrench, ShieldAlert, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface JudgeToolsPanelProps {
  onTriggerFailure: () => void;
  disabled?: boolean;
}

export const JudgeToolsPanel: React.FC<JudgeToolsPanelProps> = ({ onTriggerFailure, disabled }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="fixed bottom-12 right-6 z-40">
      <div className="ix-card border-[#E5D19E] shadow-lg overflow-hidden max-w-sm">
        
        {/* Panel Header Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 bg-[#FAF5E8] flex items-center justify-between gap-3 text-xs font-mono font-bold text-[#8C6407] hover:bg-[#F3E7C4] transition-all border-b border-[#E5D19E]"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-[#C69214]" />
            <span>Judge Demo Tools (Simulation Controls)</span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Panel Expanded Content */}
        {isExpanded && (
          <div className="p-4 space-y-3 bg-[#FDEDEC]/40 border-t border-[#F5B7B1]">
            <div className="flex items-center gap-2 text-[#922B21] font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Simulate Organic Failure & Bond Slashing</span>
            </div>

            <p className="text-[11px] text-[#6B6659] leading-tight font-sans">
              Forces solver destination delivery timeout. Demonstrates live protocol bond slashing, protocol fee distribution, and automated user escrow refund.
            </p>

            <button
              type="button"
              disabled={disabled}
              onClick={onTriggerFailure}
              className="w-full py-2 px-3 rounded-lg bg-[#922B21] hover:bg-[#78231B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Force Solver Timeout / Slashing</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
