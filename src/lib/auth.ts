import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username as string },
          });

          if (!user) {
            console.log("Login failed: User not found", credentials.username);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.log("Login failed: Invalid password for user", credentials.username);
            return null;
          }

          return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
});
