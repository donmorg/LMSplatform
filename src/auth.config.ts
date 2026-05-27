import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Empty for now, will be filled in auth.ts
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.teacherId !== undefined) token.teacherId = session.teacherId;
      }
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.avatarColor = (user as any).avatarColor;
        token.teacherId = (user as any).teacherId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).avatarColor = token.avatarColor;
        (session.user as any).teacherId = token.teacherId;
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
