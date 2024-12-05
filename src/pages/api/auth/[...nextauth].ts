import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/providers/prismaclient";
import { comparePassword } from "@/lib/backend/handlePasswords";
import { NextApiRequest, NextApiResponse } from "next";

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
        role: { label: "Role", type: "text" }, // Add this line
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prismadb.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        try {
          const isValid = await comparePassword(credentials.password, user.password);
          if (isValid) {
            // Check if the user's role matches the requested role
            if (credentials.role && user.role !== credentials.role) {
              throw new Error("Invalid role for this user");
            }
            return {
              id: user.id.toString(),
              name: user.name || "",
              email: user.email,
              role: user.role as "ADMIN" | "ORGANIZER" | "ATTENDEE",
            };
          }
        } catch (error) {
          console.error("Error comparing passwords:", error);
          throw new Error(error as string);
        }

        return null;
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

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export default handler;