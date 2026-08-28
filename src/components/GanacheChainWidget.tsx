import React, { useEffect, useState } from 'react';
import { testGanacheConnection } from '../services/ganacheRpc';
import { Cpu, CheckCircle2, Copy, Activity } from 'lucide-react';

interface GanacheChainWidgetProps {
  lastTxHash?: string;
  lastBlockNumber?: number;
}

export const GanacheChainWidget: React.FC<GanacheChainWidgetProps> = ({ lastTxHash, lastBlockNumber }) => {
  const [currentBlock, setCurrentBlock] = useState<number>(lastBlockNumber || 12);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (lastBlockNumber) {
      setCurrentBlock(lastBlockNumber);
    }
  }, [lastBlockNumber]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await testGanacheConnection();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyHash = () => {
    if (!lastTxHash) return;
    navigator.clipboard.writeText(lastTxHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-lg">
      {/* Network Status Badge */}
      <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            Ganache Localnet
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            1337
          </span>
        </div>
      </div>

      {/* Block Counter */}
      <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3 font-mono text-xs">
        <Activity className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-400">Block:</span>
        <span className="font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
          #{currentBlock}
        </span>
      </div>

      {/* Last Transaction Hash */}
      {lastTxHash ? (
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="text-slate-500 text-[11px]">Last TX:</span>
          <span className="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
            {lastTxHash.slice(0, 8)}...{lastTxHash.slice(-6)}
          </span>
          <button
            onClick={handleCopyHash}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy TX Hash"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        <span className="text-[11px] font-mono text-slate-500">Auto-Mining Active</span>
      )}
    </div>
  );
};
