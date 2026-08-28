import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

interface FailureSlashingPanelProps {
  onTriggerFailure: () => void;
  disabled?: boolean;
}

export const FailureSlashingPanel: React.FC<FailureSlashingPanelProps> = ({ onTriggerFailure, disabled }) => {
  return (
    <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Judge Demo Tool: Forced Failure & Slashing Simulation</h3>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-300 border border-rose-700">
          Strict Accountability Test
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Simulate a solver timeout or invalid proof submission on the destination chain. The protocol automatically slashes the solver&apos;s 100% locked bond and immediately refunds the user&apos;s escrow.
      </p>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          disabled={disabled}
          onClick={onTriggerFailure}
          className="px-4 py-2 rounded-lg gradient-bg-danger hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-rose-950/50 disabled:opacity-50"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Simulate Solver Failure & Force Slashing</span>
        </button>
      </div>
    </div>
  );
};
