import { NextAuth } from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import {
  getAccountByUserId,
  getOrganizationByUserId,
  getUserById,
} from "@/actions/auth_actions";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      //const existingUser = await getUserById(user.id ?? "");

      //use these code after adding email verification feature
      // if (!existingUser?.emailVerified) {
      //   return false;
      // }
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      const organization = await getOrganizationByUserId(existingUser.id);

      token.isOauth = !!existingAccount; //return if account exists
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.orgId = !!organization ? organization.id : null;

      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
          orgId: token.orgId,
        },
      };
    },
  },
});
