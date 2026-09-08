"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatApp } from "@/components/sections/chat/ChatApp";
import { useAuthStore } from "@/store/useAuthStore";

export default function ChatPage() {
  const { user, token, isRestoring, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If we've finished restoring and there is no valid session, redirect to login
    if (!isRestoring && (!user || !token)) {
      router.push("/login");
    }
  }, [user, token, isRestoring, router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  // Show a loading state while restoring session or before redirecting
  if (isRestoring || !user || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <ChatApp currentUser={user} token={token} onLogout={handleLogout} />;
}
