import React, { useState } from 'react';
import { Wrench, ShieldAlert, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface JudgeToolsPanelProps {
  onTriggerFailure: () => void;
  disabled?: boolean;
}

export const JudgeToolsPanel: React.FC<JudgeToolsPanelProps> = ({ onTriggerFailure, disabled }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900/95 border border-indigo-500/40 rounded-xl shadow-2xl overflow-hidden max-w-sm backdrop-blur-md">
        
        {/* Panel Header Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 bg-slate-950 flex items-center justify-between gap-3 text-xs font-mono font-bold text-indigo-300 hover:bg-slate-900 transition-all border-b border-indigo-900/40"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-indigo-400" />
            <span>Judge Demo Tools (Debug Panel)</span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Panel Expanded Content */}
        {isExpanded && (
          <div className="p-4 space-y-3 bg-rose-950/20 border-t border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Simulate Organic Failure & Slashing</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-tight">
              Forces solver execution timeout or invalid proof attestation on the Solana destination leg. Demonstrates live full-bond collateral slashing and automated escrow refund.
            </p>

            <button
              type="button"
              disabled={disabled}
              onClick={onTriggerFailure}
              className="w-full py-2 px-3 rounded-lg gradient-bg-danger hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
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
