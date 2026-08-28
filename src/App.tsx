import { useState } from 'react';
import confetti from 'canvas-confetti';
import type { UserIntent, SolverBid, PipelineStage, VerificationType, SettlementResult } from './services/types';
import { generateSolverBids } from './services/solverSimulator';
import { checkAmbiguity, isHighValueIntent } from './services/scoringEngine';
import { contractSimulator } from './services/contractSimulator';

import { Header } from './components/Header';
import { IntentForm } from './components/IntentForm';
import { SolverBidTable } from './components/SolverBidTable';
import { SensitiveDecisionModal } from './components/SensitiveDecisionModal';
import { PipelineStatusTracker } from './components/PipelineStatusTracker';
import { FailureSlashingPanel } from './components/FailureSlashingPanel';

import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentIntent, setCurrentIntent] = useState<UserIntent | null>(null);
  const [bids, setBids] = useState<SolverBid[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [verificationType, setVerificationType] = useState<VerificationType>('optimistic');
  const [selectedBid, setSelectedBid] = useState<SolverBid | null>(null);
  const [settlementResult, setSettlementResult] = useState<SettlementResult | undefined>(undefined);

  // Sensitive decision state
  const [isSensitiveModalOpen, setIsSensitiveModalOpen] = useState<boolean>(false);
  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(false);
  const [scoreGap, setScoreGap] = useState<number>(0);
  const [isHighValue, setIsHighValue] = useState<boolean>(false);

  const [contractState, setContractState] = useState(contractSimulator.getContractState());

  const updateContractState = () => {
    setContractState(contractSimulator.getContractState());
  };

  // Step 1: Submit Intent
  const handleIntentSubmit = (intent: UserIntent) => {
    setCurrentIntent(intent);
    setBids([]);
    setSelectedBid(null);
    setSettlementResult(undefined);
    setStage('intent_submitted');
    setIsBroadcasting(true);

    const highVal = isHighValueIntent(intent);
    setIsHighValue(highVal);
    setVerificationType(highVal ? 'zk_oracle' : 'optimistic');

    // Simulate 1.2s broadcast delay
    setTimeout(() => {
      const generatedBids = generateSolverBids(intent);
      setBids(generatedBids);
      setIsBroadcasting(false);
      setStage('bidding');

      // Ambiguity check
      const ambCheck = checkAmbiguity(generatedBids);
      setIsAmbiguous(ambCheck.isAmbiguous);
      setScoreGap(ambCheck.scoreGap);

      // Trigger sensitive decision modal if ambiguous OR high-value
      if (ambCheck.isAmbiguous || highVal) {
        setIsSensitiveModalOpen(true);
      }
    }, 1200);
  };

  // Step 2: Accept Bid & Execute Pipeline
  const executePipeline = async (solver: SolverBid, forceFailure = false) => {
    if (!currentIntent) return;

    setSelectedBid(solver);
    setIsSensitiveModalOpen(false);

    // 1. Lock EVM Escrow
    setStage('escrow_locked');
    await contractSimulator.lockUserEscrow(currentIntent);
    updateContractState();

    // 2. Commit Solver Collateral Bond
    setStage('solver_committed');
    await contractSimulator.commitSolverBond(currentIntent, solver);
    updateContractState();

    // 3. Solana Cross-Chain Leg Execution
    setStage('executing_cross_chain');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 4. Hybrid Verification
    setStage('verifying');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 5. Final Settlement or Slashing
    const result = await contractSimulator.executeVerificationAndSettlement(
      currentIntent,
      solver,
      forceFailure,
      forceFailure ? 'Solver failed to confirm Solana destination delivery' : undefined
    );

    setSettlementResult(result);
    setStage(result.success ? 'settled' : 'slashed_refunded');
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
    setBids([]);
    setStage('idle');
    setSettlementResult(undefined);
    setIsSensitiveModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Header contractState={contractState} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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

        {/* Intent Form & Status Tracker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <IntentForm onSubmit={handleIntentSubmit} disabled={stage !== 'idle' && stage !== 'bidding'} />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <PipelineStatusTracker
              stage={stage}
              verificationType={verificationType}
              settlementResult={settlementResult}
              intentId={currentIntent?.intentId}
            />

            {/* Forced Slashing Panel when bidding or execution is ready */}
            {currentIntent && selectedBid && stage !== 'settled' && stage !== 'slashed_refunded' && (
              <FailureSlashingPanel
                onTriggerFailure={() => executePipeline(selectedBid, true)}
                disabled={stage === 'verifying'}
              />
            )}
          </div>
        </div>

        {/* Solver Bids Table Section */}
        {bids.length > 0 && currentIntent && (
          <SolverBidTable
            bids={bids}
            intent={currentIntent}
            isBroadcasting={isBroadcasting}
            onSelectBid={(bid) => executePipeline(bid, false)}
            selectedBidId={selectedBid?.solverId}
            isAmbiguous={isAmbiguous}
            scoreGap={scoreGap}
          />
        )}
      </main>

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

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        Zyntek Protocol &copy; 2026 | CSI ORIGIN Problem Statement #10 | Cross-Chain Intent Solver Network
      </footer>
    </div>
  );
}
