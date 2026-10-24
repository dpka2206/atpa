import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import type { AdminRole } from "@/lib/constants";
import { ensureSeedAdmin } from "@/lib/seed-admin";

declare module "next-auth" {
  interface User {
    role?: AdminRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: AdminRole;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AdminRole;
    id?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        await connectDb();
        await ensureSeedAdmin();

        const user = await User.findOne({ email, active: true });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role as AdminRole,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as AdminRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || token.sub || "");
        session.user.role = (token.role as AdminRole) || "viewer";
        session.user.email = session.user.email || "";
        session.user.name = session.user.name || "";
      }
      return session;
    },
  },
  trustHost: true,
});
