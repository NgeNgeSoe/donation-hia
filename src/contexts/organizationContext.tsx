"use client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";

type OrgContextType = {
  orgId: string;
  setOrgId: (id: string) => void;
};

export const OrgContext = createContext<OrgContextType | null>(null);

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  const [orgId, setOrgId] = useState<string>("");

  useEffect(() => {
    if (session?.user.orgId) {
      setOrgId(session.user.orgId);
    }
  }, [session?.user.orgId]);

  return (
    <OrgContext.Provider value={{ orgId, setOrgId }}>
      {children}
    </OrgContext.Provider>
  );
};
