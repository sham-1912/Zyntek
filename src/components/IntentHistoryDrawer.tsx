import React from 'react';
import type { IntentHistoryItem } from '../services/types';
import { History, X, ExternalLink } from 'lucide-react';

interface IntentHistoryDrawerProps {
  isOpen: boolean;
  history: IntentHistoryItem[];
  onClose: () => void;
}

export const IntentHistoryDrawer: React.FC<IntentHistoryDrawerProps> = ({ isOpen, history, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Intent Execution History</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No intent history recorded yet. Submit your first intent to track protocol lifecycle.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => {
              const isSettled = item.status === 'settled';
              const isSlashed = item.status === 'slashed_refunded';

              return (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-400 font-bold">ID: {item.intent.intentId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSettled
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isSlashed
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-slate-300">
                    Amount: <span className="text-white font-bold">${item.intent.sourceAmount} USDC</span> (Sepolia $\rightarrow$ Solana)
                  </div>

                  {item.winningBid && (
                    <div className="text-slate-400 text-[11px]">
                      Solver: <span className="text-white">{item.winningBid.solverName}</span>
                    </div>
                  )}

                  {item.result && (
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Tx: {item.result.txHash.slice(0, 10)}...</span>
                      <a
                        href={item.result.receipts[0]?.explorerUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
