import React from 'react';
import type { IntentHistoryItem } from '../services/types';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface MyIntentsTableProps {
  history: IntentHistoryItem[];
  onSelectIntent: (item: IntentHistoryItem) => void;
}

export const MyIntentsTable: React.FC<MyIntentsTableProps> = ({ history, onSelectIntent }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
            My Intents History
          </h1>
          <p className="text-sm text-[#6B6659] font-sans">
            Live contract state ledger recording all submitted intents and cross-chain settlements.
          </p>
        </div>

        <div className="px-3 py-1 rounded bg-[#FAF5E8] border border-[#E5D19E] text-xs font-mono font-bold text-[#8C6407]">
          {history.length} Total Intents
        </div>
      </div>

      {history.length === 0 ? (
        <div className="ix-card p-12 text-center space-y-3">
          <p className="text-sm font-sans text-[#7A7568]">No intents recorded yet. Create an intent to get started!</p>
        </div>
      ) : (
        <div className="ix-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              
              <thead className="bg-[#FAF8F5] border-b border-[#E8E4DA] text-[#7A7568] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Intent ID</th>
                  <th className="py-3.5 px-4 font-semibold">Route</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Selected Solver</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Telemetry</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8E4DA] text-[#1A1915]">
                {history.map((item) => {
                  const isSettled = item.status === 'settled';
                  const isSlashed = item.status === 'slashed_refunded';

                  return (
                    <tr key={item.intent.intentId} className="hover:bg-[#FAF8F5] transition-colors">
                      
                      <td className="py-3.5 px-4 font-bold text-[#C69214]">
                        #{item.intent.intentId.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4 font-sans font-medium text-[#1A1915]">
                        {item.intent.sourceChain.toUpperCase()} {item.intent.sourceAsset} → {item.intent.destinationChain.toUpperCase()} {item.intent.destinationAsset}
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        ${item.intent.sourceAmount.toLocaleString()} USDC
                      </td>

                      <td className="py-3.5 px-4 font-sans text-[#38352F]">
                        {item.winningBid?.solverName || 'AlphaNode'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${
                          isSettled
                            ? 'bg-[#EAF6ED] border-[#A8E0B7] text-[#1B5E20]'
                            : isSlashed
                            ? 'bg-[#FDEDEC] border-[#F5B7B1] text-[#922B21]'
                            : 'bg-[#FAF5E8] border-[#E5D19E] text-[#8C6407]'
                        }`}>
                          {isSettled ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Settled</span>
                            </>
                          ) : isSlashed ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>Slashed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-[#C69214] animate-spin" />
                              <span>Executing</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectIntent(item)}
                          className="text-[#C69214] hover:underline font-semibold flex items-center gap-1 ml-auto"
                        >
                          <span>Telemetry</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
};
