export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
}

export interface Participant extends User {}

export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface DirectConversation {
  _id: string;
  type: 'direct';
  lastMessage: { text: string; sender: string; createdAt: string } | Record<string, never>;
  updatedAt: string;
  participant: Participant | null;
}

export interface GroupConversation {
  _id: string;
  type: 'group';
  name: string;
  createdBy: string;
  admins: string[];
  participants: Participant[];
  lastMessage: { text: string; sender: string; createdAt: string } | Record<string, never>;
  updatedAt: string;
}

export type Conversation = DirectConversation | GroupConversation;

export type ConversationListItem = {
  _id: string;
  type: 'direct' | 'group';
  updatedAt: string;
  lastMessage?: { text: string; sender: string; createdAt: string };
  display: string;
  subtitle: string;
  avatarType: 'direct' | 'group';
  raw: Conversation;
};
