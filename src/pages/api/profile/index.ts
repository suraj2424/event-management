import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prismadb from '@/providers/prismaclient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // GET user profile
  if (req.method === 'GET') {
    try {
      const user = await prismadb.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          role: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // UPDATE user profile
  if (req.method === 'PUT') {
    try {
      const { name, email } = req.body;

      // Validate input
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }

      // Check if email is already taken by another user
      const existingUser = await prismadb.user.findFirst({
        where: {
          email,
          NOT: { id: session.user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const updatedUser = await prismadb.user.update({
        where: { id: session.user.id },
        data: { name, email },
        select: {
          name: true,
          email: true,
          role: true
        }
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}