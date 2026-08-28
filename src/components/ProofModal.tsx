import React from 'react';
import type { ProofPayload } from '../services/types';
import { ShieldCheck, X, Copy, Check } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  proofPayload?: ProofPayload;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({ isOpen, proofPayload, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !proofPayload) return null;

  const jsonStr = JSON.stringify(proofPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Cryptographic Proof Payload</h3>
              <p className="text-[11px] text-slate-400">Trust-Minimized Independent Verification Receipt</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payload JSON Inspector */}
        <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-[10px] flex items-center gap-1 font-sans"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>

          <pre>{jsonStr}</pre>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 font-mono pt-1">
          <span>Status: <strong className="text-emerald-400">{proofPayload.status}</strong></span>
          <span>Mode: <strong className="text-indigo-400">{proofPayload.verificationType.toUpperCase()}</strong></span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
          >
            Close Proof Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
