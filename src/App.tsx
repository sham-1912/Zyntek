import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { UserIntent, SolverBid, PipelineStage, VerificationType, SettlementResult } from './services/types';
import { generateSolverBids } from './services/solverSimulator';
import { checkAmbiguity, isHighValueIntent } from './services/scoringEngine';
import { contractSimulator } from './services/contractSimulator';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { IntentForm } from './components/IntentForm';
import { SolversMarketplace } from './components/SolversMarketplace';
import { PipelineStatusTracker } from './components/PipelineStatusTracker';
import { MyIntentsTable } from './components/MyIntentsTable';
import { SettlementSummaryCard } from './components/SettlementSummaryCard';
import { DashboardView } from './components/DashboardView';
import { ActivityLogView } from './components/ActivityLogView';
import { PreCommitModal } from './components/PreCommitModal';
import { SensitiveDecisionModal } from './components/SensitiveDecisionModal';
import { JudgeToolsPanel } from './components/JudgeToolsPanel';
import { SolverDashboard } from './components/SolverDashboard';
import { NotificationDrawer } from './components/NotificationDrawer';
import type { NotificationItem } from './components/NotificationDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'swap' | 'dashboard' | 'intents' | 'solvers' | 'result' | 'activity'>('swap');
  const [viewMode, setViewMode] = useState<'user' | 'solver'>('user');

  const [currentIntent, setCurrentIntent] = useState<UserIntent | null>(null);
  const [draftIntent, setDraftIntent] = useState<UserIntent | null>(null);
  const [isPreCommitOpen, setIsPreCommitOpen] = useState<boolean>(false);

  // Notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Ledger Contract Active',
      desc: 'ZyntekIntentLedger smart contract deployed on Ganache (Chain #1337 / #5777).',
      time: 'Just now',
      type: 'info',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Solver Network Operational',
      desc: '142 solver nodes active with $284.5M TVL ready to execute cross-chain intents.',
      time: '5m ago',
      type: 'info',
      read: false,
    },
  ]);

  const addNotification = (item: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

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

  // Contract state & history
  const [history, setHistory] = useState(contractSimulator.getHistory());
  const [, setContractState] = useState(contractSimulator.getContractState());

  const updateContractState = () => {
    setContractState(contractSimulator.getContractState());
    setHistory(contractSimulator.getHistory());
  };

  // Step 1: Form trigger pre-commit modal
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
    setSubStatusText('Confirming EVM Escrow deposit on Ganache localnet...');

    const highVal = isHighValueIntent(intent);
    setIsHighValue(highVal);
    setVerificationType(highVal ? 'zk_oracle' : 'optimistic');

    contractSimulator.addOrUpdateHistory(intent, 'escrow_mining');
    updateContractState();

    addNotification({
      title: 'Escrow Lock Initiated',
      desc: `EVM Escrow deposit of $${intent.sourceAmount.toLocaleString()} USDC signed and submitted to Ganache.`,
      type: 'info',
    });

    // Automatically switch to /solvers to view live auction bidding competition!
    setActiveTab('solvers');

    // Staggered solver bidding timeline
    setTimeout(() => {
      setStage('broadcasting_solvers');
      setIsBroadcasting(true);
      setSubStatusText('Broadcasting intent parameters to 3 distributed Ganache solvers...');

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
      }, 2400);

      setTimeout(() => {
        setBids(allBids);
        setSubStatusText('Solver C (Shield) bid received (3/3). Auction complete.');

        addNotification({
          title: 'Solver Bidding Complete',
          desc: '3 competitive solver bids received. Highest score: NexusRoute (AlphaNode).',
          type: 'info',
        });

        const ambCheck = checkAmbiguity(allBids);
        setIsAmbiguous(ambCheck.isAmbiguous);
        setScoreGap(ambCheck.scoreGap);

        if (ambCheck.isAmbiguous || highVal) {
          setIsSensitiveModalOpen(true);
        } else {
          setAutoProceedCountdownSec(3);
        }
      }, 3600);
    }, 1500);
  };

  // Bidding window countdown effect
  useEffect(() => {
    if (stage === 'bidding_window' && biddingCountdownSec > 0) {
      const timer = setInterval(() => {
        setBiddingCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, biddingCountdownSec]);

  // Auto-proceed countdown effect
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

  // Challenge window countdown effect
  useEffect(() => {
    if (stage === 'verifying' && challengeCountdownSec > 0) {
      const timer = setInterval(() => {
        setChallengeCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, challengeCountdownSec]);

  // Step 3: Execute Pipeline
  const executePipeline = async (solver: SolverBid, forceFailure = false) => {
    if (!currentIntent) return;

    setSelectedBid(solver);
    setIsSensitiveModalOpen(false);
    setAutoProceedCountdownSec(null);

    // Switch to /intents live execution telemetry view!
    setActiveTab('intents');

    // Stage 2: Escrow Locked
    setStage('escrow_locked');
    setSubStatusText('Confirming EVM Escrow deposit on Ganache...');
    await contractSimulator.lockUserEscrow(currentIntent);
    contractSimulator.addOrUpdateHistory(currentIntent, 'escrow_locked', solver);
    updateContractState();

    // Stage 5: Solver Bond Committed
    setStage('solver_committed');
    setSubStatusText(`Winning Solver (${solver.solverName}) committing $${solver.collateralOfferedUsd} collateral bond...`);
    await contractSimulator.commitSolverBond(currentIntent, solver);
    contractSimulator.addOrUpdateHistory(currentIntent, 'solver_committed', solver);
    updateContractState();

    addNotification({
      title: 'Solver Assigned & Bond Committed',
      desc: `${solver.solverName} committed $${solver.collateralOfferedUsd} collateral bond on Ganache.`,
      type: 'info',
    });

    // Stage 6: Cross-Chain Transit Execution
    setStage('executing_cross_chain');
    setSubStatusText('Substep 1/3: Solver broadcasting cross-chain transaction...');
    await new Promise((r) => setTimeout(r, 1500));
    setSubStatusText('Substep 2/3: Awaiting destination block finality confirmation...');
    await new Promise((r) => setTimeout(r, 1500));
    setSubStatusText('Substep 3/3: Finalizing cross-chain delivery attestation proof...');
    await new Promise((r) => setTimeout(r, 1500));

    // Stage 7: Hybrid Verification
    setStage('verifying');
    setChallengeCountdownSec(15);
    setSubStatusText(
      verificationType === 'zk_oracle'
        ? 'Verifying ZK/Oracle attestation proof on-chain...'
        : 'Optimistic challenge window active (0:15)...'
    );
    await new Promise((r) => setTimeout(r, 2500));

    // Stage 8 / 9: Settlement or Slashing
    const result = await contractSimulator.executeVerificationAndSettlement(
      currentIntent,
      solver,
      forceFailure,
      forceFailure ? 'Solver failed to deliver destination asset within deadline' : undefined
    );

    setSettlementResult(result);
    const finalStage = result.success ? 'settled' : 'slashed_refunded';
    setStage(finalStage);
    setSubStatusText(result.success ? '✓ Settlement finalized on Ganache!' : '⚠ Verification Failed. Bond slashed & user refunded.');

    contractSimulator.addOrUpdateHistory(currentIntent, finalStage, solver, result);
    updateContractState();

    addNotification({
      title: result.success ? 'Settlement Finalized' : 'Solver Stake Slashed',
      desc: result.success
        ? `Cross-chain intent settled. Outcome delivered on destination chain.`
        : 'Solver failed delivery within deadline. User escrow refunded & solver bond slashed.',
      type: result.success ? 'success' : 'slashed',
    });

    // Switch to /result page view!
    setActiveTab('result');

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
    setSelectedBid(null);
    setSettlementResult(undefined);
    setIsSensitiveModalOpen(false);
    setIsPreCommitOpen(false);
    setAutoProceedCountdownSec(null);
    setBiddingCountdownSec(5);
    setSubStatusText('');
    setActiveTab('swap');
  };

  const handleSelectHistoricalIntent = (item: (typeof history)[0]) => {
    setCurrentIntent(item.intent);
    if (item.winningBid) setSelectedBid(item.winningBid);
    if (item.result) setSettlementResult(item.result);
    setStage(item.status);
    setActiveTab('intents');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1915]">
      
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      <div className="flex-1 flex w-full">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingIntentsCount={history.filter((h) => h.status !== 'settled' && h.status !== 'slashed_refunded').length}
        />

        {/* Main Content Area with Smooth Page Transition */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            
            {/* Solver Operator View Mode */}
            {viewMode === 'solver' ? (
              <SolverDashboard history={history} />
            ) : (
              <>
              {/* Route 1: /dashboard */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigate={setActiveTab}
                  intentsCount={history.length > 0 ? history.length : 1204}
                />
              )}

              {/* Route 2: /swap (Create Intent Form & Live Interactive Workflow) */}
              {activeTab === 'swap' && (
                <div className="space-y-8">
                  <IntentForm
                    onPreCommitTrigger={handlePreCommitTrigger}
                    disabled={stage !== 'idle' && stage !== 'settled' && stage !== 'slashed_refunded'}
                  />

                  {/* Live Bids Auction Section on /swap */}
                  {(bids.length > 0 || isBroadcasting) && currentIntent && (
                    <SolversMarketplace
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

                  {/* Live Execution Telemetry Pipeline Tracker on /swap */}
                  {stage !== 'idle' && (
                    <PipelineStatusTracker
                      stage={stage}
                      verificationType={verificationType}
                      challengeCountdownSec={challengeCountdownSec}
                      subStatusText={subStatusText}
                      settlementResult={settlementResult}
                      intentId={currentIntent?.intentId}
                      solverBondUsd={selectedBid?.collateralOfferedUsd}
                      intentAmountUsd={currentIntent?.sourceAmount}
                      solverName={selectedBid?.solverName}
                    />
                  )}

                  {/* Final Settlement Result Breakdown Card on /swap */}
                  {settlementResult && (
                    <SettlementSummaryCard
                      result={settlementResult}
                      onResetToSwap={handleReset}
                    />
                  )}
                </div>
              )}

              {/* Route 3: /solvers (Marketplace Directory & Live Auction Bidding) */}
              {activeTab === 'solvers' && (
                <SolversMarketplace
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

              {/* Route 4: /intents (Live Execution Telemetry & My Intents History) */}
              {activeTab === 'intents' && (
                <div className="space-y-8">
                  {stage !== 'idle' && (
                    <PipelineStatusTracker
                      stage={stage}
                      verificationType={verificationType}
                      challengeCountdownSec={challengeCountdownSec}
                      subStatusText={subStatusText}
                      settlementResult={settlementResult}
                      intentId={currentIntent?.intentId}
                      solverBondUsd={selectedBid?.collateralOfferedUsd}
                      intentAmountUsd={currentIntent?.sourceAmount}
                      solverName={selectedBid?.solverName}
                    />
                  )}

                  <MyIntentsTable
                    history={history}
                    onSelectIntent={handleSelectHistoricalIntent}
                  />
                </div>
              )}

              {/* Route 5: /result (Settlement Result Breakdown / Slashing Proof) */}
              {activeTab === 'result' && (
                <div>
                  {settlementResult ? (
                    <SettlementSummaryCard
                      result={settlementResult}
                      onResetToSwap={() => setActiveTab('swap')}
                    />
                  ) : (
                    <div className="ix-card p-12 text-center space-y-3">
                      <p className="text-sm font-sans text-[#7A7568]">No settlement result available yet. Execute an intent to view results!</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('swap')}
                        className="ix-btn-gold px-4 py-2 text-xs font-bold uppercase"
                      >
                        Create Intent
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Route 6: /activity (Protocol Event Stream & Ledger History) */}
              {activeTab === 'activity' && (
                <ActivityLogView
                  history={history}
                  onSelectIntent={handleSelectHistoricalIntent}
                />
              )}
            </>
          )}
          </div>
        </main>
      </div>

      {/* Real-time Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
      />

      {/* Pre-Commit EIP-712 Signature Modal */}
      {draftIntent && (
        <PreCommitModal
          isOpen={isPreCommitOpen}
          intent={draftIntent}
          onConfirm={handlePreCommitConfirm}
          onCancel={() => setIsPreCommitOpen(false)}
        />
      )}

      {/* Sensitive Decision Checkpoint Modal */}
      {currentIntent && (
        <SensitiveDecisionModal
          isOpen={isSensitiveModalOpen}
          intent={currentIntent}
          bids={bids}
          isAmbiguous={isAmbiguous}
          isHighValue={isHighValue}
          onApproveBid={(bid) => executePipeline(bid, false)}
          onCancel={() => setIsSensitiveModalOpen(false)}
        />
      )}

      {/* Judge Tools Simulation Controls */}
      {currentIntent && selectedBid && stage !== 'settled' && stage !== 'slashed_refunded' && (
        <JudgeToolsPanel
          onTriggerFailure={() => executePipeline(selectedBid, true)}
          disabled={stage === 'verifying'}
        />
      )}

      {/* Bottom Status Bar / Footer */}
      <Footer
        solversActiveCount={142}
        intentsPendingCount={history.length > 0 ? history.length : 1204}
      />

    </div>
  );
}
