"use client";

import { shareCollectionAction } from "@/app/(app)/collections/[collectionId]/share/actions";
import SubmitButton from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from "@/lib/types/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ShareCollectionDialogProps {
  friends: Profile[];
  collectionId: string;
}

export default function ShareCollectionDialog({
  friends,
  collectionId,
}: ShareCollectionDialogProps) {
  const router = useRouter();
  const close = () => router.back();
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (!selected) return;
    setIsLoading(true);
    const result = await shareCollectionAction(collectionId, selected);
    setIsLoading(false);

    if (result.ok) {
      toast.success("Collection shared successfully");
      close();
    } else {
      toast.error("Failed to share collection");
    }
  };

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Collection</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="friend-select">
            Select a friend to share the collection with
          </Label>
          <Select onValueChange={(value) => setSelected(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a friend" />
            </SelectTrigger>
            <SelectContent>
              {friends.map((friend) => (
                <SelectItem key={friend.id} value={friend.id}>
                  {friend.first_name} {friend.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <SubmitButton
            onClick={handleShare}
            disabled={!selected}
            isLoading={isLoading}
          >
            Share
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
