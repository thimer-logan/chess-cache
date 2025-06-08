"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCollectionAction } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteCollectionDialog() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDelete = searchParams.get("delete") === "true";
  const collectionId = searchParams.get("collectionId");

  const handleDelete = async () => {
    if (!collectionId) {
      toast.error("Collection ID is required");
      return;
    }

    setIsDeleting(true);
    const result = await deleteCollectionAction(collectionId);
    setIsDeleting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Collection deleted successfully");
    router.push("/collections");
  };

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("delete");
    params.delete("collectionId");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <AlertDialog
      open={showDelete && !!collectionId}
      onOpenChange={handleCancel}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this collection?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            collection and all its sequences.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              variant="destructive"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </SubmitButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
