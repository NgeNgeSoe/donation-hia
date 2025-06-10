"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { OrgContext } from "@/contexts/organizationContext";
import { useSession } from "next-auth/react";

export function NavProjects({
  projects,
  configurations,
}: {
  projects?:
    | {
        name: string;
        url: string;
        icon: LucideIcon;
        roles: string[];
      }[]
    | null;
  configurations?:
    | {
        name: string;
        url: string;
        icon: LucideIcon;
        roles: string[];
      }[]
    | null;
}) {
  // const { isMobile } = useSidebar();

  const { data: session } = useSession();

  const orgContext = useContext(OrgContext);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {projects && (
        <>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects
              .filter((item) => {
                if (!session?.user.isAdmin) {
                  return item.roles.includes("member");
                }
                return true;
              })
              .map((item) => (
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
      {configurations && session?.user.isAdmin && (
        <>
          <SidebarGroupLabel>Configurations</SidebarGroupLabel>
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
