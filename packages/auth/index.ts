import NextAuth, { unstable_getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@captain/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email?.endsWith("@ping.gg") || false;
      }
      return false; // only allow google login with ping.gg domain
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET!,
};

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (
  req: Parameters<typeof unstable_getServerSession>[0],
  res: Parameters<typeof unstable_getServerSession>[1]
) => {
  return await unstable_getServerSession(req, res, authOptions);
};

export default NextAuth(authOptions);
