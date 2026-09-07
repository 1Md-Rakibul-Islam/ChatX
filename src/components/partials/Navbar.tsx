"use client";

import { useAuthStore } from "@/stores/auth/auth.store";
import { useRouter } from "next/navigation";

const navItem = [
  {
    title: "Home",
    href: "/",
  },
];

const Navbar = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white">
      <nav></nav>
    </header>
  );
};

export default Navbar;
