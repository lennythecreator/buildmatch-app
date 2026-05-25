import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { IconSend } from '@tabler/icons-react-native';
import type { DisputeMessage } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';

export interface MediationThreadProps {
  messages: DisputeMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function MediationThread({ messages, onSendMessage, isLoading }: MediationThreadProps) {
  const user = useAuthStore((state) => state.user);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <View className="mt-4 min-h-full rounded-xl border border-border bg-surface overflow-hidden" style={{ minHeight: 420 }}>
      <ScrollView className="h-full p-4" contentContainerStyle={{ paddingBottom: 16 }}>
        {messages.length === 0 ? (
          <View className="min-h-full items-center justify-center py-8">
            <Text className="text-sm text-muted-foreground">No messages yet. Start the conversation.</Text>
          </View>
        ) : (
          messages.map((message) => {
            const isMe = user?.id === message.senderId;
            return (
              <View key={message.id} className={`mb-4 max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
                <Text className={`text-[10px] mb-1 px-1 ${isMe ? 'text-right text-muted-foreground' : 'text-left text-muted-foreground'}`}>
                  {isMe ? 'You' : `${message.sender?.firstName} ${message.sender?.lastName}`}
                </Text>
                <View className={`p-3 rounded-2xl ${isMe ? 'bg-primary rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                  <Text className={`text-sm ${isMe ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {message.content}
                  </Text>
                </View>
                <Text className={`text-[9px] mt-1 px-1 text-muted-foreground ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className="flex-row items-center border-t border-border p-2 bg-surface">
        <TextInput
          className="flex-1 min-h-[44px] max-h-32 px-4 py-2 border border-border rounded-full bg-background text-foreground"
          placeholder="Type a message..."
          placeholderTextColor="#a1a1aa"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Button
          className="ml-2 w-11 h-11 rounded-full p-2 bg-primary items-center justify-center"
          disabled={!inputText.trim() || isLoading}
          onPress={handleSend}
        >
          <IconSend size={20} color="#ffffff" />
        </Button>
      </View>
    </View>
  );
}
