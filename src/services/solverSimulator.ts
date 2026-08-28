import type { UserIntent, SolverBid } from './types';
import { calculateBidScores } from './scoringEngine';

export function generateSolverBids(intent: UserIntent): SolverBid[] {
  const baseAmount = intent.sourceAmount;

  // 1. Solver A: Alpha Route (Focused on Lowest Cost / Max Output)
  const solverA: Omit<SolverBid, 'subScores' | 'finalScore'> = {
    solverId: 'solver_a_alpha',
    solverName: 'Alpha Solver (Cost-Optimized)',
    solverProfile: 'alpha',
    solverAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Ganache Account #1
    proposedOutput: Number((baseAmount * 0.992).toFixed(2)), // Very high output
    feeUsd: 1.5, // Lowest fee
    estimatedSlippagePct: 0.15,
    estimatedExecutionTimeSec: 24.0, // Slower execution
    collateralOfferedUsd: Number((baseAmount * 1.05).toFixed(2)),
    reputationScore: 88,
    routeDescription: 'Aggregated EVM Liquidity Pool → Raydium Solana Swap (Optimized Fee Route)',
  };

  // 2. Solver B: Flash Route (Focused on Speed)
  const solverB: Omit<SolverBid, 'subScores' | 'finalScore'> = {
    solverId: 'solver_b_flash',
    solverName: 'Flash Solver (Speed-Optimized)',
    solverProfile: 'flash',
    solverAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Ganache Account #2
    proposedOutput: Number((baseAmount * 0.985).toFixed(2)),
    feeUsd: 6.8, // Higher fee for priority execution
    estimatedSlippagePct: 0.05, // Ultra tight slippage
    estimatedExecutionTimeSec: 3.5, // Ultra fast execution
    collateralOfferedUsd: Number((baseAmount * 1.10).toFixed(2)),
    reputationScore: 92,
    routeDescription: 'Direct Private Flashbot Relayer → Orca Fast-Path Settlement',
  };

  // 3. Solver C: Shield Route (Focused on Safety & Reputation)
  const solverC: Omit<SolverBid, 'subScores' | 'finalScore'> = {
    solverId: 'solver_c_shield',
    solverName: 'Shield Solver (Safety-Optimized)',
    solverProfile: 'shield',
    solverAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // Ganache Account #3
    proposedOutput: Number((baseAmount * 0.989).toFixed(2)),
    feeUsd: 3.2, // Moderate fee
    estimatedSlippagePct: 0.1,
    estimatedExecutionTimeSec: 10.0, // Moderate speed
    collateralOfferedUsd: Number((baseAmount * 1.50).toFixed(2)), // 150% maximum bond guarantee
    reputationScore: 99, // Highest reputation
    routeDescription: 'Institutional Escrow Channel → ZK-Verified Solana Bridge',
  };

  const rawBids = [solverA, solverB, solverC];

  // Calculate dynamic scores based on user sliders
  return calculateBidScores(intent, rawBids);
}
