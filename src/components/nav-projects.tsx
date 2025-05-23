"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
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

  const orgContext = useContext(OrgContext);
  console.log("orgContext in app sidebar", orgContext);

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
