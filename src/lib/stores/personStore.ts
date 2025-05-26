import { Person } from "@prisma/client";
import { create } from "zustand";

interface MemberStroe {
  member: Person | null;
  setMember: (member: Person) => void;
  clearMember: () => void;
}

export const useMemberStore = create<MemberStroe>((set) => ({
  member: null,
  setMember: (member) => set({ member }),
  clearMember: () => set({ member: null }),
}));
