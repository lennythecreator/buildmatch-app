import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import type { Message as MessageType } from '@/lib/api/types';

import { formatMessageTime, getInitials } from './messaging-utils';

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
  deliveryStatus?: 'sent' | 'delivered';
}

export function Message({ message, isOwnMessage, deliveryStatus = isOwnMessage ? 'sent' : 'delivered' }: MessageProps) {
  const senderName = `${message.sender.firstName} ${message.sender.lastName}`.trim();
  const initials = getInitials(message.sender.firstName, message.sender.lastName);
  const timeLabel = formatMessageTime(message.createdAt);

  return (
    <View className={['flex-row gap-2', isOwnMessage ? 'justify-end' : 'justify-start'].join(' ')}>
      {!isOwnMessage ? (
        <View className="mt-1 h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-200">
          {message.sender.avatarUrl ? (
            <Image source={{ uri: message.sender.avatarUrl }} contentFit="cover" className="h-full w-full" />
          ) : (
            <Text className="text-[10px] font-semibold text-foreground/70">{initials}</Text>
          )}
        </View>
      ) : null}

      <View className={['max-w-[82%] rounded-3xl px-4 py-3', isOwnMessage ? 'bg-accent' : 'bg-surface border border-border'].join(' ')}>
        {!isOwnMessage ? <Text className="mb-1 text-xs font-semibold text-foreground/60">{senderName}</Text> : null}

        <Text className={['text-base leading-6', isOwnMessage ? 'text-accent-foreground' : 'text-foreground'].join(' ')}>
          {message.deletedAt ? 'This message was deleted.' : message.content}
        </Text>

        <View className="mt-2 flex-row items-center gap-2">
          <Text className={['text-xs', isOwnMessage ? 'text-accent-foreground/75' : 'text-muted'].join(' ')}>{timeLabel}</Text>
          <Text className={['text-xs font-medium uppercase tracking-widest', isOwnMessage ? 'text-accent-foreground/75' : 'text-muted'].join(' ')}>
            {deliveryStatus}
          </Text>
        </View>
      </View>
    </View>
  );
}