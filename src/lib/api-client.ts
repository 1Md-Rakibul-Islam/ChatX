import type {
  IUser,
  TConversation,
  IMessage,
  IGroupConversation,
} from '@/types/chat.interface';

const API_BASE = 'https://frontend-task-chatapp.onrender.com/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pulse_token');
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.error?.message || body?.message || message;
    } catch {
      // response body not JSON
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// --- Auth ---

export interface LoginResponse {
  token: string;
  user: IUser;
}

export async function login(phone: string, name: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, name }),
  });
}

export async function getCurrentUser(): Promise<IUser> {
  return apiRequest<IUser>('/auth/me');
}

// --- Users ---

export async function searchUsers(query: string): Promise<IUser[]> {
  const qs = new URLSearchParams({ q: query });
  return apiRequest<IUser[]>(`/users/search?${qs.toString()}`);
}

// --- Conversations ---

interface IConversationsResponse {
  data: TConversation[];
}

export async function getConversations(): Promise<TConversation[]> {
  const res = await apiRequest<IConversationsResponse>('/conversations');
  return res.data;
}

export async function startDirectConversation(userId: string): Promise<{
  _id: string;
  participants: string[];
  createdAt: string;
}> {
  return apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
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
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.before) qs.set('before', params.before);
  const queryStr = qs.toString();
  return apiRequest<MessagesResponse>(
    `/conversations/${conversationId}/messages${queryStr ? `?${queryStr}` : ''}`,
  );
}

export async function sendMessage(
  conversationId: string,
  text: string,
): Promise<IMessage> {
  return apiRequest<IMessage>('/messages', {
    method: 'POST',
    body: JSON.stringify({ conversationId, text }),
  });
}

// --- Groups ---

export async function createGroup(
  name: string,
  participantIds: string[],
): Promise<IGroupConversation> {
  return apiRequest<IGroupConversation>('/conversations/group', {
    method: 'POST',
    body: JSON.stringify({ name, participantIds }),
  });
}

export async function addGroupMembers(
  groupId: string,
  userIds: string[],
): Promise<IGroupConversation> {
  return apiRequest<IGroupConversation>(
    `/conversations/${groupId}/participants`,
    {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    },
  );
}

export async function removeGroupMember(
  groupId: string,
  userId: string,
): Promise<IGroupConversation> {
  return apiRequest<IGroupConversation>(
    `/conversations/${groupId}/participants/${userId}`,
    { method: 'DELETE' },
  );
}

export async function promoteAdmin(
  groupId: string,
  userId: string,
): Promise<IGroupConversation> {
  return apiRequest<IGroupConversation>(
    `/conversations/${groupId}/admins`,
    {
      method: 'POST',
      body: JSON.stringify({ userId }),
    },
  );
}

export async function renameGroup(
  groupId: string,
  name: string,
): Promise<IGroupConversation> {
  return apiRequest<IGroupConversation>(`/conversations/${groupId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}
