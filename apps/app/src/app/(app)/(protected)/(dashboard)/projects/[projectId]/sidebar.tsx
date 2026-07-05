"use client";

import {
  FolderClosedIcon,
  GalleryVerticalEnd,
  LayoutPanelTopIcon,
  LinkIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { paths } from "@/lib/utils/paths";

import { LogoutButton } from "./logout-button";

export function AppSidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const project = paths.projects.id(projectId);

  const items = [
    { title: "Overview", href: project.index, icon: LayoutPanelTopIcon },
    { title: "Links", href: project.links, icon: LinkIcon },
    { title: "Folders", href: project.folders, icon: FolderClosedIcon },
    { title: "Settings", href: project.settings.index, icon: SettingsIcon },
  ];

  const settingsItems = [
    { title: "Preferences", href: project.settings.preferences },
    { title: "Billing", href: project.settings.billing },
    { title: "Members", href: project.settings.members },
    { title: "Integrations", href: project.settings.integrations },
  ];

  const isSettingsActive = pathname.startsWith(project.settings.index);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href={paths.index} />}>
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <span className="font-semibold">Ferri</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isSettings = item.href === project.settings.index;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={
                        isSettings ? isSettingsActive : pathname === item.href
                      }
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>

                    {isSettings && isSettingsActive && (
                      <SidebarMenuSub className="mx-0 my-2 ml-5 translate-x-0 pl-3">
                        {settingsItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              isActive={pathname === subItem.href}
                              className="translate-x-0 font-medium transition-[width,height,padding,color,background-color] not-data-active:not-hover:text-neutral-500 not-data-active:not-hover:dark:text-neutral-500 hover:bg-transparent active:bg-transparent data-active:bg-transparent"
                              render={<Link href={subItem.href} />}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
