import type {
  IUser,
  TConversation,
  IMessage,
  IGroupConversation,
} from '@/types/chat.interface';
import { axiosInstance } from './axios';

// --- Auth ---

export interface LoginResponse {
  token: string;
  user: IUser;
}

export async function login(phone: string, name: string): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { phone, name });
  return data;
}

export async function getCurrentUser(): Promise<IUser> {
  const { data } = await axiosInstance.get<IUser>('/auth/me');
  return data;
}

// --- Users ---

export async function searchUsers(query: string): Promise<IUser[]> {
  const { data } = await axiosInstance.get<IUser[]>('/users/search', { params: { q: query } });
  return data;
}

// --- Conversations ---

interface IConversationsResponse {
  data: TConversation[];
}

export async function getConversations(): Promise<TConversation[]> {
  const { data } = await axiosInstance.get<IConversationsResponse>('/conversations');
  return data.data;
}

export async function startDirectConversation(userId: string): Promise<{
  _id: string;
  participants: string[];
  createdAt: string;
}> {
  const { data } = await axiosInstance.post('/conversations', { userId });
  return data;
}

// --- Messages ---

interface MessagesResponse {
  messages: IMessage[];
  hasMore: boolean;
}

export async function getMessages(
  conversationId: string,
  params?: { limit?: number; before?: string },
): Promise<MessagesResponse> {
  const { data } = await axiosInstance.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`,
    { params }
  );
  return data;
}

export async function sendMessage(
  conversationId: string,
  text: string,
): Promise<IMessage> {
  const { data } = await axiosInstance.post<IMessage>('/messages', {
    conversationId,
    text,
  });
  return data;
}

// --- Groups ---

export async function createGroup(
  name: string,
  participantIds: string[],
): Promise<IGroupConversation> {
  const { data } = await axiosInstance.post<IGroupConversation>('/conversations/group', {
    name,
    participantIds,
  });
  return data;
}

export async function addGroupMembers(
  groupId: string,
  userIds: string[],
): Promise<IGroupConversation> {
  const { data } = await axiosInstance.post<IGroupConversation>(
    `/conversations/${groupId}/participants`,
    { userIds }
  );
  return data;
}

export async function removeGroupMember(
  groupId: string,
  userId: string,
): Promise<IGroupConversation> {
  const { data } = await axiosInstance.delete<IGroupConversation>(
    `/conversations/${groupId}/participants/${userId}`
  );
  return data;
}

export async function promoteAdmin(
  groupId: string,
  userId: string,
): Promise<IGroupConversation> {
  const { data } = await axiosInstance.post<IGroupConversation>(
    `/conversations/${groupId}/admins`,
    { userId }
  );
  return data;
}

export async function renameGroup(
  groupId: string,
  name: string,
): Promise<IGroupConversation> {
  const { data } = await axiosInstance.patch<IGroupConversation>(
    `/conversations/${groupId}`,
    { name }
  );
  return data;
}

