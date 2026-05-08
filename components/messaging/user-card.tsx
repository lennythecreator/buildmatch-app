import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatConversationPreviewTime, getInitials } from './messaging-utils';

interface UserCardProps {
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isUnread?: boolean;
  unreadCount?: number;
  onPress?: () => void;
}

export function UserCard({
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  isUnread = false,
  unreadCount = 0,
  onPress,
}: UserCardProps) {
  const initials = getInitials(name.split(' ')[0], name.split(' ').slice(1).join(' '));
  const timeLabel = formatConversationPreviewTime(lastMessageAt);

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-1 py-3 active:opacity-80">
      <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} contentFit="cover" className="h-full w-full" />
        ) : (
          <Text className="text-sm font-semibold text-foreground/70">{initials}</Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between gap-3">
          <Text className={['text-base font-medium text-foreground', isUnread ? 'text-foreground' : 'text-foreground/90'].join(' ')} numberOfLines={1}>
            {name}
          </Text>
          {timeLabel ? <Text className="text-xs text-muted">{timeLabel}</Text> : null}
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Text className={['flex-1 text-sm', isUnread ? 'font-medium text-foreground' : 'text-muted'].join(' ')} numberOfLines={1}>
            {lastMessage || 'Start a conversation'}
          </Text>
          {isUnread ? (
            <View className="ml-2 rounded-full bg-accent/10 px-2.5 py-1">
              <Text className="text-xs font-semibold text-accent">{unreadCount > 0 ? unreadCount : 'New'}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}