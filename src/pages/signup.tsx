import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
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
  User,
  Mail, 
  Lock, 
  Calendar, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  UserCheck,
  Crown,
  Ticket,
  CheckCircle
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must include uppercase, lowercase, number, and special character."
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<'role-selection' | 'sign-up'>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!selectedRole) {
      toast.error("Please select a user type first");
      return;
    }

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    setIsSubmitting(true);
    try {
      const response = await fetch(`${url}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: selectedRole
        }),
      });

      if (response.ok) {
        const roleMessage = selectedRole === 'ORGANIZER' ? 'organizer' : 'attendee';
        toast.success(`Account created successfully as ${roleMessage}!`);
        router.push("/signin");
      } else {
        const data = await response.json();
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setCurrentStep('sign-up');
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
      <div className="w-full max-w-lg space-y-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card
                      key={option.value}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 border-2 h-full"
                      onClick={() => handleRoleSelect(option.value)}
                    >
                      <CardContent className="p-6 h-full">
                        <div className="flex flex-col items-center text-center space-y-4 h-full">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{option.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {option.value.toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {option.description}
                            </p>
                            <ul className="space-y-2">
                              {option.features.map((feature, index) => (
                                <li key={index} className="flex items-center justify-center text-xs text-muted-foreground">
                                  <UserCheck className="h-3 w-3 mr-2 text-primary flex-shrink-0" />
                                  <span className="text-center">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground mt-auto" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sign Up Form */}
        {currentStep === 'sign-up' && selectedRole && (
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
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2">
                    <span>Signing up as</span>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your full name"
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
                              placeholder="Create a strong password"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Confirm your password"
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create {selectedRole === 'ORGANIZER' ? 'Organizer' : 'Attendee'} Account
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
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in here
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
            By creating an account, you agree to our{" "}
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