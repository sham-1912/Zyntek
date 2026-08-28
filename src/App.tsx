import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { UserIntent, SolverBid, PipelineStage, VerificationType, SettlementResult, BlockReceipt } from './services/types';
import { generateSolverBids } from './services/solverSimulator';
import { checkAmbiguity, isHighValueIntent } from './services/scoringEngine';
import { contractSimulator } from './services/contractSimulator';

import { Header } from './components/Header';
import { LandingPrimerBar } from './components/LandingPrimerBar';
import { IntentForm } from './components/IntentForm';
import { SolverBidTable } from './components/SolverBidTable';
import { SensitiveDecisionModal } from './components/SensitiveDecisionModal';
import { PipelineStatusTracker } from './components/PipelineStatusTracker';
import { PreCommitModal } from './components/PreCommitModal';
import { IntentHistoryDrawer } from './components/IntentHistoryDrawer';
import { JudgeToolsPanel } from './components/JudgeToolsPanel';
import { BlockExplorerModal } from './components/BlockExplorerModal';
import { SolverDashboard } from './components/SolverDashboard';
import { JudgePresetsBar } from './components/JudgePresetsBar';
import { CrossChainVisualizer } from './components/CrossChainVisualizer';

import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'user' | 'solver'>('user');

  const [currentIntent, setCurrentIntent] = useState<UserIntent | null>(null);
  const [draftIntent, setDraftIntent] = useState<UserIntent | null>(null);
  const [isPreCommitOpen, setIsPreCommitOpen] = useState<boolean>(false);

  const [bids, setBids] = useState<SolverBid[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [verificationType, setVerificationType] = useState<VerificationType>('optimistic');
  const [selectedBid, setSelectedBid] = useState<SolverBid | null>(null);
  const [settlementResult, setSettlementResult] = useState<SettlementResult | undefined>(undefined);

  // Timers & countdown state
  const [biddingCountdownSec, setBiddingCountdownSec] = useState<number>(5);
  const [autoProceedCountdownSec, setAutoProceedCountdownSec] = useState<number | null>(null);
  const [challengeCountdownSec, setChallengeCountdownSec] = useState<number>(15);
  const [subStatusText, setSubStatusText] = useState<string>('');

  // Sensitive decision state
  const [isSensitiveModalOpen, setIsSensitiveModalOpen] = useState<boolean>(false);
  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(false);
  const [scoreGap, setScoreGap] = useState<number>(0);
  const [isHighValue, setIsHighValue] = useState<boolean>(false);

  // History & explorer drawer state
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [activeReceiptForExplorer, setActiveReceiptForExplorer] = useState<BlockReceipt | undefined>(undefined);
  const [history, setHistory] = useState(contractSimulator.getHistory());
  const [contractState, setContractState] = useState(contractSimulator.getContractState());

  const updateContractState = () => {
    setContractState(contractSimulator.getContractState());
    setHistory(contractSimulator.getHistory());
  };

  // Step 1: User fills form and clicks broadcast -> Trigger Pre-Commit Modal
  const handlePreCommitTrigger = (intent: UserIntent) => {
    setDraftIntent(intent);
    setIsPreCommitOpen(true);
  };

  // Step 2: Confirm Pre-Commit EIP-712 Signature
  const handlePreCommitConfirm = (signature: string) => {
    if (!draftIntent) return;
    setIsPreCommitOpen(false);
    const intent: UserIntent = { ...draftIntent, eip712Signature: signature };
    setCurrentIntent(intent);
    setDraftIntent(null);

    setBids([]);
    setSelectedBid(null);
    setSettlementResult(undefined);
    setStage('escrow_mining');
    setSubStatusText('Confirming EVM Escrow deposit on Ganache localnet (Chain #5777)...');

    const highVal = isHighValueIntent(intent);
    setIsHighValue(highVal);
    setVerificationType(highVal ? 'zk_oracle' : 'optimistic');

    contractSimulator.addOrUpdateHistory(intent, 'escrow_mining');
    updateContractState();

    // Stage 3 & 4: Staggered simulation timeline
    setTimeout(() => {
      setStage('broadcasting_solvers');
      setIsBroadcasting(true);
      setSubStatusText('Broadcasting intent to 3 distributed Ganache solver accounts...');

      const allBids = generateSolverBids(intent);

      setTimeout(() => {
        setBids([allBids[0]]);
        setIsBroadcasting(false);
        setStage('bidding_window');
        setSubStatusText('Solver A (Alpha) bid received (1/3).');
      }, 1200);

      setTimeout(() => {
        setBids([allBids[0], allBids[1]]);
        setSubStatusText('Solver B (Flash) bid received (2/3).');
      }, 2500);

      setTimeout(() => {
        setBids(allBids);
        setSubStatusText('Solver C (Shield) bid received (3/3). Auction complete.');

        const ambCheck = checkAmbiguity(allBids);
        setIsAmbiguous(ambCheck.isAmbiguous);
        setScoreGap(ambCheck.scoreGap);

        if (ambCheck.isAmbiguous || highVal) {
          setIsSensitiveModalOpen(true);
        } else {
          setAutoProceedCountdownSec(3);
        }
      }, 3800);
    }, 2000);
  };

  // Bidding window 5s countdown effect
  useEffect(() => {
    if (stage === 'bidding_window' && biddingCountdownSec > 0) {
      const timer = setInterval(() => {
        setBiddingCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, biddingCountdownSec]);

  // Auto-proceed countdown effect for clear winner
  useEffect(() => {
    if (autoProceedCountdownSec !== null && autoProceedCountdownSec > 0 && stage === 'bidding_window' && bids.length === 3) {
      const timer = setInterval(() => {
        setAutoProceedCountdownSec((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            executePipeline(bids[0], false);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [autoProceedCountdownSec, stage, bids]);

  // Challenge window 15s countdown effect during verification
  useEffect(() => {
    if (stage === 'verifying' && challengeCountdownSec > 0) {
      const timer = setInterval(() => {
        setChallengeCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, challengeCountdownSec]);

  // Step 3: Accept Bid & Execute Pipeline with Sub-Status Updates
  const executePipeline = async (solver: SolverBid, forceFailure = false) => {
    if (!currentIntent) return;

    setSelectedBid(solver);
    setIsSensitiveModalOpen(false);
    setAutoProceedCountdownSec(null);

    // Stage 2: Lock EVM Escrow
    setStage('escrow_locked');
    setSubStatusText('Confirming EVM Escrow deposit transaction on Ganache...');
    await contractSimulator.lockUserEscrow(currentIntent);
    contractSimulator.addOrUpdateHistory(currentIntent, 'escrow_locked', solver);
    updateContractState();

    // Stage 5: Commit Solver Collateral Bond
    setStage('solver_committed');
    setSubStatusText(`Winning Solver (${solver.solverName}) transferring $${solver.collateralOfferedUsd} collateral bond to SolverBonding.sol...`);
    await contractSimulator.commitSolverBond(currentIntent, solver);
    contractSimulator.addOrUpdateHistory(currentIntent, 'solver_committed', solver);
    updateContractState();

    // Stage 6: Paced Multi-Substep Solana Execution (6s total delay)
    setStage('executing_cross_chain');
    setSubStatusText('Substep 1/3: Solver broadcasting transaction on Solana network...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubStatusText('Substep 2/3: Awaiting block finality confirmation (Slot #2847192)...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubStatusText('Substep 3/3: Finalizing cross-chain delivery attestation proof...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Stage 7: Hybrid Verification
    setStage('verifying');
    setChallengeCountdownSec(15);
    setSubStatusText(
      verificationType === 'zk_oracle'
        ? 'Stage 7: Verifying ZK/Oracle attestation proof on-chain...'
        : 'Stage 7: Optimistic challenge window active (0:15). Monitoring for challenges...'
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Stage 8 or 9: Final Settlement or Slashing
    const result = await contractSimulator.executeVerificationAndSettlement(
      currentIntent,
      solver,
      forceFailure,
      forceFailure ? 'Solver failed to confirm Solana destination delivery within deadline' : undefined
    );

    setSettlementResult(result);
    const finalStage = result.success ? 'settled' : 'slashed_refunded';
    setStage(finalStage);
    setSubStatusText(result.success ? '✓ Stage 8: Settlement finalized on Ganache!' : '⚠ Stage 9: Verification Failed. Bond slashed & user refunded.');
    
    contractSimulator.addOrUpdateHistory(currentIntent, finalStage, solver, result);
    updateContractState();

    if (result.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setCurrentIntent(null);
    setDraftIntent(null);
    setBids([]);
    setStage('idle');
    setSettlementResult(undefined);
    setIsSensitiveModalOpen(false);
    setIsPreCommitOpen(false);
    setAutoProceedCountdownSec(null);
    setBiddingCountdownSec(5);
    setSubStatusText('');
  };

  const handleSelectPreset = (intentData: Partial<UserIntent>, _autoSubmit = false, forceFailure = false) => {
    const fullIntent: UserIntent = {
      intentId: `intent_preset_${Date.now().toString(36)}`,
      sourceChain: intentData.sourceChain || 'ethereum',
      sourceAsset: intentData.sourceAsset || 'USDC',
      sourceAmount: intentData.sourceAmount || 500,
      destinationChain: intentData.destinationChain || 'solana',
      destinationAsset: intentData.destinationAsset || 'USDC',
      minAcceptableOutput: intentData.minAcceptableOutput || 495,
      deadlineMinutes: 10,
      sliders: intentData.sliders || { cost: 50, speed: 30, safety: 20 },
      timestamp: Date.now(),
    };

    if (forceFailure && selectedBid) {
      executePipeline(selectedBid, true);
    } else {
      handlePreCommitTrigger(fullIntent);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white relative">
      <Header
        contractState={contractState}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        historyCount={history.length}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Render View Mode: Solver Dashboard vs. User View */}
        {viewMode === 'solver' ? (
          <SolverDashboard history={history} />
        ) : (
          <>
            {/* Judge Presets Bar */}
            <JudgePresetsBar
              onSelectPreset={handleSelectPreset}
              isPipelineRunning={stage !== 'idle' && stage !== 'settled' && stage !== 'slashed_refunded'}
            />

            {/* Stage 0: Landing Bar & Live Stats */}
            <LandingPrimerBar contractState={contractState} />

            {/* Cross-Chain Live Visualizer */}
            <CrossChainVisualizer
              intent={currentIntent}
              selectedBid={selectedBid}
              stage={stage}
            />

            {/* Banner */}
            <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-indigo-900/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold gradient-text">Decentralized Intent Solver Marketplace</h2>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  State desired financial outcomes without manually navigating bridges or routes. Independent solvers compete on cost, speed, and safety, backed by EVM escrow, hybrid verifiers, and full-bond slashing accountability.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset State</span>
                </button>
              </div>
            </div>

            {/* Stage 1: Intent Form & Status Tracker Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <IntentForm onPreCommitTrigger={handlePreCommitTrigger} disabled={stage !== 'idle' && stage !== 'bidding_window'} />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <PipelineStatusTracker
                  stage={stage}
                  verificationType={verificationType}
                  challengeCountdownSec={challengeCountdownSec}
                  subStatusText={subStatusText}
                  settlementResult={settlementResult}
                  intentId={currentIntent?.intentId}
                  solverBondUsd={selectedBid?.collateralOfferedUsd}
                  intentAmountUsd={currentIntent?.sourceAmount}
                />
              </div>
            </div>

            {/* Stage 3 & 4: Solver Bids Table Section */}
            {(bids.length > 0 || isBroadcasting) && currentIntent && (
              <SolverBidTable
                bids={bids}
                intent={currentIntent}
                isBroadcasting={isBroadcasting}
                biddingCountdownSec={biddingCountdownSec}
                autoProceedCountdownSec={autoProceedCountdownSec}
                onSelectBid={(bid) => executePipeline(bid, false)}
                selectedBidId={selectedBid?.solverId}
                isAmbiguous={isAmbiguous}
                scoreGap={scoreGap}
                isHighValue={isHighValue}
                onCancelAutoProceed={() => setAutoProceedCountdownSec(null)}
              />
            )}
          </>
        )}
      </main>

      {/* Pre-Commit EIP-712 Signature Confirmation Modal */}
      {draftIntent && (
        <PreCommitModal
          isOpen={isPreCommitOpen}
          intent={draftIntent}
          onConfirm={handlePreCommitConfirm}
          onCancel={() => setIsPreCommitOpen(false)}
        />
      )}

      {/* Sensitive Decision Modal */}
      {currentIntent && (
        <SensitiveDecisionModal
          isOpen={isSensitiveModalOpen}
          intent={currentIntent}
          bids={bids}
          isAmbiguous={isAmbiguous}
          isHighValue={isHighValue}
          onApproveBid={(bid) => executePipeline(bid, false)}
          onCancel={handleReset}
        />
      )}

      {/* Stage 10: Intent History Drawer */}
      <IntentHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        history={history}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />

      {/* Stage 9: Collapsed Judge Debug Instrumentation Panel */}
      {currentIntent && selectedBid && stage !== 'settled' && stage !== 'slashed_refunded' && (
        <JudgeToolsPanel
          onTriggerFailure={() => executePipeline(selectedBid, true)}
          disabled={stage === 'verifying'}
        />
      )}

      {/* In-App Block Explorer Modal */}
      {settlementResult?.receipts && settlementResult.receipts.length > 0 && (
        <BlockExplorerModal
          isOpen={!!activeReceiptForExplorer}
          receipt={activeReceiptForExplorer || settlementResult.receipts[0]}
          onClose={() => setActiveReceiptForExplorer(undefined)}
        />
      )}

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        Zyntek Protocol &copy; 2026 | CSI ORIGIN Problem Statement #10 | Cross-Chain Intent Solver Network
      </footer>
    </div>
  );
}
