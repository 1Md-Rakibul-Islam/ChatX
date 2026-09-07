export interface IUser {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IParticipant extends IUser { }

export interface IMessage {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface IDirectConversation {
  _id: string;
  type: 'direct';
  lastMessage: { text: string; sender: string; createdAt: string } | Record<string, never>;
  updatedAt: string;
  participant: IParticipant | null;
}

export interface IGroupConversation {
  _id: string;
  type: 'group';
  name: string;
  createdBy: string;
  admins: string[];
  participants: IParticipant[];
  lastMessage: { text: string; sender: string; createdAt: string } | Record<string, never>;
  updatedAt: string;
}

export type TConversation = IDirectConversation | IGroupConversation;

export type ConversationListItem = {
  _id: string;
  type: 'direct' | 'group';
  updatedAt: string;
  lastMessage?: { text: string; sender: string; createdAt: string };
  display: string;
  subtitle: string;
  avatarType: 'direct' | 'group';
  raw: TConversation;
};
