import { useState, useEffect } from 'react';

interface UseAnimatedNumberOptions {
  duration?: number;
  decimals?: number;
}

export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const { duration = 1000, decimals = 0 } = options;
  const [currentValue, setCurrentValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = currentValue;
    const diff = targetValue - startValue;

    if (diff === 0) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutCubic easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + diff * easeProgress;

      setCurrentValue(Number(nextValue.toFixed(decimals)));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration, decimals]);

  return currentValue;
}
