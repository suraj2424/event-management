// pages/settings/index.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  Sun, 
  Shield, 
  User,
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <label>Email Notifications</label>
                <Switch 
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleSettingChange('notifications', 'email')}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Push Notifications</label>
                <Switch 
                  checked={settings.notifications.push}
                  onCheckedChange={() => handleSettingChange('notifications', 'push')}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Event Reminders</label>
                <Switch 
                  checked={settings.notifications.eventReminders}
                  onCheckedChange={() => handleSettingChange('notifications', 'eventReminders')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <label>Dark Mode</label>
                <Switch 
                  checked={settings.appearance.darkMode}
                  onCheckedChange={() => handleSettingChange('appearance', 'darkMode')}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Compact View</label>
                <Switch 
                  checked={settings.appearance.compactView}
                  onCheckedChange={() => handleSettingChange('appearance', 'compactView')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <label>Public Profile</label>
                <Switch 
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={() => handleSettingChange('privacy', 'publicProfile')}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Show Event Attendance</label>
                <Switch 
                  checked={settings.privacy.showAttendance}
                  onCheckedChange={() => handleSettingChange('privacy', 'showAttendance')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Logged in as: {session?.user?.email}
                </p>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}