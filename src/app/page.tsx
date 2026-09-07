"use client";

import { useState, useEffect } from "react";
import { LoginScreen } from "@/components/sections/chat/LoginScreen";
import { ChatApp } from "@/components/sections/chat/ChatApp";
import { getCurrentUser } from "@/lib/api-client";
import { getToken, getStoredUser, clearSession } from "@/lib/storage";
import type { IUser } from "@/types/chat.interface";

export default function Home() {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser<IUser>();
    if (storedToken && storedUser) {
      // Verify token is still valid
      getCurrentUser()
        .then((freshUser) => {
          setUser(freshUser);
          setToken(storedToken);
        })
        .catch(() => {
          clearSession();
        })
        .finally(() => setRestoring(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestoring(false);
    }
  }, []);

  function handleLogin(loggedInUser: IUser, jwt: string) {
    setUser(loggedInUser);
    setToken(jwt);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setToken(null);
  }

  if (restoring) {
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
