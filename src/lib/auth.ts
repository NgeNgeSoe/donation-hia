import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import { getAccountByUserId, getUserById } from "@/actions/auth_actions";
import { get } from "http";

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

      const existingUser = await getUserById(user.id ?? "");

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

      token.isOauth = !!existingAccount; //return if account exists
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },
    async session({ token, session }) {
      // console.log("session token value callback", token);
      // console.log("session bject value callback", session);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
        },
      };
    },
  },
});
