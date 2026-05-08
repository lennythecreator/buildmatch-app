import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { useConversations, useUnreadCount } from '@/hooks';
import { useAuthStore } from '@/store/auth';

import { getConversationPartner, getConversationSnippet } from './messaging-utils';
import { SearchBar } from './search-bar';
import { UserCard } from './user-card';

export function Conversations() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const conversationsQuery = useConversations();
  const unreadQuery = useUnreadCount();

  const conversations = conversationsQuery.data?.conversations ?? [];
  const unreadTotal = unreadQuery.data?.total ?? 0;

  const filteredConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const sortedConversations = [...conversations].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

    if (!normalizedQuery) {
      return sortedConversations;
    }

    return sortedConversations.filter((conversation) => {
      const partner = getConversationPartner(conversation, user?.id);
      const name = partner ? `${partner.firstName} ${partner.lastName}`.toLowerCase() : '';
      const snippet = getConversationSnippet(conversation).toLowerCase();

      return name.includes(normalizedQuery) || snippet.includes(normalizedQuery);
    });
  }, [conversations, searchQuery, user?.id]);

  if (conversationsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ActivityIndicator />
        <Text className="text-sm font-medium text-muted">Loading conversations...</Text>
      </View>
    );
  }

  if (conversationsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-danger">Failed to load conversations. Please try again.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-4 px-4 pb-4 pt-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-2xl font-bold text-foreground">Messages</Text>
          <Text className="text-sm text-muted">Keep every conversation in one place.</Text>
        </View>

        <Badge color="slate" size="md" variant="solid">
          {unreadTotal}
        </Badge>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const partner = getConversationPartner(item, user?.id);
          const displayName = partner ? `${partner.firstName} ${partner.lastName}`.trim() : 'Conversation';
          const lastMessage = item.lastMessage?.content || 'No messages yet';
          const lastMessageAt = item.lastMessage?.createdAt ?? item.updatedAt;

          return (
            <UserCard
              name={displayName}
              avatarUrl={partner?.avatarUrl}
              lastMessage={lastMessage}
              lastMessageAt={lastMessageAt}
              isUnread={item.unreadCount > 0}
              unreadCount={item.unreadCount}
              onPress={() => router.push({ pathname: '/conversation/[id]', params: { id: item.id } })}
            />
          );
        }}
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2 py-12">
            <Text className="text-center text-base font-medium text-foreground">
              {searchQuery.trim() ? 'No conversations match that search.' : 'No conversations yet.'}
            </Text>
            <Text className="text-center text-sm text-muted">
              {searchQuery.trim()
                ? 'Try a different name or message snippet.'
                : 'Start a chat from a job or contractor profile to see it here.'}
            </Text>
          </View>
        }
        contentContainerStyle={filteredConversations.length === 0 ? { flexGrow: 1 } : undefined}
      />
    </View>
  );
}