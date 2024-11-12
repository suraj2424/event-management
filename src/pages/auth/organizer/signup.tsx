"use client";

import React from "react";
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
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";

// Define the form schema for signup
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: "ORGANIZER",
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");
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

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
    </div>
  );

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign Up</h2>
            <p className="mt-2 text-sm text-gray-600">Create your account</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/organizer/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}