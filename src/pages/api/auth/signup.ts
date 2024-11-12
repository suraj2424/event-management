// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from "@/providers/prismaclient";
import { generatePasswordHash } from "@/lib/backend/handlePasswords";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await prismadb.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await generatePasswordHash(password);
    const user = await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}