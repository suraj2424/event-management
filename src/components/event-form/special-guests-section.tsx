import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EventFormValues } from "./types/event";

interface SpecialGuestsSectionProps {
  control: Control<EventFormValues>;
}

export function SpecialGuestsSection({ control }: SpecialGuestsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialGuests",
  });

  const addGuest = () => {
    append({ guestName: "", guestDescription: "" });
  };

  const removeGuest = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Special Guests</h3>
        <Button type="button" variant="outline" onClick={addGuest}>
          Add Guest
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Guest #{index + 1}</h4>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeGuest(index)}
            >
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`specialGuests.${index}.guestName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`specialGuests.${index}.guestDescription`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter guest description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}