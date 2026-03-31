"use client";

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
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  Lock, 
  Mail, 
  Calendar, 
  Loader2, 
  ArrowRight, 
  ChevronLeft,
  Crown,
  Ticket,
  Sparkles
} from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(8, { message: "Password is too short" }),
});

type FormValues = z.infer<typeof formSchema>;
type UserRole = 'ORGANIZER' | 'ATTENDEE';

export default function SigninRevamp() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<'role' | 'auth'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  if (status === "loading") return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
      <span>Loading Evenzia...</span>
    </div>
  );

  if (session) {
    router.push("/");
    return null;
  }

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('auth');
  };

  async function onSubmit(values: FormValues) {
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
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      
      {/* --- Left Pane: Brand Identity (No Stats) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 p-16 flex-col justify-between">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[140px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Evenzia</span>
        </div>

        <div className="relative z-10 max-w-md">
          <Badge variant="outline" className="mb-6 border-zinc-800 text-zinc-400 bg-zinc-900/50 px-3 py-1">
            <Sparkles className="h-3 w-3 mr-2 text-primary" /> Established 2026
          </Badge>
          <h2 className="text-5xl font-semibold text-white leading-[1.1] tracking-tight">
            The platform for <br />
            <span className="text-zinc-500 italic font-light">memorable</span> moments.
          </h2>
          <p className="mt-8 text-zinc-400 text-lg leading-relaxed">
            A seamless bridge between event creators and their communities. Simple, powerful, and built for scale.
          </p>
        </div>

        <div className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            Evenzia Event Management &copy; 2026
        </div>
      </div>

      {/* --- Right Pane: Interactive Auth --- */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-zinc-50/30 dark:bg-zinc-900/30">
        <div className="w-full max-w-sm">
          
          {/* Step 1: Role Identification */}
          {currentStep === 'role' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="text-3xl font-bold tracking-tight">Welcome back</h3>
                <p className="text-muted-foreground">Select your account type to continue.</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => handleRoleSelection('ORGANIZER')}
                  className="group flex items-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-background hover:border-primary hover:ring-4 hover:ring-primary/5 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Crown className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-base">Organizer</h4>
                    <p className="text-xs text-muted-foreground">Manage events & attendees</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => handleRoleSelection('ATTENDEE')}
                  className="group flex items-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-background hover:border-blue-500 hover:ring-4 hover:ring-blue-500/5 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Ticket className="h-6 w-6 text-blue-500 group-hover:text-white" />
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-base">Attendee</h4>
                    <p className="text-xs text-muted-foreground">Discover & join events</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-4">
                No account? <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">Sign up</Link>
              </p>
            </div>
          )}

          {/* Step 2: Credentials */}
          {currentStep === 'auth' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <button 
                onClick={() => setCurrentStep('role')}
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to roles
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold tracking-tight">Login</h3>
                    <Badge variant="outline" className="rounded-full font-medium border-primary/20 text-primary bg-primary/5">
                        {selectedRole === 'ORGANIZER' ? 'Organizer' : 'Attendee'}
                    </Badge>
                </div>
                <p className="text-muted-foreground">Enter your credentials below.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input placeholder="name@email.com" className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20" {...field} />
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
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input type="password" placeholder="••••••••" className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold shadow-xl shadow-primary/10 transition-transform active:scale-[0.98]">
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-muted-foreground">
                <Link href="#" className="hover:text-primary transition-colors">Forgot password?</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}