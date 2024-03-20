import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "../prisma/client";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {

      console.log(user, account, "======111")
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;
      if (user.id) {
        const existingUser = await getUserById(user.id);
        if (!existingUser?.emailVerified) return false;
      }

      // if (existingUser.isTwoFactorEnabled) {
      // const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      // if (!twoFactorConfirmation) return false;

      // Delete two factor confirmation for next sign in
      // await prisma.twoFactorConfirmation.delete({
      //   where: { id: twoFactorConfirmation.id }
      // });
      // }

      return true;
    },
    async session({ token, session }) {

      console.log(token, session, "======session")

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      // if (session.user) {
      //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      // }

      // if (session.user) {
      //   session.user.name = token.name;
      //   session.user.email = token.email;
      //   session.user.isOAuth = token.isOAuth as boolean;
      // }

      return session;
    },
    async jwt({ token }) {

      console.log(token, 'tokentokentoken')
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      // const existingAccount = await getAccountByUserId(
      //   existingUser.id
      // );

      // token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig
})