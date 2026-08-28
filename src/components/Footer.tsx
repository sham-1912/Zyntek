import React from 'react';

interface FooterProps {
  solversActiveCount?: number;
  intentsPendingCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  solversActiveCount = 142,
  intentsPendingCount = 1204,
}) => {
  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-[#E8E4DA] py-3 px-6 text-[11px] font-mono text-[#7A7568] flex flex-wrap items-center justify-between gap-4">
      
      {/* Left: Network Operational Metrics */}
      <div className="flex items-center gap-2 tracking-wide uppercase">
        <span className="w-2 h-2 rounded-full bg-[#C69214] inline-block animate-pulse" />
        <span>NETWORK OPERATIONAL</span>
        <span className="text-[#C5BEB0]">•</span>
        <span>{solversActiveCount} SOLVERS ACTIVE</span>
        <span className="text-[#C5BEB0]">•</span>
        <span>{intentsPendingCount.toLocaleString()} INTENTS PENDING</span>
      </div>

      {/* Right: Docs & Security Links */}
      <div className="flex items-center gap-6 tracking-wide text-[#7A7568]">
        <a href="#docs" className="hover:text-[#1A1915] transition-colors">DOCS</a>
        <a href="#privacy" className="hover:text-[#1A1915] transition-colors">PRIVACY</a>
        <a href="#security" className="hover:text-[#1A1915] transition-colors">SECURITY</a>
      </div>

    </footer>
  );
};
