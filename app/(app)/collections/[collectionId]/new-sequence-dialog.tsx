"use client";

import { createSequenceAction } from "./actions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/submit-button";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
});

export default function NewSequenceDialog() {
  const { collectionId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showNew = searchParams.get("new") === "true";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await createSequenceAction(
      collectionId as string,
      values.name
    );
    setIsLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Sequence created successfully");
  };

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("new");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Dialog open={showNew} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sequence</DialogTitle>
          <DialogDescription>
            Create a new sequence for this collection.
          </DialogDescription>
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
                    <Input placeholder="Enter sequence name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <SubmitButton
                isLoading={isLoading}
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                Create
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
