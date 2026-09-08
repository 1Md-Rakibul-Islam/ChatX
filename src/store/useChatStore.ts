import { create } from "zustand";

interface ChatState {
  activeId: string | null;
  mobileView: "list" | "chat";
  unread: Record<string, number>;
  setActiveId: (id: string | null) => void;
  setMobileView: (view: "list" | "chat") => void;
  incrementUnread: (convId: string) => void;
  clearUnread: (convId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeId: null,
  mobileView: "list",
  unread: {},
  setActiveId: (id) => set({ activeId: id, mobileView: id ? "chat" : "list" }),
  setMobileView: (view) => set({ mobileView: view }),
  incrementUnread: (convId) =>
    set((state) => ({
      unread: { ...state.unread, [convId]: (state.unread[convId] || 0) + 1 },
    })),
  clearUnread: (convId) =>
    set((state) => ({
      unread: { ...state.unread, [convId]: 0 },
    })),
}));

