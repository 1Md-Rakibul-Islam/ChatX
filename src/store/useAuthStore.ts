import { create } from "zustand";
import type { IUser } from "@/types/chat.interface";
import { getToken, getStoredUser, clearSession, saveSession } from "@/lib/storage";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isRestoring: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  setRestoring: (restoring: boolean) => void;
  setUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isRestoring: true,
  login: (user, token) => {
    saveSession(token, user);
    set({ user, token, isRestoring: false });
  },
  logout: () => {
    clearSession();
    set({ user: null, token: null, isRestoring: false });
  },
  setRestoring: (isRestoring) => set({ isRestoring }),
  setUser: (user) => set({ user }),
}));

// Initialize store from localStorage once on client load
if (typeof window !== "undefined") {
  const initAuth = async () => {
    const token = getToken();
    const user = getStoredUser<IUser>();
    if (token && user) {
      useAuthStore.setState({ user, token });
      try {
        // Just importing getCurrentUser here might cause circular deps if not careful,
        // but we can just use the axiosInstance
        const { getCurrentUser } = await import("@/lib/api-client");
        const freshUser = await getCurrentUser();
        useAuthStore.setState({ user: freshUser, isRestoring: false });
      } catch {
        useAuthStore.getState().logout();
      }
    } else {
      useAuthStore.setState({ isRestoring: false });
    }
  };

  initAuth();

  // Listen for unauthorized events to automatically log out
  window.addEventListener("auth:unauthorized", () => {
    useAuthStore.getState().logout();
  });
}
