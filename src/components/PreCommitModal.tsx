import React from 'react';
import type { UserIntent } from '../services/types';
import { Lock, ShieldCheck, ArrowRight, Wallet, X } from 'lucide-react';

interface PreCommitModalProps {
  isOpen: boolean;
  intent: UserIntent;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PreCommitModal: React.FC<PreCommitModalProps> = ({ isOpen, intent, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Approve Escrow Lock</h3>
              <p className="text-[11px] text-slate-400">Pre-Commit Signature Required</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>You Are Locking:</span>
            <span className="text-emerald-400 font-bold text-sm">${intent.sourceAmount} USDC</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Source Chain:</span>
            <span className="text-white">Ethereum (Sepolia)</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Destination Output:</span>
            <span className="text-cyan-400 font-bold">~${intent.minAcceptableOutput} USDC (Solana)</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Est. Network Gas:</span>
            <span className="text-white">~0.0012 ETH ($2.10)</span>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Funds released only to winning solver after hybrid proof verification.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg gradient-bg hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Sign & Escrow $</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
