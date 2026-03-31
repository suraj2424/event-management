"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Loader2,
  ArrowRight,
  ChevronLeft,
  Crown,
  Ticket,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Requires one uppercase letter")
      .regex(/[a-z]/, "Requires one lowercase letter")
      .regex(/[0-9]/, "Requires one number")
      .regex(/[@$!%*?&]/, "Requires one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;
type UserRole = "ORGANIZER" | "ATTENDEE";

export default function SignUpRevamp() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  if (status === "loading")
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  if (session) {
    router.push("/");
    return null;
  }

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep("details");
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: selectedRole }),
      });

      if (response.ok) {
        toast.success("Account created! Welcome to the family.");
        router.push("/signin");
      } else {
        const data = await response.json();
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* --- Left Side: Brand Narrative --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            Evenzia
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 text-primary bg-primary/5 px-3 py-1"
          >
            <Sparkles className="h-3 w-3 mr-2" /> Join the community
          </Badge>
          <h2 className="text-6xl font-bold text-white leading-tight">
            Start your <br />
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              journey
            </span>{" "}
            here.
          </h2>
          <p className="mt-8 text-zinc-400 text-lg leading-relaxed">
            Whether you&apos;re curating a global summit or attending your first
            local workshop, Evenzia provides the tools you need to connect.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-zinc-500 text-sm font-medium">
          <Link href="#" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Support
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
        </div>
      </div>

      {/* --- Right Side: Interaction Logic --- */}
      <div className="flex-1 flex items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-full max-w-md">
          {/* Step 1: Role Selection */}
          {currentStep === "role" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="text-3xl font-bold tracking-tight">
                  Create account
                </h3>
                <p className="text-muted-foreground">
                  Select your account type to get started.
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => handleRoleSelection("ORGANIZER")}
                  className="group flex items-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-background hover:border-primary hover:ring-4 hover:ring-primary/5 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Crown className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-base">Organizer</h4>
                    <p className="text-xs text-muted-foreground">
                      Host events & manage tickets
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleRoleSelection("ATTENDEE")}
                  className="group flex items-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-background hover:border-blue-500 hover:ring-4 hover:ring-blue-500/5 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Ticket className="h-6 w-6 text-blue-500 group-hover:text-white" />
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-base">Attendee</h4>
                    <p className="text-xs text-muted-foreground">
                      Explore & join experiences
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-primary font-bold hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Signup Form */}
          {currentStep === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <button
                onClick={() => setCurrentStep("role")}
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to roles
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold tracking-tight">
                    Create Account
                  </h3>
                  <Badge
                    variant="outline"
                    className="rounded-full font-medium border-primary/20 text-primary bg-primary/5 capitalize"
                  >
                    {selectedRole?.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Complete your profile to get started.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="John Doe"
                              className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20"
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
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="name@email.com"
                              className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20"
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
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20"
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
                        <FormLabel className="text-zinc-600 dark:text-zinc-400">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 h-12 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20"
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
                    className="w-full h-12 rounded-xl text-base font-bold shadow-xl shadow-primary/10 mt-2 transition-transform active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-xs text-muted-foreground pt-2">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
