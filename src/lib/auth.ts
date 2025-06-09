import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import {
  getAccountByUserId,
  getOrganizationByUserId,
  getUserById,
} from "@/actions/auth_actions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      orgId?: string | null;
      isOauth: boolean;
      image?: string | null;
    };
  }

  interface JWT {
    orgId?: string | null;
  }
}

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
    async signIn({ account }) {
      if (account?.provider !== "credentials") {
        console.log("the are login with google and prompt from auth.js");
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
