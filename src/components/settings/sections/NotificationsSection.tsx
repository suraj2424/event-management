'use client';

import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Settings } from '@/types/settings';

type NotificationsSectionProps = {
  settings: Settings['notifications'];
  onSettingChange: (setting: keyof Settings['notifications']) => void;
};

export default function NotificationsSection({ settings, onSettingChange }: NotificationsSectionProps) {
  const notificationSettings = [
    { label: "Email Notifications", key: "email" },
    { label: "Push Notifications", key: "push" },
    { label: "Event Reminders", key: "eventReminders" },
  ];

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 bg-blue-100">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold mt-2 text-blue-600">Notifications</h2>
      </div>
      <div className="p-4 space-y-3">
        {notificationSettings.map((setting) => (
          <div key={setting.key} className="flex justify-between items-center">
            <label className="text-sm text-gray-700">{setting.label}</label>
            <Switch 
              checked={settings[setting.key as keyof Settings['notifications']]}
              onCheckedChange={() => onSettingChange(setting.key as keyof Settings['notifications'])}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
