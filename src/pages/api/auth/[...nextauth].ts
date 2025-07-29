import NextAuth from "next-auth";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/providers/prismaclient";
import { comparePassword } from "@/lib/backend/handlePasswords";
import type { NextApiRequest, NextApiResponse } from "next";

// Custom types for our callbacks
interface CustomUser extends User {
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
}

interface CustomJWT extends JWT {
  id: string;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
}

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  };
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
      async authorize(credentials): Promise<CustomUser | null> {
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
          name: user.name || null,
          email: user.email,
          image: null, // Add if you have user images
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
    async jwt({ 
      token, 
      user 
    }: { 
      token: JWT; 
      user?: User | CustomUser;
    }): Promise<CustomJWT> {
      // If user is signing in for the first time
      if (user) {
        const customUser = user as CustomUser;
        return {
          ...token,
          id: customUser.id,
          role: customUser.role,
          name: customUser.name,
          email: customUser.email,
          picture: customUser.image,
        };
      }
      
      // Return previous token if the user is already signed in
      return token as CustomJWT;
    },
    
    async session({ 
      session, 
      token 
    }: { 
      session: Session; 
      token: JWT | CustomJWT;
    }): Promise<CustomSession> {
      const customToken = token as CustomJWT;
      
      return {
        ...session,
        user: {
          id: customToken.id,
          name: customToken.name || null,
          email: customToken.email || null,
          image: customToken.picture || null,
          role: customToken.role,
        },
        expires: session.expires,
      };
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