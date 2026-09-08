"use client";

import { LoginScreen } from "@/components/sections/chat/LoginScreen";
import { ChatApp } from "@/components/sections/chat/ChatApp";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUser } from "@/types/chat.interface";

export default function Home() {
  const { user, token, isRestoring, login, logout } = useAuthStore();

  function handleLogin(loggedInUser: IUser, jwt: string) {
    login(loggedInUser, jwt);
  }

  function handleLogout() {
    logout();
  }

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <ChatApp currentUser={user} token={token} onLogout={handleLogout} />;
}
