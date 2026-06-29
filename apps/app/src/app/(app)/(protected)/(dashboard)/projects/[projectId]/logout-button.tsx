"use client";

import { LogOut } from "lucide-react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { signOut } from "@/lib/actions/auth/sign-out";

export function LogoutButton() {
  return (
    <SidebarMenuButton
      onClick={() => {
        void signOut();
      }}
    >
      <LogOut />
      <span>Log out</span>
    </SidebarMenuButton>
  );
}
