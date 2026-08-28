import type { UserIntent, SolverBid } from './types';
import { calculateSolverScore } from './scoringEngine';

export function getInitialSolverDefinitions(intentAmount: number): Omit<SolverBid, 'finalScore'>[] {
  const base = intentAmount || 500;

  return [
    {
      solverId: 'solver_b',
      solverName: 'SOLVER B — Balanced Executor',
      expectedOutput: Number((base * 0.995).toFixed(2)),
      proposedOutput: Number((base * 0.995).toFixed(2)),
      feeUsd: 1.20,
      etaSec: 42.8,
      estimatedExecutionTimeSec: 42.8,
      liquidityUsd: 42500,
      safetyRating: 94,
      reputationScore: 94,
      solverProfile: 'flash',
      solverAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      subScores: {
        costScore: 92.0,
        speedScore: 91.0,
        safetyScore: 94.0,
      },
      routeDescription: 'Balanced Fast Path (Ethereum Escrow → Solana Raydium Pool)',
      collateralOfferedUsd: Number((base * 1.0).toFixed(2)),
    },
    {
      solverId: 'solver_a',
      solverName: 'SOLVER A — Cost Optimizer',
      expectedOutput: Number((base * 0.998).toFixed(2)),
      proposedOutput: Number((base * 0.998).toFixed(2)),
      feeUsd: 0.80,
      etaSec: 52.1,
      estimatedExecutionTimeSec: 52.1,
      liquidityUsd: 35000,
      safetyRating: 87,
      reputationScore: 87,
      solverProfile: 'alpha',
      solverAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      subScores: {
        costScore: 98.0,
        speedScore: 72.0,
        safetyScore: 87.0,
      },
      routeDescription: 'Lowest Fee Direct Routing (Aggregated EVM DEX Pool → Orca SVM)',
      collateralOfferedUsd: Number((base * 1.0).toFixed(2)),
    },
    {
      solverId: 'solver_c',
      solverName: 'SOLVER C — Speed Specialist',
      expectedOutput: Number((base * 0.991).toFixed(2)),
      proposedOutput: Number((base * 0.991).toFixed(2)),
      feeUsd: 2.40,
      etaSec: 28.4,
      estimatedExecutionTimeSec: 28.4,
      liquidityUsd: 47300,
      safetyRating: 91,
      reputationScore: 91,
      solverProfile: 'shield',
      solverAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      subScores: {
        costScore: 82.0,
        speedScore: 98.0,
        safetyScore: 91.0,
      },
      routeDescription: 'High-Speed Atomic Routing (Private Relayer Mempool → Solana SVM)',
      collateralOfferedUsd: Number((base * 1.0).toFixed(2)),
    },
  ];
}

export function generateSolverBids(intent: UserIntent): SolverBid[] {
  const raw = getInitialSolverDefinitions(intent.sourceAmount);
  return raw.map((b) => ({
    ...b,
    finalScore: calculateSolverScore(b.subScores, intent.sliders),
  })).sort((a, b) => b.finalScore - a.finalScore);
}
