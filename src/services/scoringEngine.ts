import type { PrioritySliders, SolverBid, SubScores } from './types';

export function calculateSolverScore(
  subScores: SubScores,
  sliders: PrioritySliders
): number {
  const total = sliders.cost + sliders.speed + sliders.safety;
  const costWeight = total > 0 ? sliders.cost / total : 0.3333;
  const speedWeight = total > 0 ? sliders.speed / total : 0.3333;
  const safetyWeight = total > 0 ? sliders.safety / total : 0.3333;

  const finalScore =
    subScores.costScore * costWeight +
    subScores.speedScore * speedWeight +
    subScores.safetyScore * safetyWeight;

  return Number(finalScore.toFixed(1));
}

export function recalculateAllScores(
  bids: SolverBid[],
  sliders: PrioritySliders
): SolverBid[] {
  return bids.map((bid) => {
    const finalScore = calculateSolverScore(bid.subScores, sliders);
    return {
      ...bid,
      finalScore,
    };
  });
}

export function getSliderMeaningPreview(sliders: PrioritySliders): string {
  if (sliders.cost >= sliders.speed && sliders.cost >= sliders.safety) {
    return `You're prioritizing Cost (${sliders.cost}%) — maximum asset output and lowest fees.`;
  } else if (sliders.speed >= sliders.cost && sliders.speed >= sliders.safety) {
    return `You're prioritizing Speed (${sliders.speed}%) — ultra-fast execution (~3.5s) and lowest latency.`;
  } else {
    return `You're prioritizing Safety (${sliders.safety}%) — maximum collateral bond guarantee and 98+ reputation.`;
  }
}
