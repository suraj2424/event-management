import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EventFormValues } from "./types/event";

interface SocialLinksSectionProps {
  control: Control<EventFormValues>;
}

export function SocialLinksSection({ control }: SocialLinksSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Links</h3>
      <FormField
        control={control}
        name="socialLinks.facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook Link</FormLabel>
            <FormControl>
              <Input placeholder="Facebook page URL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter Link</FormLabel>
            <FormControl>
              <Input placeholder="Twitter profile URL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="socialLinks.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram Link</FormLabel>
            <FormControl>
              <Input placeholder="Instagram profile URL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}