import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SignInRequired() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Sign In Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-destructive">
          You must be signed in to create an event.
        </p>
        <Button onClick={() => router.push("/auth/organizer/signin")}>
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}

export function AccessDenied() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Access Denied</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-destructive">Only organizers can create events.</p>
      </CardContent>
    </Card>
  );
}