import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSplashAnimation } from '@/hooks/use-splash-animation';
import { AnimatedLetter } from '@/components/splash/animated-letter';
import { CollisionSpark } from '@/components/splash/collision-spark';
import { BuildMatchLogo } from '@/components/splash/buildmatch-logo';

interface SplashScreenProps {
  onComplete: () => void;
}

const ACCENT_COLOR = '#39F3BB';
const TEXT_COLOR = '#FFFFFF';

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { letterBStyle, letterMStyle, sparkStyle, splashStyle, revealProgress, start } =
    useSplashAnimation(onComplete);
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWordmark(true), 580);
    start();
    return () => clearTimeout(timer);
  }, [start]);

  return (
    <Animated.View style={[styles.container, splashStyle]}>
      <View style={styles.content}>
        {showWordmark ? (
          <BuildMatchLogo
            revealProgress={revealProgress}
            accentColor={ACCENT_COLOR}
            textColor={TEXT_COLOR}
          />
        ) : (
          <View style={styles.lettersRow}>
            <AnimatedLetter letter="B" animatedStyle={letterBStyle} color={ACCENT_COLOR} />
            <AnimatedLetter letter="M" animatedStyle={letterMStyle} color={ACCENT_COLOR} />
          </View>
        )}
      </View>
      <CollisionSpark animatedStyle={sparkStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09090D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
