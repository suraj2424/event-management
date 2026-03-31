import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/providers/prismaclient";
import { comparePassword } from "@/lib/backend/handlePasswords";

// --- Module Augmentation ---
// This allows TS to recognize 'role' and 'id' on the session object everywhere
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prismadb.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await comparePassword(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }

        // Return the user object with the role from the DB
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as "ADMIN" | "ORGANIZER" | "ATTENDEE",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
  session: { strategy: "jwt" },
};

export default NextAuth(authOptions);