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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#101C2C]/80 backdrop-blur-sm">
      <div className="bg-[#162A46] border-l border-[#8DC2FF]/20 w-full max-w-md h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#8DC2FF]" />
            <h3 className="text-base font-bold text-[#F3F6FF]">Intent Execution History</h3>
          </div>
          <button onClick={onClose} className="text-[#8DC2FF]/70 hover:text-[#F3F6FF] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        {history.length === 0 ? (
          <div className="text-center py-12 text-[#8DC2FF]/50 text-xs font-mono">
            No intent history recorded yet. Submit your first intent to track protocol lifecycle.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => {
              const isSettled = item.status === 'settled';
              const isSlashed = item.status === 'slashed_refunded';

              return (
                <div key={idx} className="bg-[#101C2C] p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8DC2FF] font-bold">ID: {item.intent.intentId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSettled
                          ? 'bg-[#1A3152] text-[#CEF26D] border border-[#CEF26D]/30'
                          : isSlashed
                          ? 'bg-[#FF7032]/20 text-[#FF7032] border border-[#FF7032]/30'
                          : 'bg-[#1A3152] text-[#8DC2FF] border border-[#8DC2FF]/30'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[#8DC2FF]/80">
                    Amount: <span className="text-[#F3F6FF] font-bold">${item.intent.sourceAmount} USDC</span> (Ethereum → Solana)
                  </div>

                  {item.winningBid && (
                    <div className="text-[#8DC2FF]/60 text-[11px]">
                      Solver: <span className="text-[#F3F6FF]">{item.winningBid.solverName}</span>
                    </div>
                  )}

                  {item.result && (
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-[#8DC2FF]/50">Tx: {item.result.txHash.slice(0, 10)}...</span>
                      <a
                        href={item.result.receipts[0]?.explorerUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8DC2FF] hover:text-[#F3F6FF] flex items-center gap-1"
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
