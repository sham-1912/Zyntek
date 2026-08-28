import React, { useState } from 'react';
import type { IntentHistoryItem } from '../services/types';
import { ExternalLink } from 'lucide-react';

interface ActivityLogViewProps {
  history: IntentHistoryItem[];
  onSelectIntent?: (item: IntentHistoryItem) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ history, onSelectIntent }) => {
  const [filter, setFilter] = useState<'all' | 'settlement' | 'slashed'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'settlement') return item.status === 'settled';
    if (filter === 'slashed') return item.status === 'slashed_refunded';
    return true;
  });

  const mockSystemActivity = [
    {
      id: 'act-1',
      blockNumber: 145,
      event: 'IntentSettled',
      txHash: '0x9d4a8f32b1e477a10985c2e4f1',
      gasUsed: '95,000 gas',
      time: '1m ago',
      desc: 'Escrow released and outcome delivered to Solana (0x71...A92F). Net: $998.25 USDC',
      type: 'success',
    },
    {
      id: 'act-2',
      blockNumber: 144,
      event: 'CrossChainDeliveryAttested',
      txHash: '0x5k9a8vwx77b1e49085c2e4f1',
      gasUsed: '42,100 gas',
      time: '2m ago',
      desc: 'Solana block finality attestation proof confirmed by Oracle (0xOracle...77A1).',
      type: 'info',
    },
    {
      id: 'act-3',
      blockNumber: 143,
      event: 'SolverBondCommitted',
      txHash: '0x3c7b91e4f10985c2e4f1a2b3',
      gasUsed: '84,210 gas',
      time: '3m ago',
      desc: 'AlphaNode posted $1,050.00 USDC collateral bond to SolverBonding.sol',
      type: 'info',
    },
    {
      id: 'act-4',
      blockNumber: 142,
      event: 'UserEscrowLocked',
      txHash: '0x8f2a9b410985c2e4f1a2b3c4',
      gasUsed: '65,420 gas',
      time: '4m ago',
      desc: 'User intent #INT-8492 escrow locked on Ganache localnet (Chain #1337)',
      type: 'info',
    },
    {
      id: 'act-5',
      blockNumber: 141,
      event: 'SolverStakeSlashed',
      txHash: '0x1f2e3d4c5b6a77889900aabb',
      gasUsed: '110,200 gas',
      time: '12m ago',
      desc: 'FlashSolve execution timeout. $1,050.00 collateral bond slashed & $1,000.00 refunded to user.',
      type: 'slashed',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
            Protocol Activity Stream
          </h1>
          <p className="text-sm text-[#6B6659] font-sans">
            Real-time EVM event logs, cross-chain attestations, and block execution receipts on Ganache.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#EFECE6] border border-[#DFD9CD] font-mono text-xs shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all ix-btn-active ${
              filter === 'all'
                ? 'bg-white text-[#1A1915] font-bold shadow-2xs'
                : 'text-[#7A7568] hover:text-[#1A1915]'
            }`}
          >
            All Activity
          </button>

          <button
            type="button"
            onClick={() => setFilter('settlement')}
            className={`px-3 py-1.5 rounded-md transition-all ix-btn-active ${
              filter === 'settlement'
                ? 'bg-white text-[#1B5E20] font-bold shadow-2xs'
                : 'text-[#7A7568] hover:text-[#1B5E20]'
            }`}
          >
            Settled Intents
          </button>

          <button
            type="button"
            onClick={() => setFilter('slashed')}
            className={`px-3 py-1.5 rounded-md transition-all ix-btn-active ${
              filter === 'slashed'
                ? 'bg-white text-[#922B21] font-bold shadow-2xs'
                : 'text-[#7A7568] hover:text-[#922B21]'
            }`}
          >
            Slashing Events
          </button>
        </div>
      </div>

      {/* Main Activity Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Live EVM Event Log Stream */}
        <div className="lg:col-span-2 space-y-3 font-mono">
          <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
            Live EVM Contract Event Stream
          </span>

          <div className="space-y-3">
            {mockSystemActivity
              .filter((act) => {
                if (filter === 'settlement') return act.type === 'success';
                if (filter === 'slashed') return act.type === 'slashed';
                return true;
              })
              .map((act) => (
                <div
                  key={act.id}
                  className="ix-card p-4 space-y-2.5 ix-card-hover border-[#E8E4DA] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#E5D19E] text-[10px] text-[#8C6407] font-bold">
                        BLOCK #{act.blockNumber}
                      </span>
                      <span className="font-bold text-sm text-[#1A1915] font-sans">{act.event}</span>
                    </div>

                    <span className="text-[11px] text-[#7A7568]">{act.time}</span>
                  </div>

                  <p className="text-xs text-[#6B6659] leading-relaxed font-sans">
                    {act.desc}
                  </p>

                  <div className="pt-2 border-t border-[#E8E4DA] flex items-center justify-between text-[11px] text-[#7A7568]">
                    <div className="flex items-center gap-1.5">
                      <span>Tx:</span>
                      <a href={`#tx-${act.txHash}`} className="font-bold text-[#1A1915] hover:text-[#C69214] flex items-center gap-0.5">
                        <span>{act.txHash.slice(0, 10)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <span>{act.gasUsed}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Column 3: Ledger Summary Stats & Intent History */}
        <div className="space-y-4 font-mono">
          <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
            Recorded Ledger History
          </span>

          <div className="ix-card p-5 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#E8E4DA] pb-3">
              <span className="text-[#7A7568]">Recorded Intents:</span>
              <span className="font-bold text-[#1A1915]">{history.length}</span>
            </div>

            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-[#7A7568] text-center py-4 font-sans">No intents matching filter.</p>
              ) : (
                filteredHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.intent.intentId}
                    onClick={() => onSelectIntent && onSelectIntent(item)}
                    className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] hover:border-[#C69214] cursor-pointer transition-all space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C69214]">#{item.intent.intentId.slice(-6).toUpperCase()}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        item.status === 'settled'
                          ? 'bg-[#EAF6ED] text-[#1B5E20]'
                          : item.status === 'slashed_refunded'
                          ? 'bg-[#FDEDEC] text-[#922B21]'
                          : 'bg-[#FAF5E8] text-[#8C6407]'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[#6B6659] text-[11px] font-sans">
                      ${item.intent.sourceAmount.toLocaleString()} USDC ({item.intent.sourceChain} → {item.intent.destinationChain})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
