import type { UserIntent, SolverBid } from './types';
import { calculateSolverScore } from './scoringEngine';

export function getInitialSolverDefinitions(intentAmount: number): Omit<SolverBid, 'finalScore'>[] {
  const base = intentAmount || 500;

  return [
    {
      solverId: 'solver_01_alpha',
      solverName: 'SOLVER 01 — Alpha Route',
      expectedOutput: Number((base * 0.993).toFixed(2)),
      proposedOutput: Number((base * 0.993).toFixed(2)),
      feeUsd: 1.80,
      etaSec: 18,
      estimatedExecutionTimeSec: 18,
      liquidityUsd: 120000,
      safetyRating: 89,
      reputationScore: 89,
      solverProfile: 'alpha',
      solverAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      subScores: {
        costScore: 96.0,
        speedScore: 71.0,
        safetyScore: 89.0,
      },
      routeDescription: 'Aggregated EVM DEX Pool → Raydium Solana Swap (Lowest Fee)',
      collateralOfferedUsd: Number((base * 1.05).toFixed(2)),
    },
    {
      solverId: 'solver_02_flash',
      solverName: 'SOLVER 02 — Flash Relay',
      expectedOutput: Number((base * 0.985).toFixed(2)),
      proposedOutput: Number((base * 0.985).toFixed(2)),
      feeUsd: 4.50,
      etaSec: 3.5,
      estimatedExecutionTimeSec: 3.5,
      liquidityUsd: 84000,
      safetyRating: 92,
      reputationScore: 92,
      solverProfile: 'flash',
      solverAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      subScores: {
        costScore: 81.0,
        speedScore: 99.0,
        safetyScore: 92.0,
      },
      routeDescription: 'Direct Private Flashbot Relayer → Orca Fast-Path Settlement',
      collateralOfferedUsd: Number((base * 1.10).toFixed(2)),
    },
    {
      solverId: 'solver_03_shield',
      solverName: 'SOLVER 03 — Shield Vault',
      expectedOutput: Number((base * 0.989).toFixed(2)),
      proposedOutput: Number((base * 0.989).toFixed(2)),
      feeUsd: 2.80,
      etaSec: 9,
      estimatedExecutionTimeSec: 9,
      liquidityUsd: 250000,
      safetyRating: 98,
      reputationScore: 98,
      solverProfile: 'shield',
      solverAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      subScores: {
        costScore: 88.0,
        speedScore: 84.0,
        safetyScore: 98.0,
      },
      routeDescription: 'Institutional Escrow Channel → ZK-Verified Bridge',
      collateralOfferedUsd: Number((base * 1.50).toFixed(2)),
    },
    {
      solverId: 'solver_04_nexus',
      solverName: 'SOLVER 04 — Nexus Mesh',
      expectedOutput: Number((base * 0.991).toFixed(2)),
      proposedOutput: Number((base * 0.991).toFixed(2)),
      feeUsd: 2.20,
      etaSec: 14,
      estimatedExecutionTimeSec: 14,
      liquidityUsd: 65000,
      safetyRating: 86,
      reputationScore: 86,
      solverProfile: 'alpha',
      solverAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      subScores: {
        costScore: 92.0,
        speedScore: 78.0,
        safetyScore: 86.0,
      },
      routeDescription: 'Cross-L2 Fast Liquidity Hub → Solana SVM Node',
      collateralOfferedUsd: Number((base * 1.08).toFixed(2)),
    },
    {
      solverId: 'solver_05_horizon',
      solverName: 'SOLVER 05 — Horizon Flow',
      expectedOutput: Number((base * 0.988).toFixed(2)),
      proposedOutput: Number((base * 0.988).toFixed(2)),
      feeUsd: 3.10,
      etaSec: 6,
      estimatedExecutionTimeSec: 6,
      liquidityUsd: 180000,
      safetyRating: 95,
      reputationScore: 95,
      solverProfile: 'flash',
      solverAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
      subScores: {
        costScore: 86.0,
        speedScore: 91.0,
        safetyScore: 95.0,
      },
      routeDescription: 'Multi-Path Private Mempool → Solana Atomic Program',
      collateralOfferedUsd: Number((base * 1.25).toFixed(2)),
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
