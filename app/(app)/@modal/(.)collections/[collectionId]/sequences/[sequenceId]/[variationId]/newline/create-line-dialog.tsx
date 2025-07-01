"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useParams, useRouter } from "next/navigation";
import { createLineAction } from "@/app/(app)/collections/[collectionId]/sequences/[sequenceId]/[variationId]/newline/actions";
import { VariationWithLines } from "@/lib/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function generateLineName(existingLineNames: string[]) {
  // Generate a name that is in the format of "Line 1", "Line 2", etc.
  // If the name is already taken, increment the number and try again.
  // If the name is not taken, return the name.
  let name = "Line 1";
  while (existingLineNames.includes(name)) {
    name = `Line ${existingLineNames.length + 1}`;
  }

  return name;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
});

interface CreateLineDialogProps {
  variation: VariationWithLines;
}

export default function CreateLineDialog({ variation }: CreateLineDialogProps) {
  const existingLineNames = variation.lines.map((line) => line.name);
  const [isLoading, setIsLoading] = useState(false);
  const { collectionId, sequenceId, variationId } = useParams();
  const router = useRouter();
  const close = () => router.back();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: generateLineName(existingLineNames),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const result = await createLineAction(
      values.name.trim(),
      variationId as string,
      collectionId as string,
      sequenceId as string
    );

    setIsLoading(false);

    if (!result?.ok) {
      toast.error(result.error);
      return;
    }
  };

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Line</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Enter line name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <SubmitButton
                isLoading={isLoading}
                disabled={!form.formState.isValid || isLoading}
              >
                Create
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
