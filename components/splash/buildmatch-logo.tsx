import { Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';

interface BuildMatchLogoProps {
  revealProgress: SharedValue<number>;
  accentColor: string;
  textColor: string;
}

const FONT_SIZE = 48;

export function BuildMatchLogo({ revealProgress, accentColor, textColor }: BuildMatchLogoProps) {
  const uildWidth = useSharedValue(0);
  const atchWidth = useSharedValue(0);

  const handleUildLayout = (e: LayoutChangeEvent) => {
    uildWidth.value = e.nativeEvent.layout.width;
  };

  const handleAtchLayout = (e: LayoutChangeEvent) => {
    atchWidth.value = e.nativeEvent.layout.width;
  };

  const uildContainerStyle = useAnimatedStyle(() => ({
    width: revealProgress.value * uildWidth.value,
    overflow: 'hidden',
    opacity: interpolate(revealProgress.value, [0, 0.3], [0, 1]),
  }));

  const atchContainerStyle = useAnimatedStyle(() => ({
    width: revealProgress.value * atchWidth.value,
    overflow: 'hidden',
    opacity: interpolate(revealProgress.value, [0, 0.3], [0, 1]),
  }));

  const baseTextStyle = {
    fontSize: FONT_SIZE,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    includeFontPadding: false,
  } as const;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ ...baseTextStyle, color: accentColor }} allowFontScaling={false}>
        B
      </Text>
      <Animated.View style={uildContainerStyle}>
        <Text
          style={{ ...baseTextStyle, color: textColor }}
          allowFontScaling={false}
          onLayout={handleUildLayout}
        >
          uild
        </Text>
      </Animated.View>
      <Text style={{ ...baseTextStyle, color: accentColor }} allowFontScaling={false}>
        M
      </Text>
      <Animated.View style={atchContainerStyle}>
        <Text
          style={{ ...baseTextStyle, color: textColor }}
          allowFontScaling={false}
          onLayout={handleAtchLayout}
        >
          atch
        </Text>
      </Animated.View>
    </View>
  );
}
