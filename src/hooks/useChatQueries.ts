import { useQuery } from "@tanstack/react-query";
import { getConversations, getMessages, searchUsers } from "@/lib/api-client";
import type { TConversation, IMessage, IUser } from "@/types/chat.interface";

export const QUERY_KEYS = {
  conversations: ["conversations"] as const,
  messages: (convId: string) => ["messages", convId] as const,
  searchUsers: (query: string) => ["users", "search", query] as const,
};

export function useConversations() {
  return useQuery<TConversation[]>({
    queryKey: QUERY_KEYS.conversations,
    queryFn: getConversations,
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery<IMessage[]>({
    queryKey: QUERY_KEYS.messages(conversationId!),
    queryFn: async () => {
      const res = await getMessages(conversationId!, { limit: 50 });
      return [...res.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
    enabled: !!conversationId,
  });
}

export function useSearchUsers(query: string, currentUserId?: string) {
  return useQuery<IUser[]>({
    queryKey: QUERY_KEYS.searchUsers(query),
    queryFn: () => searchUsers(query),
    select: (data) => data.filter((u) => u._id !== currentUserId),
    enabled: typeof currentUserId !== "undefined",
  });
}

