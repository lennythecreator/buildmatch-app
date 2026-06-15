import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

interface CollisionSparkProps {
  animatedStyle: object;
}

export function CollisionSpark({ animatedStyle }: CollisionSparkProps) {
  return <Animated.View style={[styles.spark, animatedStyle]} />;
}

const styles = StyleSheet.create({
  spark: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
});
