import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/providers/prismaclient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { comparePassword, generatePasswordHash } from "@/lib/backend/handlePasswords"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const session = await getServerSession(req, res, authOptions);
  
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Get user with current password
      const user = await prismadb.user.findUnique({
        where: { id: session.user.id }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Hash new password
      const hashedPassword = await generatePasswordHash(newPassword);
  
      // Update password
      await prismadb.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
      });
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password update error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }