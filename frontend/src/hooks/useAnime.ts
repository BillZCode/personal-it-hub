import { useEffect, useRef } from 'react';
import * as anime from 'animejs';
import { animate, stagger } from 'animejs';
import type { AnimationParams, JSAnimation, TargetsParam } from 'animejs';

/**
 * useAnime
 * Hook helper for integrating Anime.js v4 animations safely into React lifecycles.
 * Handles element references, automatic execution, and cleanup on unmount.
 */
export function useAnime(
  paramsCreator: (target: HTMLElement | null) => AnimationParams | null | undefined,
  deps: React.DependencyList = []
) {
  const targetRef = useRef<any>(null);
  const animationRef = useRef<JSAnimation | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    const config = paramsCreator(targetRef.current);
    if (!config) return;

    animationRef.current = animate(targetRef.current, config);

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, deps);

  return { targetRef, animationRef, anime };
}

export { anime, animate, stagger };
export type { AnimationParams, JSAnimation, TargetsParam };
