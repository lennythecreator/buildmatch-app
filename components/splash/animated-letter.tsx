import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

interface AnimatedLetterProps {
  letter: string;
  animatedStyle: object;
  color: string;
  fontSize?: number;
}

export function AnimatedLetter({ letter, animatedStyle, color, fontSize = 52 }: AnimatedLetterProps) {
  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={{
          color,
          fontSize,
          fontFamily: 'PlusJakartaSans_800ExtraBold',
          includeFontPadding: false,
        }}
        allowFontScaling={false}
      >
        {letter}
      </Text>
    </Animated.View>
  );
}
