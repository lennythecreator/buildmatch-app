import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIMING = {
  PULL: 500,
  COLLISION: 80,
  REVEAL: 950,
  FADE: 350,
} as const;

const COLLISION_START = TIMING.PULL;
const REVEAL_START = COLLISION_START + TIMING.COLLISION;
const FADE_START = REVEAL_START + TIMING.REVEAL;

export type RevealProgress = SharedValue<number>;

export function useSplashAnimation(onComplete: () => void) {
  const letterBX = useSharedValue(-SCREEN_WIDTH);
  const letterMX = useSharedValue(SCREEN_WIDTH);
  const letterScale = useSharedValue(1);
  const sparkOpacity = useSharedValue(0);
  const sparkScale = useSharedValue(0.5);
  const revealProgress = useSharedValue(0);
  const splashOpacity = useSharedValue(1);
  const hasStarted = useSharedValue(false);

  const start = useCallback(() => {
    if (hasStarted.value) return;
    hasStarted.value = true;

    // Phase 1: Magnetic Pull (0ms - 500ms)
    letterBX.value = withTiming(0, { duration: TIMING.PULL, easing: Easing.in(Easing.ease) });
    letterMX.value = withTiming(0, { duration: TIMING.PULL, easing: Easing.in(Easing.ease) });

    // Phase 2: Collision & Spark (500ms - 580ms)
    letterScale.value = withDelay(
      COLLISION_START,
      withSequence(
        withTiming(1.08, { duration: TIMING.COLLISION }),
        withTiming(1, { duration: TIMING.COLLISION }),
      ),
    );

    sparkOpacity.value = withDelay(
      COLLISION_START,
      withSequence(withTiming(1, { duration: 30 }), withTiming(0, { duration: 50 })),
    );

    sparkScale.value = withDelay(
      COLLISION_START,
      withSequence(
        withTiming(2, { duration: 30, easing: Easing.out(Easing.ease) }),
        withTiming(0.5, { duration: 50, easing: Easing.in(Easing.ease) }),
      ),
    );

    // Phase 3: BuildMatch Reveal (580ms - 1530ms)
    revealProgress.value = withDelay(
      REVEAL_START,
      withTiming(1, { duration: TIMING.REVEAL, easing: Easing.out(Easing.ease) }),
    );

    // Phase 4: Fade Out (1530ms - 1880ms)
    splashOpacity.value = withDelay(
      FADE_START,
      withTiming(0, { duration: TIMING.FADE, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      }),
    );
  }, [onComplete]);

  const letterBStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: letterBX.value }, { scale: letterScale.value }],
  }));

  const letterMStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: letterMX.value }, { scale: letterScale.value }],
  }));

  const sparkStyle = useAnimatedStyle(() => ({
    opacity: sparkOpacity.value,
    transform: [{ scale: sparkScale.value }],
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return {
    letterBStyle,
    letterMStyle,
    sparkStyle,
    splashStyle,
    revealProgress,
    start,
  };
}
