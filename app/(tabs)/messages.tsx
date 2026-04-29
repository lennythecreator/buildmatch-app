import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-foreground">Messages</Text>
      </View>
    </View>
  );
}

