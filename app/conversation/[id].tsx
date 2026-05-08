import { Chat } from '@/components/messaging/chat';
import { useConversationThread } from '@/hooks/useConversationThread';
import { useIsFocused } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function ConversationScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const conversationId = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    conversation,
    currentUserId,
    messages,
    otherParticipantName,
    otherParticipantAvatarUrl,
    isLoading,
    isError,
    errorMessage,
    refetchConversation,
    refetchMessages,
    sendMessage,
    isSending,
  } = useConversationThread(conversationId ?? '');

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    refetchConversation();
    refetchMessages();
  }, [isFocused, refetchConversation, refetchMessages]);

  if (!conversationId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-danger">Missing conversation id.</Text>
      </View>
    );
  }

  if (isLoading && !conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-medium text-muted">Loading conversation...</Text>
      </View>
    );
  }

  if (isError || !conversation || !currentUserId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-danger">
          {errorMessage || 'Failed to load this conversation.'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Chat
        contactName={otherParticipantName}
        contactAvatarUrl={otherParticipantAvatarUrl}
        currentUserId={currentUserId}
        messages={messages}
        isLoading={isLoading}
        isSending={isSending}
        onBack={() => router.back()}
        onSendMessage={sendMessage}
      />
    </View>
  );
}