"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MessageCircle,
  Phone,
  User as UserIcon,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { LoginFormData, loginSchema } from "./login.schema";
import { login } from "@/lib/api-client";
import { saveSession } from "@/lib/storage";
import { IUser } from "@/types/chat.interface";

interface LoginScreenProps {
  onLogin: (user: IUser, token: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", phone: "" },
  });
  const [apiError, setApiError] = useState<string | null>(null);

  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const response = await login(data.phone, data.name);
      saveSession(response.token, response.user);
      onLogin(response.user, response.token);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-sky-50 via-white to-cyan-50 px-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="hidden flex-col justify-center gap-6 p-8 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              Pulse
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-5xl">
            Conversations that
            <br />
            <span className="bg-linear-to-r from-sky-500 to-cyan-600 bg-clip-text text-transparent">
              move at your pace.
            </span>
          </h1>
          <p className="max-w-md text-lg text-slate-600">
            Real-time one-to-one and group chat. Stay connected with your team
            and friends — no sign-up friction, just log in with your phone
            number and start chatting.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: "⚡", label: "Real-time delivery" },
              { icon: "👥", label: "Group conversations" },
              { icon: "🔒", label: "Secure & simple" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm"
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-xl sm:p-10">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Pulse
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your phone number and name to continue. New here? You are
              automatically registered.
            </p>

            {apiError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="login-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-name"
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Rakibul Islam"
                    className={cn(
                      "w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/40",
                      errors.name
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-slate-200",
                    )}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="e.g. 01798661806"
                    className={cn(
                      "w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/40",
                      errors.phone
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-slate-200",
                    )}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-xl hover:shadow-sky-500/30 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              By continuing you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
