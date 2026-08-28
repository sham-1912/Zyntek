import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { UserIntent, SolverBid, PipelineStage, PrioritySliders as SlidersType, SettlementResult } from './services/types';
import { getInitialSolverDefinitions } from './services/solverSimulator';
import { recalculateAllScores } from './services/scoringEngine';
import { contractSimulator } from './services/contractSimulator';

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

  // Solvers & Auction state
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

  // Activity Logs & Contract state
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
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

    // If ambiguous scenario, calibrate top 2 scores to within 1.6%
    if (scenario === 'ambiguous') {
      scoredPool = scoredPool.map((b, idx) => {
        if (idx === 0) return { ...b, finalScore: 91.4 };
        if (idx === 1) return { ...b, finalScore: 89.9 };
        return b;
      });
    }

    // 1. Stage: INTENT
    setStage('intent');
    setLifecycleStep('intent_submitted');
    addLog(`Intent #${intent.intentId} broadcast: ${intent.sourceAmount} USDC (Ethereum) → USDC (Solana)`, 'info');

    // 2. Stage: ESCROW (t = 1.2s)
    addTimeout(() => {
      setStage('escrow');
      setLifecycleStep('funds_locked');
      addLog(`[EVM EscrowVault.sol] Locked $${intent.sourceAmount} USDC deposit on Ethereum`, 'success');
    }, 1200);

    // 3. Stage: SOLVER AUCTION (t = 2.4s)
    addTimeout(() => {
      setStage('auction');
      setIsBroadcasting(true);
      setArrivalMessage('Searching for solvers across decentralized mesh...');
      addLog('Solver Auction opened: Live competitive bidding started', 'info');

      // Staggered Solver 01 Arrival
      addTimeout(() => {
        setIsBroadcasting(false);
        setArrivalMessage('✓ Solver 01 connected (Alpha Route)');
        setVisibleBids([scoredPool[0]]);
        addLog('Solver 01 (Alpha) submitted route: Expected output $' + scoredPool[0].expectedOutput, 'info');
      }, 1000);

      // Staggered Solver 02 Arrival
      addTimeout(() => {
        setArrivalMessage('✓ Solver 02 submitted bid (Flash Relay)');
        const currentPool = [scoredPool[0], scoredPool[1]];
        setVisibleBids(recalculateAllScores(currentPool, sliders).sort((a, b) => b.finalScore - a.finalScore));
        addLog('Solver 02 (Flash) submitted bid: 3.5s ETA route', 'info');
      }, 2200);

      // Staggered Solver 03 Arrival
      addTimeout(() => {
        setArrivalMessage('✓ Solver 03 submitted bid (Shield Vault)');
        const currentPool = [scoredPool[0], scoredPool[1], scoredPool[2]];
        setVisibleBids(recalculateAllScores(currentPool, sliders).sort((a, b) => b.finalScore - a.finalScore));
        addLog('Solver 03 (Shield) submitted bid: $250K liquidity verified', 'info');
      }, 3400);

      // Staggered Solver 04 & 05 Arrival
      addTimeout(() => {
        setArrivalMessage('✓ Solvers 04 & 05 submitted bids (Nexus & Horizon)');
        setVisibleBids(recalculateAllScores(scoredPool, sliders).sort((a, b) => b.finalScore - a.finalScore));
        addLog('Auction Pool complete: 5 independent solver bids evaluated', 'success');
      }, 4600);

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
    addLog('Solver Auction closed: Final rankings locked', 'success');

    if (scenario === 'ambiguous') {
      setIsAmbiguous(true);
      setIsSensitiveModalOpen(true);
      addLog('⚠ Sensitive Decision Gate: Top 2 bids within 1.6% score difference', 'warn');
      return;
    }

    if (scenario === 'high_value') {
      setIsHighValue(true);
      setIsSensitiveModalOpen(true);
      addLog('⚠ Sensitive Decision Gate: High-Value Intent ($1,500) requires ZK-Oracle sign-off', 'warn');
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
    addLog(`Winner Selected: ${winner.solverName} (Final Score: ${winner.finalScore}/100)`, 'success');

    // 4. Solver Bond Posted (t = +1.5s)
    addTimeout(() => {
      setStage('commitment');
      setLifecycleStep('bond_posted');
      addLog(`[SolverBonding.sol] Solver locked $${winner.collateralOfferedUsd} collateral bond`, 'success');
    }, 1500);

    // 5. Cross-Chain Execution on Solana (t = +3.0s)
    addTimeout(() => {
      setStage('execution');
      setLifecycleStep('cross_chain_execution');
      addLog('Solana SVM Execution initiated via private relayer...', 'info');
    }, 3000);

    // Scenario: Solver Failure (Timeout & Bond Slashing)
    if (forceFailure) {
      addTimeout(() => {
        setIsFailed(true);
        setFailureReason('Solver missed destination execution deadline (Timeout on Solana SVM leg).');
        setStage('slashed_refunded');
        addLog('❌ EXECUTION FAILED: Solver timeout error detected on Solana SVM', 'error');
        addLog('⚡ Full $500 Solver Collateral Bond Slashed via SolverBonding.sol', 'error');
        addLog('✓ User Escrow 100% Refunded & Protected', 'success');
      }, 5000);
      return;
    }

    // 6. Destination Delivery Confirmed (t = +5.0s)
    addTimeout(() => {
      setLifecycleStep('destination_confirmed');
      addLog('Solana Destination Delivery Confirmed: Transaction finalized (Slot #2847192)', 'success');
    }, 5000);

    // 7. Verification Window / Proof Attestation (t = +6.5s)
    addTimeout(() => {
      setStage('verifying');
      setLifecycleStep('verification');
      addLog(
        verificationType === 'zk_oracle'
          ? 'Enhanced ZK-Oracle Proof Attestation verified on-chain'
          : 'Optimistic Challenge Window active (10s dispute period)',
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
    addLog(`✓ Settlement Finalized: Released $${winner.expectedOutput} USDC to recipient on Solana`, 'success');

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
      txHash: '0x8f2a18b...77e9',
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

  const handleReset = () => {
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
        historyCount={history.length}
        viewMode="user"
        onToggleViewMode={() => {}}
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* =========================================================================
            ROW 1 — DEMO SCENARIOS (Full Width: 12 Columns)
           ========================================================================= */}
        <div className="w-full">
          <DemoScenarioBar
            activeScenario={activeScenario}
            onSelectScenario={handleSelectScenario}
          />
        </div>

        {/* =========================================================================
            ROW 2 — ACTIVE INTENT (8 Columns) + NETWORK STATUS (4 Columns)
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
              activeSolversCount={visibleBids.length > 0 ? visibleBids.length : 5}
            />
          </div>
        </div>

        {/* =========================================================================
            ROW 3 — CROSS-CHAIN EXECUTION (Full Width: 12 Columns Horizontal Card)
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
            ROW 4 — SOLVER COMPETITION (8 Columns) + WHY SOLVER WON (4 Columns)
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
            ROW 5 — VERIFICATION (7 Columns) + PROTOCOL ACTIVITY LOG (5 Columns)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            {isFailed ? (
              <FailureSlashingPanel
                solverName={winningSolver?.solverName || 'Solver 02 (Flash Relay)'}
                bondAmountUsd={winningSolver?.collateralOfferedUsd || 500}
                escrowAmountUsd={currentIntent?.sourceAmount || 500}
                onReset={handleReset}
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
            ROW 6 — FINAL SETTLEMENT RECORD (Full Width: 12 Columns, 3-Col Internal Grid)
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
          onCancel={handleReset}
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
    </div>
  );
}
