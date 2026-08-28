import React from 'react';
import type { IntentHistoryItem } from '../services/types';
import { X, History, ExternalLink, CheckCircle2, Clock, AlertOctagon } from 'lucide-react';

interface IntentHistoryDrawerProps {
  isOpen: boolean;
  history: IntentHistoryItem[];
  onClose: () => void;
}

export const IntentHistoryDrawer: React.FC<IntentHistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2B2B2B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF5] border-l border-[rgba(43,43,43,0.12)] p-6 flex flex-col justify-between shadow-2xl text-[#2B2B2B]">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017]">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2B2B2B] font-headline">Intent Execution History</h3>
                  <p className="text-xs text-[#5A5A5A]">Archived on-chain intent lifecycles</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#F7E7B5] text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* History List */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-12 text-[#5A5A5A] font-mono text-xs">
                  No intent settlement history recorded yet.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.createdAt}
                    className="bg-[#F7E7B5]/50 border border-[rgba(43,43,43,0.1)] rounded-xl p-3.5 space-y-2 font-mono text-xs hover:border-[#D4A017] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4A017] font-bold">#{item.intent.intentId}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          item.status === 'settled'
                            ? 'bg-[#607A3A]/15 text-[#607A3A]'
                            : item.status === 'slashed_refunded'
                            ? 'bg-[#B84A39]/15 text-[#B84A39]'
                            : 'bg-[#F0C94C]/20 text-[#2B2B2B]'
                        }`}
                      >
                        {item.status === 'settled' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : item.status === 'slashed_refunded' ? (
                          <AlertOctagon className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-[#5A5A5A] space-y-1 border-t border-[rgba(43,43,43,0.08)] pt-1.5">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="text-[#2B2B2B] font-bold">
                          {item.intent.sourceAmount} {item.intent.sourceAsset} (ETH) → {item.intent.destinationAsset} (SOL)
                        </span>
                      </div>
                      {item.winningBid && (
                        <div className="flex justify-between">
                          <span>Solver:</span>
                          <span className="text-[#2B2B2B] font-bold">{item.winningBid.solverName.split('—')[0]}</span>
                        </div>
                      )}
                      {item.result && (
                        <div className="flex justify-between items-center text-[11px] text-[#D4A017] pt-1">
                          <span>Hash:</span>
                          <span className="font-bold flex items-center gap-1">
                            {item.result.txHash.slice(0, 10)}...
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[rgba(43,43,43,0.08)] pt-4 text-center text-xs font-mono text-[#5A5A5A]">
            <span>Local Ganache & Sepolia Simulator</span>
          </div>
        </div>
      </div>
    </div>
  );
};
