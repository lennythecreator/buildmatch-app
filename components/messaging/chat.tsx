import { IconArrowLeft } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import type { Message as MessageType } from '@/lib/api/types';

import { Composer } from './composer';
import { Message } from './message';

interface ChatProps {
  contactName: string;
  contactAvatarUrl?: string;
  currentUserId: string;
  messages: MessageType[];
  isLoading?: boolean;
  isSending?: boolean;
  onBack: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export function Chat({
  contactName,
  contactAvatarUrl,
  currentUserId,
  messages,
  isLoading = false,
  isSending = false,
  onBack,
  onSendMessage,
}: ChatProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages.length]);

  async function handleSendMessage() {
    const content = messageText.trim();
    if (!content) {
      return;
    }

    await onSendMessage(content);
    setMessageText('');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-3 border-b border-border bg-surface px-4 py-4">
          <Pressable onPress={onBack} hitSlop={10} className="rounded-full bg-slate-100 p-2.5 active:opacity-80">
            <IconArrowLeft size={18} color="#0f172a" />
          </Pressable>

          <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-200">
            {contactAvatarUrl ? (
              <Image source={{ uri: contactAvatarUrl }} contentFit="cover" className="h-full w-full" />
            ) : (
              <Text className="text-sm font-semibold text-foreground/70">{contactName.slice(0, 2).toUpperCase()}</Text>
            )}
          </View>

          <View className="flex-1 gap-0.5">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
              {contactName}
            </Text>
            <Text className="text-xs text-muted">Message thread</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12, flexGrow: 1 }}
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-16">
              <Text className="text-sm font-medium text-muted">Loading conversation...</Text>
            </View>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === currentUserId}
                deliveryStatus={message.senderId === currentUserId ? 'sent' : 'delivered'}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center gap-2 py-16">
              <Text className="text-center text-lg font-semibold text-foreground">Start the conversation</Text>
              <Text className="text-center text-sm text-muted">
                Send the first message to begin the thread with {contactName}.
              </Text>
            </View>
          )}
        </ScrollView>

        <Composer
          value={messageText}
          onChangeText={setMessageText}
          onSend={() => void handleSendMessage()}
          isSending={isSending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}