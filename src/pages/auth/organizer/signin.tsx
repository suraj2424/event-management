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
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';

// Form schema validation
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function ModernSignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form initialization
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        role: "ATTENDEE",
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div 
      className="flex justify-center items-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </motion.div>
  );

  // Redirect if already logged in or loading
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-gray-50 to-blue-50 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="text-center relative mb-8">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <p className="text-sm text-gray-600">Sign in to continue to your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="mr-2 text-blue-500" size={20} />
                    Email
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </motion.div>
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
                  <FormLabel className="flex items-center">
                    <Lock className="mr-2 text-blue-500" size={20} />
                    Password
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-solid rounded-full animate-spin border-t-transparent" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
        <motion.p 
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don&apos;t have an account?{" "}
          <Link 
            href="/signup" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
          >
            Sign up here
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}