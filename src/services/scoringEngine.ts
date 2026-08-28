import type { UserIntent, SolverBid, SubScores } from './types';

function normalize(value: number, min: number, max: number): number {
  if (min === max) return 1.0;
  const norm = (value - min) / (max - min);
  return Math.max(0.0, Math.min(1.0, norm));
}

function getMinMax(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max };
}

export function generateSynthesisRationale(bid: SolverBid, rankIndex: number): string {
  if (rankIndex === 0) {
    if (bid.solverProfile === 'alpha') {
      return `Ranked #1: Lowest fee ($${bid.feeUsd}) and highest output ($${bid.proposedOutput}), strongly matching your Cost priority.`;
    } else if (bid.solverProfile === 'flash') {
      return `Ranked #1: Ultra-fast execution (${bid.estimatedExecutionTimeSec}s) and tight slippage (${bid.estimatedSlippagePct}%), matching your Speed priority.`;
    } else {
      return `Ranked #1: Maximum collateral bond ($${bid.collateralOfferedUsd}) and 99/100 reputation, matching your Safety priority.`;
    }
  } else if (rankIndex === 1) {
    return `Ranked #2: Strong competitive offer, closely competing on output and execution time.`;
  } else {
    return `Ranked #3: Higher fee or lower collateral bond compared to top-ranked solvers.`;
  }
}

export function calculateBidScores(intent: UserIntent, rawBids: Omit<SolverBid, 'subScores' | 'finalScore' | 'synthesisRationale'>[]): SolverBid[] {
  const count = rawBids.length;
  if (count === 0) return [];

  const outputs = rawBids.map((b) => b.proposedOutput);
  const feesInverted = rawBids.map((b) => (b.feeUsd === 0 ? 0 : 1 / b.feeUsd));
  const slippagesInverted = rawBids.map((b) => (b.estimatedSlippagePct === 0 ? 0 : 1 / b.estimatedSlippagePct));
  const execTimesInverted = rawBids.map((b) => (b.estimatedExecutionTimeSec === 0 ? 0 : 1 / b.estimatedExecutionTimeSec));
  const reputations = rawBids.map((b) => b.reputationScore);
  const collaterals = rawBids.map((b) => b.collateralOfferedUsd);

  const mmOutput = getMinMax(outputs);
  const mmFeeInv = getMinMax(feesInverted);
  const mmSlippageInv = getMinMax(slippagesInverted);
  const mmExecTimeInv = getMinMax(execTimesInverted);
  const mmReputation = getMinMax(reputations);
  const mmCollateral = getMinMax(collaterals);

  const sliderTotal = intent.sliders.cost + intent.sliders.speed + intent.sliders.safety;
  const userCostWeight = sliderTotal > 0 ? intent.sliders.cost / sliderTotal : 0.333;
  const userSpeedWeight = sliderTotal > 0 ? intent.sliders.speed / sliderTotal : 0.333;
  const userSafetyWeight = sliderTotal > 0 ? intent.sliders.safety / sliderTotal : 0.333;

  const scoredBids: SolverBid[] = rawBids.map((bid) => {
    const outputNorm = normalize(bid.proposedOutput, mmOutput.min, mmOutput.max);
    const feeNorm = normalize(bid.feeUsd === 0 ? 0 : 1 / bid.feeUsd, mmFeeInv.min, mmFeeInv.max);
    const slippageNorm = normalize(bid.estimatedSlippagePct === 0 ? 0 : 1 / bid.estimatedSlippagePct, mmSlippageInv.min, mmSlippageInv.max);
    
    const executionTimeNorm = normalize(
      bid.estimatedExecutionTimeSec === 0 ? 0 : 1 / bid.estimatedExecutionTimeSec,
      mmExecTimeInv.min,
      mmExecTimeInv.max
    );

    const reputationNorm = normalize(bid.reputationScore, mmReputation.min, mmReputation.max);
    const collateralNorm = normalize(bid.collateralOfferedUsd, mmCollateral.min, mmCollateral.max);

    const costScore = (outputNorm + feeNorm + slippageNorm) / 3;
    const speedScore = executionTimeNorm;
    const safetyScore = (reputationNorm + collateralNorm) / 2;

    const finalScore = userCostWeight * costScore + userSpeedWeight * speedScore + userSafetyWeight * safetyScore;

    const subScores: SubScores = {
      costScore: Number(costScore.toFixed(3)),
      speedScore: Number(speedScore.toFixed(3)),
      safetyScore: Number(safetyScore.toFixed(3)),
      outputNorm: Number(outputNorm.toFixed(3)),
      feeNorm: Number(feeNorm.toFixed(3)),
      slippageNorm: Number(slippageNorm.toFixed(3)),
      executionTimeNorm: Number(executionTimeNorm.toFixed(3)),
      reputationNorm: Number(reputationNorm.toFixed(3)),
      collateralNorm: Number(collateralNorm.toFixed(3)),
    };

    return {
      ...bid,
      subScores,
      finalScore: Number(finalScore.toFixed(3)),
    };
  });

  const sorted = scoredBids.sort((a, b) => b.finalScore - a.finalScore);

  return sorted.map((bid, idx) => ({
    ...bid,
    synthesisRationale: generateSynthesisRationale(bid, idx),
  }));
}

export function checkAmbiguity(bids: SolverBid[], threshold = 0.05): { isAmbiguous: boolean; scoreGap: number } {
  if (bids.length < 2) return { isAmbiguous: false, scoreGap: 1.0 };
  const gap = Math.abs(bids[0].finalScore - bids[1].finalScore);
  return {
    isAmbiguous: gap <= threshold,
    scoreGap: Number(gap.toFixed(3)),
  };
}

export function isHighValueIntent(intent: UserIntent, threshold = 1000): boolean {
  return intent.sourceAmount >= threshold;
}
