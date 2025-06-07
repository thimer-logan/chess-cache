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
import { deleteSequenceAction } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

export default function DeleteSequenceDialog({
  sequenceId,
}: {
  sequenceId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDelete = searchParams.get("delete") === "true";

  const handleDelete = async () => {
    await deleteSequenceAction(sequenceId);
    router.push("/");
  };

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("delete");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <AlertDialog open={showDelete} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sequence</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            sequence and all its variations from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
