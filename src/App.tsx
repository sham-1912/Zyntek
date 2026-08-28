import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { UserIntent, SolverBid, PipelineStage, PrioritySliders as SlidersType, SettlementResult } from './services/types';
import { getInitialSolverDefinitions } from './services/solverSimulator';
import { recalculateAllScores } from './services/scoringEngine';
import { contractSimulator } from './services/contractSimulator';
import { ganacheLedger } from './services/ganacheLedger';

import { Header } from './components/Header';
import { DemoScenarioBar } from './components/DemoScenarioBar';
import type { DemoScenarioType } from './components/DemoScenarioBar';
import { NetworkStatusOverview } from './components/NetworkStatusOverview';
import { IntentForm } from './components/IntentForm';
import { SolverBidTable } from './components/SolverBidTable';
import { WhySolverWonCard } from './components/WhySolverWonCard';
import { TransactionLifecycleTracker } from './components/TransactionLifecycleTracker';
import type { LifecycleStepId } from './components/TransactionLifecycleTracker';
import { HybridVerificationPanel } from './components/HybridVerificationPanel';
import { FailureSlashingPanel } from './components/FailureSlashingPanel';
import { ProtocolActivityFeed } from './components/ProtocolActivityFeed';
import type { ActivityLogEntry } from './components/ProtocolActivityFeed';
import { FinalSettlementRecordCard } from './components/FinalSettlementRecordCard';
import { SensitiveDecisionModal } from './components/SensitiveDecisionModal';
import { PreCommitModal } from './components/PreCommitModal';
import { IntentHistoryDrawer } from './components/IntentHistoryDrawer';
import { GanacheBlockLedgerDrawer } from './components/GanacheBlockLedgerDrawer';
import { SolverDashboard } from './components/SolverDashboard';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentIntent, setCurrentIntent] = useState<UserIntent | null>(null);
  const [draftIntent, setDraftIntent] = useState<UserIntent | null>(null);
  const [isPreCommitOpen, setIsPreCommitOpen] = useState<boolean>(false);
  const [sourceAmount, setSourceAmount] = useState<number>(500);

  // Sliders state (auto-balances to 100%)
  const [sliders, setSliders] = useState<SlidersType>({
    cost: 50,
    speed: 30,
    safety: 20,
  });

  // Solvers & Auction state (Strictly 3 registered solvers)
  const [visibleBids, setVisibleBids] = useState<SolverBid[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [arrivalMessage, setArrivalMessage] = useState<string>('');
  const [biddingCountdownSec, setBiddingCountdownSec] = useState<number>(10);
  const [isAuctionClosed, setIsAuctionClosed] = useState<boolean>(false);
  const [winningBidId, setWinningBidId] = useState<string | undefined>(undefined);

  // Lifecycle & Pipeline stage state
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [lifecycleStep, setLifecycleStep] = useState<LifecycleStepId | 'idle'>('idle');
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [failureReason, setFailureReason] = useState<string>('');

  // Hybrid Verification & Sensitive Modal state
  const [activeScenario, setActiveScenario] = useState<DemoScenarioType | null>('happy_path');
  const [verificationType, setVerificationType] = useState<'optimistic' | 'zk_oracle'>('optimistic');
  const [verificationCountdownSec, setVerificationCountdownSec] = useState<number>(10);
  const [isConfirmedByUser, setIsConfirmedByUser] = useState<boolean>(false);
  const [isSensitiveModalOpen, setIsSensitiveModalOpen] = useState<boolean>(false);
  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(false);
  const [isHighValue, setIsHighValue] = useState<boolean>(false);
  const [settlementResult, setSettlementResult] = useState<SettlementResult | null>(null);

  // View Mode: 'user' vs 'solver'
  const [viewMode, setViewMode] = useState<'user' | 'solver'>('user');

  // Activity Logs, Contract state & Drawers
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [isLedgerDrawerOpen, setIsLedgerDrawerOpen] = useState<boolean>(false);
  const [history, setHistory] = useState(contractSimulator.getHistory());
  const [contractState, setContractState] = useState(contractSimulator.getContractState());

  const demoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: ActivityLogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      message,
      type,
    };
    setActivityLogs((prev) => [newEntry, ...prev.slice(0, 40)]);
  };

  const clearAllTimeouts = () => {
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    demoTimeoutsRef.current.push(t);
    return t;
  };

  // Dynamic slider weight change -> Recalculates scores live & triggers Framer Motion reordering
  const handleSlidersChange = (newSliders: SlidersType) => {
    setSliders(newSliders);
    if (visibleBids.length > 0) {
      const recalculated = recalculateAllScores(visibleBids, newSliders);
      const sorted = [...recalculated].sort((a, b) => b.finalScore - a.finalScore);
      setVisibleBids(sorted);
      addLog(`Dynamic weights adjusted: Cost ${newSliders.cost}%, Speed ${newSliders.speed}%, Safety ${newSliders.safety}%`, 'info');
    }
  };

  // Trigger pre-commit modal
  const handlePreCommitTrigger = (intent: UserIntent) => {
    setDraftIntent(intent);
    setIsPreCommitOpen(true);
  };

  // Run full deterministic lifecycle sequence
  const startLifecycleSequence = (intent: UserIntent, scenario: DemoScenarioType = 'happy_path') => {
    clearAllTimeouts();
    setCurrentIntent(intent);
    setActiveScenario(scenario);
    setWinningBidId(undefined);
    setIsAuctionClosed(false);
    setIsFailed(false);
    setIsConfirmedByUser(false);
    setSettlementResult(null);
    setVisibleBids([]);
    setBiddingCountdownSec(10);
    setVerificationCountdownSec(10);

    const isHighVal = scenario === 'high_value' || intent.sourceAmount >= 1000;
    setIsHighValue(isHighVal);
    setVerificationType(isHighVal ? 'zk_oracle' : 'optimistic');

    const raw = getInitialSolverDefinitions(intent.sourceAmount);
    let scoredPool = recalculateAllScores(
      raw.map((b) => ({ ...b, finalScore: 0 })),
      intent.sliders
    ).sort((a, b) => b.finalScore - a.finalScore);

    // If ambiguous scenario, calibrate top 2 scores to within 0.6%
    if (scenario === 'ambiguous') {
      scoredPool = scoredPool.map((b, idx) => {
        if (idx === 0) return { ...b, finalScore: 91.4 };
        if (idx === 1) return { ...b, finalScore: 90.8 };
        return b;
      });
    }

    // 1. Stage: INTENT
    setStage('intent');
    setLifecycleStep('intent_submitted');
    addLog(`INTENT BROADCAST: ${intent.sourceAmount} USDC Ethereum → Solana USDC (#INT-8492)`, 'info');

    // 2. Stage: ESCROW (t = 1.2s)
    addTimeout(() => {
      setStage('escrow');
      setLifecycleStep('funds_locked');
      const b = ganacheLedger.pushIntentTransaction('lockEscrow', intent.intentId, intent.sourceAmount);
      addLog(`[EVM EscrowVault.sol] Locked $${intent.sourceAmount} USDC deposit in Block #${b.number}`, 'success');
    }, 1200);

    // 3. Stage: SOLVER AUCTION (t = 2.4s) — 3 Registered Solvers
    addTimeout(() => {
      setStage('auction');
      setIsBroadcasting(true);
      setArrivalMessage('Searching for registered solvers across decentralized mesh...');
      addLog('SOLVER AUCTION OPEN: 3 registered solvers competing', 'info');

      // Staggered Solver B Arrival
      addTimeout(() => {
        setIsBroadcasting(false);
        setArrivalMessage('✓ Solver B connected (Balanced Executor)');
        setVisibleBids([scoredPool[0]]);
        addLog('SOLVER B (Balanced Executor) submitted bid: Output $' + scoredPool[0].expectedOutput, 'info');
      }, 1000);

      // Staggered Solver A Arrival
      addTimeout(() => {
        setArrivalMessage('✓ Solver A submitted bid (Cost Optimizer)');
        const currentPool = [scoredPool[0], scoredPool[1]];
        setVisibleBids(recalculateAllScores(currentPool, sliders).sort((a, b) => b.finalScore - a.finalScore));
        addLog('SOLVER A (Cost Optimizer) submitted bid: Lowest fee route', 'info');
      }, 2200);

      // Staggered Solver C Arrival
      addTimeout(() => {
        setArrivalMessage('✓ Solver C submitted bid (Speed Specialist)');
        setVisibleBids(recalculateAllScores(scoredPool, sliders).sort((a, b) => b.finalScore - a.finalScore));
        addLog('SOLVER C (Speed Specialist) submitted bid: 28.4s ETA route', 'info');
      }, 3400);

      // Auction Countdown: 10s down to 0
      let timerVal = 10;
      const interval = setInterval(() => {
        timerVal -= 1;
        setBiddingCountdownSec(Math.max(0, timerVal));

        if (timerVal <= 0) {
          clearInterval(interval);
          handleAuctionClose(scenario, scoredPool);
        }
      }, 1000);
      demoTimeoutsRef.current.push(interval as unknown as NodeJS.Timeout);
    }, 2400);
  };

  // Auction close & winner handling
  const handleAuctionClose = (scenario: DemoScenarioType, scoredPool: SolverBid[]) => {
    setIsAuctionClosed(true);
    setArrivalMessage('Auction Closed: Bidding window finalized.');
    addLog('AUCTION CLOSED: Final rankings locked', 'success');

    if (scenario === 'ambiguous') {
      setIsAmbiguous(true);
      setIsSensitiveModalOpen(true);
      addLog('⚠ SENSITIVE DECISION REQUIRED: Top 2 bids tied within 0.6%', 'warn');
      return;
    }

    if (scenario === 'high_value') {
      setIsHighValue(true);
      setIsSensitiveModalOpen(true);
      addLog('⚠ HIGH-VALUE TRANSFER: $1,500 intent requires Oracle Attestation sign-off', 'warn');
      return;
    }

    proceedWithSelectedSolver(scoredPool[0], scenario === 'solver_failure');
  };

  // Execute pipeline stages from Winner selection to Settlement or Failure
  const proceedWithSelectedSolver = (winner: SolverBid, forceFailure = false) => {
    setIsSensitiveModalOpen(false);
    setWinningBidId(winner.solverId);
    setStage('winner');
    setLifecycleStep('solver_selected');
    addLog(`SOLVER SELECTED: ${winner.solverName} (Final Score: ${winner.finalScore}/100)`, 'success');

    // 4. Solver Bond Posted (t = +1.5s)
    addTimeout(() => {
      setStage('commitment');
      setLifecycleStep('bond_posted');
      const b = ganacheLedger.pushIntentTransaction('commitBond', currentIntent ? currentIntent.intentId : '0x0', winner.collateralOfferedUsd);
      addLog(`BOND POSTED: [SolverBonding.sol] Solver locked $${winner.collateralOfferedUsd} in Block #${b.number}`, 'success');
    }, 1500);

    // 5. Cross-Chain Execution on Solana (t = +3.0s)
    addTimeout(() => {
      setStage('execution');
      setLifecycleStep('cross_chain_execution');
      addLog('EXECUTION STARTED: Solana SVM private relayer transaction dispatched', 'info');
    }, 3000);

    // Scenario: Solver Failure (Timeout & Bond Slashing)
    if (forceFailure) {
      addTimeout(() => {
        setIsFailed(true);
        setFailureReason('Solver missed destination execution deadline (Timeout on Solana SVM leg).');
        setStage('slashed_refunded');
        const b = ganacheLedger.pushIntentTransaction('slashBond', currentIntent ? currentIntent.intentId : '0x0', 500);
        addLog('❌ SOLVER FAILURE: Execution deadline exceeded on Solana SVM', 'error');
        addLog(`⚡ FULL BOND SLASHED: $500 collateral confiscated in Block #${b.number}`, 'error');
        addLog('✓ USER PROTECTED: $500 escrow 100% refunded to user account', 'success');
      }, 5000);
      return;
    }

    // 6. Destination Delivery Confirmed (t = +5.0s)
    addTimeout(() => {
      setLifecycleStep('destination_confirmed');
      addLog('DELIVERY CONFIRMED: Solana transaction confirmed in Slot #2847192', 'success');
    }, 5000);

    // 7. Verification Window / Proof Attestation (t = +6.5s)
    addTimeout(() => {
      setStage('verifying');
      setLifecycleStep('verification');
      addLog(
        verificationType === 'zk_oracle'
          ? 'VERIFICATION STARTED: Groth16 ZK-Proof Attestation verified on-chain'
          : 'VERIFICATION STARTED: Optimistic Challenge Window active (10s dispute period)',
        'info'
      );

      // Verification Countdown
      let vTimer = 10;
      const vInterval = setInterval(() => {
        vTimer -= 1;
        setVerificationCountdownSec(Math.max(0, vTimer));

        if (vTimer <= 0) {
          clearInterval(vInterval);
          finalizeSettlement(winner);
        }
      }, 1000);
      demoTimeoutsRef.current.push(vInterval as unknown as NodeJS.Timeout);
    }, 6500);
  };

  // 8. Settlement Finalized
  const finalizeSettlement = (winner: SolverBid) => {
    setStage('settlement');
    setLifecycleStep('settlement_complete');
    const b = ganacheLedger.pushIntentTransaction('settleIntent', currentIntent ? currentIntent.intentId : '0x0', winner.expectedOutput);
    addLog(`✓ SETTLEMENT COMPLETE: $${winner.expectedOutput} USDC released in Block #${b.number}`, 'success');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const res: SettlementResult = {
      intentId: currentIntent ? currentIntent.intentId : `int_${Date.now()}`,
      winningSolverId: winner.solverId,
      escrowReleasedUsd: winner.expectedOutput,
      verificationType: verificationType,
      txHash: b.transactions[0]?.hash || '0x7f3a91b8c42e91...84f29d1',
      success: true,
      executionTimeMs: 12500,
      receipts: [],
    };
    setSettlementResult(res);

    if (currentIntent) {
      contractSimulator.addOrUpdateHistory(currentIntent, 'settled', winner, res);
      setContractState(contractSimulator.getContractState());
      setHistory(contractSimulator.getHistory());
    }
  };

  const handlePreCommitConfirm = (signature: string) => {
    if (!draftIntent) return;
    setIsPreCommitOpen(false);
    const intent: UserIntent = { ...draftIntent, eip712Signature: signature };
    setDraftIntent(null);
    startLifecycleSequence(intent, activeScenario || 'happy_path');
  };

  // Select Scenario 1-click test
  const handleSelectScenario = (scenario: DemoScenarioType) => {
    setActiveScenario(scenario);

    // 5th Scenario: Risk & Collusion Audit
    if (scenario === 'risk_audit') {
      setViewMode('solver');
      addLog('AUDIT TRIGGERED: Switched to Solver Network Risk Monitor (Solver C anomaly highlighted)', 'warn');
      return;
    }

    // Default to User View for active trade flows
    setViewMode('user');

    const amount = scenario === 'high_value' ? 1500 : 500;
    setSourceAmount(amount);

    const demoIntent: UserIntent = {
      intentId: `int_${scenario}_${Date.now().toString(36).substr(2, 6)}`,
      sourceChain: 'ethereum',
      sourceAsset: 'USDC',
      sourceAmount: amount,
      destinationChain: 'solana',
      destinationAsset: 'USDC',
      minAcceptableOutput: Number((amount * 0.985).toFixed(2)),
      deadlineMinutes: 10,
      sliders,
      timestamp: Date.now(),
    };

    startLifecycleSequence(demoIntent, scenario);
  };

  // Hard Reset: Clears simulation state completely & resets ledger to Block #0
  const handleHardReset = () => {
    clearAllTimeouts();
    setCurrentIntent(null);
    setDraftIntent(null);
    setVisibleBids([]);
    setStage('idle');
    setLifecycleStep('idle');
    setIsFailed(false);
    setIsAuctionClosed(false);
    setIsSensitiveModalOpen(false);
    setWinningBidId(undefined);
    setSettlementResult(null);
    setActiveScenario(null);
    setSourceAmount(500);
    setSliders({ cost: 50, speed: 30, safety: 20 });
    ganacheLedger.resetLedger(0);
    addLog('PROTOCOL STATE RESET: Block ledger reset to #0 & clean baseline restored', 'info');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const winningSolver = visibleBids.find((b) => b.solverId === winningBidId) || (isAuctionClosed && visibleBids.length > 0 ? visibleBids[0] : undefined);
  const defaultTopBid = visibleBids.length > 0 ? visibleBids[0] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-[#2B2B2B] relative font-sans">
      <Header
        contractState={contractState}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenLedger={() => setIsLedgerDrawerOpen(true)}
        historyCount={history.length}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        stage={stage}
      />

      {/* Persistent Global Scenario Bar */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
        <DemoScenarioBar
          activeScenario={activeScenario}
          onSelectScenario={handleSelectScenario}
          onResetState={handleHardReset}
        />
      </div>

      {viewMode === 'user' ? (
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10">

          {/* In-Dashboard Sensitive Decision Alert Banner (Directive 7) */}
          {isAmbiguous && !winningBidId && isAuctionClosed && (
            <div className="w-full bg-[#F7E7B5] border-2 border-[#D4A017] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-[#2B2B2B] flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2B2B2B] font-headline uppercase">
                    ⚠ SENSITIVE DECISION REQUIRED — TIE DETECTED
                  </h4>
                  <p className="text-xs text-[#5A5A5A]">
                    Two executions are effectively tied (0.6% difference). Automation paused until manual sign-off.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSensitiveModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-mono text-xs font-bold shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 uppercase"
              >
                <span>Review Bids & Choose →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* =========================================================================
              ROW 2 — ① WHAT IS HAPPENING: ACTIVE INTENT HERO (8 Cols) + NETWORK/TRUST (4 Cols)
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <IntentForm
                onPreCommitTrigger={handlePreCommitTrigger}
                disabled={stage !== 'idle' && stage !== 'settlement' && !isFailed}
                sliders={sliders}
                onSlidersChange={handleSlidersChange}
                sourceAmount={sourceAmount}
                onAmountChange={setSourceAmount}
              />
            </div>

            <div className="lg:col-span-4 flex flex-col">
              <NetworkStatusOverview
                contractState={contractState}
                activeSolversCount={3}
              />
            </div>
          </div>

          {/* =========================================================================
              ROW 3 — ② EXECUTION LIFECYCLE CENTERPIECE (Full Width: 12 Columns)
             ========================================================================= */}
          <div className="w-full">
            <TransactionLifecycleTracker
              currentStepId={lifecycleStep}
              isFailed={isFailed}
              failureReason={failureReason}
              selectedSolverName={winningSolver?.solverName}
              bondAmountUsd={winningSolver?.collateralOfferedUsd || 500}
              intent={currentIntent}
              selectedBid={winningSolver || defaultTopBid || null}
              stage={stage}
            />
          </div>

          {/* =========================================================================
              ROW 4 — ③ WHO IS COMPETING & WHY SOLVER WON (8 Cols + 4 Cols)
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <SolverBidTable
                bids={visibleBids}
                sliders={sliders}
                isBroadcasting={isBroadcasting}
                biddingCountdownSec={biddingCountdownSec}
                arrivalMessage={arrivalMessage}
                isAuctionClosed={isAuctionClosed}
                winningBidId={winningBidId}
                onSelectBid={(b) => proceedWithSelectedSolver(b, activeScenario === 'solver_failure')}
              />
            </div>

            <div className="lg:col-span-4 flex flex-col">
              <WhySolverWonCard
                winningBid={winningSolver}
                topBid={defaultTopBid}
                sliders={sliders}
              />
            </div>
          </div>

          {/* =========================================================================
              ROW 5 — ④ IS IT SAFE & LIVE PROTOCOL STREAM (7 Cols + 5 Cols)
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              {isFailed ? (
                <FailureSlashingPanel
                  solverName={winningSolver?.solverName || 'Solver B (Balanced Executor)'}
                  bondAmountUsd={winningSolver?.collateralOfferedUsd || 500}
                  escrowAmountUsd={currentIntent?.sourceAmount || 500}
                  onReset={handleHardReset}
                />
              ) : (
                <HybridVerificationPanel
                  verificationType={verificationType}
                  countdownSec={verificationCountdownSec}
                  isConfirmedByUser={isConfirmedByUser}
                  onConfirmSettlement={() => {
                    setIsConfirmedByUser(true);
                    if (winningSolver) finalizeSettlement(winningSolver);
                  }}
                  status={stage === 'settlement' ? 'settled' : 'verifying'}
                />
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <ProtocolActivityFeed logs={activityLogs} />
            </div>
          </div>

          {/* =========================================================================
              ROW 6 — ⑤ VISUAL CLIMAX: ✓ INTENT SUCCESSFULLY SETTLED (12 Cols)
             ========================================================================= */}
          {stage === 'settlement' && currentIntent && winningSolver && settlementResult && (
            <div className="w-full">
              <FinalSettlementRecordCard
                intent={currentIntent}
                winningBid={winningSolver}
                settlementResult={settlementResult}
              />
            </div>
          )}
        </main>
      ) : (
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">
          <SolverDashboard history={history} />
        </main>
      )}

      {/* Sensitive Decision Modal */}
      {currentIntent && (
        <SensitiveDecisionModal
          isOpen={isSensitiveModalOpen}
          intent={currentIntent}
          bids={visibleBids}
          isAmbiguous={isAmbiguous}
          isHighValue={isHighValue}
          onApproveBid={(selected) => {
            setIsSensitiveModalOpen(false);
            proceedWithSelectedSolver(selected, activeScenario === 'solver_failure');
          }}
          onConfirmHighValue={() => {
            setIsSensitiveModalOpen(false);
            proceedWithSelectedSolver(visibleBids[0], activeScenario === 'solver_failure');
          }}
          onCancel={handleHardReset}
        />
      )}

      {/* Pre-Commit Confirmation Modal */}
      {draftIntent && (
        <PreCommitModal
          isOpen={isPreCommitOpen}
          intent={draftIntent}
          onConfirm={handlePreCommitConfirm}
          onCancel={() => setIsPreCommitOpen(false)}
        />
      )}

      {/* History Drawer */}
      <IntentHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        history={history}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />

      {/* Live Ganache On-Chain Block Ledger Drawer */}
      <GanacheBlockLedgerDrawer
        isOpen={isLedgerDrawerOpen}
        onClose={() => setIsLedgerDrawerOpen(false)}
      />
    </div>
  );
}
