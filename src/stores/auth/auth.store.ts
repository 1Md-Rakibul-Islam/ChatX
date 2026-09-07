"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAuthStore } from "./auth.interface";

const mockUsers = [
    { phone: "1234", name: "John Doe", id: "01" },
];

export const useAuthStore = create<TAuthStore>()(
    persist(
        (set) => ({
            user: null,

            login: ({ phone, name }: { phone: string; name: string }) => {
                const foundUser = mockUsers.find(
                    (u) =>
                        u.phone === phone
                );

                if (!foundUser) {
                    set({ user: null });
                    return;
                }

                set({
                    user: {
                        _id: foundUser.id,
                        name: foundUser.name,
                        phone: phone,
                    },
                });
            },

            logout: () => set({ user: null }),
        }),
        {
            name: "auth-storage",
        }
    )
);