"use client";

import { LoginScreen } from "@/components/sections/login/LoginScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import type { IUser } from "@/types/chat.interface";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  function handleLogin(user: IUser, token: string) {
    login(user, token);
    router.push("/chat");
  }

  return <LoginScreen onLogin={handleLogin} />;
}
