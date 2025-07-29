import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  Lock, 
  Mail, 
  Calendar, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Users,
  UserCheck,
  Crown,
  Ticket
} from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;
type UserRole = 'ORGANIZER' | 'ATTENDEE';

interface RoleOption {
  value: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const roleOptions: RoleOption[] = [
  {
    value: 'ORGANIZER',
    title: 'Event Organizer',
    description: 'Create and manage events',
    icon: Crown,
    features: [
      'Create unlimited events',
      'Manage attendees',
      'Analytics & insights',
      'Custom branding'
    ]
  },
  {
    value: 'ATTENDEE',
    title: 'Event Attendee',
    description: 'Discover and join events',
    icon: Ticket,
    features: [
      'Browse events',
      'RSVP to events',
      'Get notifications',
      'Connect with others'
    ]
  }
];

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<'role-selection' | 'sign-in'>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!selectedRole) {
      toast.error("Please select a user type first");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        role: selectedRole,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        const roleMessage = selectedRole === 'ORGANIZER' ? 'organizer' : 'attendee';
        toast.success(`Welcome back to Evenzia, ${roleMessage}!`);
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setCurrentStep('sign-in');
  }

  function handleBackToRoleSelection() {
    setCurrentStep('role-selection');
    form.reset();
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Evenzia</h1>
            <p className="text-muted-foreground">
              Event Management Platform
            </p>
          </div>
        </div>

        {/* Role Selection Screen */}
        {currentStep === 'role-selection' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Choose Your Role</CardTitle>
              <CardDescription>
                Select how you'd like to use Evenzia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card
                    key={option.value}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 border-2"
                    onClick={() => handleRoleSelect(option.value)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{option.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {option.value.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {option.description}
                          </p>
                          <ul className="space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-xs text-muted-foreground">
                                <UserCheck className="h-3 w-3 mr-2 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sign In Form */}
        {currentStep === 'sign-in' && selectedRole && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToRoleSelection}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <CardTitle className="text-2xl">Welcome back</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2">
                    <span>Signing in as</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedRole === 'ORGANIZER' ? (
                        <>
                          <Crown className="h-3 w-3 mr-1" />
                          Organizer
                        </>
                      ) : (
                        <>
                          <Ticket className="h-3 w-3 mr-1" />
                          Attendee
                        </>
                      )}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in as {selectedRole === 'ORGANIZER' ? 'Organizer' : 'Attendee'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="space-y-4">
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-primary hover:underline"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}