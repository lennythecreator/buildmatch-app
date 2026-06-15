import { View } from 'react-native';

export function FeedbackWatermark() {
  return (
    <View className="relative items-center justify-center px-12 py-12">
      <View
        className="absolute rounded-full"
        style={{
          left: '12%',
          right: '12%',
          top: '12%',
          bottom: '12%',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
        }}
      />
      <View className="h-64 w-64 items-center justify-center rounded-full border-2 border-secondary/20">
        <View className="h-32 w-32 items-center justify-center rounded-full bg-foreground/5">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
            <View className="h-8 w-8 rounded-full bg-secondary/30" />
          </View>
        </View>
      </View>
    </View>
  );
}
