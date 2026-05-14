import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Empty for now, will be filled in auth.ts
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.assignedTeacherId !== undefined) token.assignedTeacherId = session.assignedTeacherId;
        if (session.avatarUrl !== undefined) token.avatarUrl = session.avatarUrl;
        if (session.name !== undefined) token.name = session.name;
      }
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.assignedTeacherId = (user as any).assignedTeacherId;
        token.avatarUrl = (user as any).avatarUrl;
        token.avatarColor = (user as any).avatarColor;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).assignedTeacherId = token.assignedTeacherId;
        (session.user as any).avatarUrl = token.avatarUrl;
        (session.user as any).avatarColor = token.avatarColor;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
