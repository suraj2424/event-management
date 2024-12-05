import NextAuth from "next-auth/next";
import type { DefaultSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/providers/prismaclient";
import { comparePassword } from "@/lib/backend/handlePasswords";
import type { NextApiRequest, NextApiResponse } from "next";

// Extend NextAuth module types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johndoe@example.com" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing credentials");
        }

        const user = await prismadb.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with the provided email");
        }

        const isValid = await comparePassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        if (user.role !== credentials.role) {
          throw new Error("Invalid role for this user");
        }

        return {
          id: user.id.toString(),
          name: user.name || "",
          email: user.email,
          role: user.role as "ADMIN" | "ORGANIZER" | "ATTENDEE",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "ORGANIZER" | "ATTENDEE";
      }
      return session;
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
