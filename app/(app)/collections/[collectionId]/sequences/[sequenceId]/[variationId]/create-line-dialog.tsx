"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useParams } from "next/navigation";
import { createLineAction } from "./actions";

interface CreateLineDialogProps {
  children: React.ReactNode;
}

export default function CreateLineDialog({ children }: CreateLineDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { collectionId, sequenceId, variationId } = useParams();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a line name");
      return;
    }

    setIsLoading(true);

    const result = await createLineAction(
      name.trim(),
      variationId as string,
      collectionId as string,
      sequenceId as string
    );

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setOpen(false);
    toast.success("Line created successfully");
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Line</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            placeholder="Enter line name"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
        <DialogFooter>
          <SubmitButton
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
          >
            Create
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
