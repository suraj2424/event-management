import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Sun, Moon, Laptop, Paintbrush, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/providers/contexts/theme-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'; // Fixed import path
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function DashboardSettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Classic bright look' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Laptop, description: 'Follows your device' },
  ] as const;

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
    toast.success(`Theme updated to ${value}`, {
      id: 'theme-toggle', // Prevents toast spamming
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and application appearance.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 pb-2 border-b">
          <Paintbrush className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const isActive = theme === option.id;
            const Icon = option.icon;

            return (
              <Card
                key={option.id}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 hover:border-primary/50",
                  isActive ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card"
                )}
                onClick={() => handleThemeChange(option.id)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className={cn(
                    "p-3 rounded-full",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="active-check"
                      className="absolute top-2 right-2 text-primary"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-background" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Personalizing your theme helps improve your experience. Note: <strong>System</strong> mode 
            detects your OS preferences automatically and will adjust whenever you toggle 
            your device settings.
          </p>
        </div>
      </motion.section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin', // Fixed path to your signin route
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

// Proper Layout implementation for Pages Router
DashboardSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};