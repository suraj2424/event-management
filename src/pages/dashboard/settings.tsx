// pages/dashboard/settings.tsx
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Sun, Moon, Laptop, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/contexts/theme-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

type SettingsPageProps = {
  userEmail: string | null;
};

export default function DashboardSettingsPage({ userEmail }: SettingsPageProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  const applyTheme = (value: 'light' | 'dark' | 'system') => {
    setSaving(true);
    setTheme(value);
    // ThemeProvider persists to localStorage; no API needed
    setTimeout(() => {
      setSaving(false);
      toast.success(`Theme set to ${value}`);
    }, 150);
  };

  return (
    <div className="min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Appearance</h1>
        <div className="grid grid-cols-1 gap-6 place-items-center">
          <motion.div 
            className="w-full max-w-xl bg-card text-card-foreground border rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-4 bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-primary">Theme</h2>
              </div>
              <span className="text-xs text-primary">Current: {actualTheme}</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="inline-flex rounded-md shadow-sm border overflow-hidden bg-background" role="group">
                <Button
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  className={`gap-2 ${theme === 'light' ? '' : ''}`}
                  onClick={() => applyTheme('light')}
                  disabled={saving}
                >
                  <Sun className="w-4 h-4" /> Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  className={`gap-2 border-l ${theme === 'dark' ? '' : ''}`}
                  onClick={() => applyTheme('dark')}
                  disabled={saving}
                >
                  <Moon className="w-4 h-4" /> Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'ghost'}
                  className={`gap-2 border-l ${theme === 'system' ? '' : ''}`}
                  onClick={() => applyTheme('system')}
                  disabled={saving}
                >
                  <Laptop className="w-4 h-4" /> System
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Theme preference is saved locally and follows system when set to System.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Button className="px-6 py-2 rounded-full transition duration-300 text-sm" onClick={() => toast.success('Theme preference saved')} disabled={saving}>
            Save
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userEmail: session.user?.email || null,
    },
  };
};

// Apply dashboard layout for this page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(DashboardSettingsPage as any).getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);
