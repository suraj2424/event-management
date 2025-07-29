'use client';

import { motion } from 'framer-motion';
import { UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AccountSectionProps = {
  userEmail: string;
};

export default function AccountSection({ userEmail }: AccountSectionProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="p-4 bg-yellow-100">
        <UserCog className="w-6 h-6 text-yellow-600" />
        <h2 className="text-xl font-semibold mt-2 text-yellow-600">Account</h2>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-600">
          Logged in as: {userEmail}
        </p>
        <Button variant="outline" className="w-full text-sm">
          Change Password
        </Button>
        <Button variant="destructive" className="w-full text-sm">
          Delete Account
        </Button>
      </div>
    </motion.div>
  );
}
