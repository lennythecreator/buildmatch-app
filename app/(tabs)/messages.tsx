import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Conversations } from '@/components/messaging/conversations';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <Conversations />
    </View>
  );
}

