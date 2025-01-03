// pages/settings/index.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  Sun, 
  Shield, 
  User,
  Zap,
  Palette,
  Lock,
  UserCog
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  type Settings = {
    notifications: {
      email: boolean;
      push: boolean;
      eventReminders: boolean;
    };
    appearance: {
      darkMode: boolean;
      compactView: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showAttendance: boolean;
    };
  };

  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      eventReminders: true,
    },
    appearance: {
      darkMode: false,
      compactView: false,
    },
    privacy: {
      publicProfile: true,
      showAttendance: true,
    }
  });

  const handleSettingChange = <T extends keyof Settings>(
    category: T,
    setting: keyof Settings[T]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    toast.success('Setting updated successfully');
  };

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      settings: [
        { label: "Email Notifications", key: "email" },
        { label: "Push Notifications", key: "push" },
        { label: "Event Reminders", key: "eventReminders" },
      ]
    },
    {
      title: "Appearance",
      icon: Palette,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      settings: [
        { label: "Dark Mode", key: "darkMode" },
        { label: "Compact View", key: "compactView" },
      ]
    },
    {
      title: "Privacy",
      icon: Lock,
      color: "bg-green-100",
      textColor: "text-green-600",
      settings: [
        { label: "Public Profile", key: "publicProfile" },
        { label: "Show Event Attendance", key: "showAttendance" },
      ]
    },
  ];

  return (
    <div className="h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">Your Settings Hub</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <motion.div 
              key={section.title} 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-4 ${section.color}`}>
                <section.icon className={`w-6 h-6 ${section.textColor}`} />
                <h2 className={`text-xl font-semibold mt-2 ${section.textColor}`}>{section.title}</h2>
              </div>
              <div className="p-4 space-y-3">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex justify-between items-center">
                    <label className="text-sm text-gray-700">{setting.label}</label>
                    <Switch 
                      checked={settings[section.title.toLowerCase() as keyof Settings][setting.key as keyof Settings[keyof Settings]]}
                      onCheckedChange={() => handleSettingChange(section.title.toLowerCase() as keyof Settings, setting.key as keyof Settings[keyof Settings])}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

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
                Logged in as: {session?.user?.email}
              </p>
              <Button variant="outline" className="w-full text-sm">
                Change Password
              </Button>
              <Button variant="destructive" className="w-full text-sm">
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2 rounded-full transition duration-300 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}