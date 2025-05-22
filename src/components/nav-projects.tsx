"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { OrgContext } from "@/contexts/organizationContext";

export function NavProjects({
  projects,
  configurations,
}: {
  projects?:
    | {
        name: string;
        url: string;
        icon: LucideIcon;
      }[]
    | null;
  configurations?:
    | {
        name: string;
        url: string;
        icon: LucideIcon;
      }[]
    | null;
}) {
  const { isMobile } = useSidebar();

  const { data: session } = useSession();

  const orgContext = useContext(OrgContext);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {projects && (
        <>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={`/${orgContext?.orgId}` + item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </>
      )}
      {configurations && (
        <>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {configurations.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={`/${orgContext?.orgId}` + item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </>
      )}
    </SidebarGroup>
  );
}
