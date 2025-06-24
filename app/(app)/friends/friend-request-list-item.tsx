"use client";

import {
  acceptFriendRequestAction,
  rejectFriendRequestAction,
} from "./actions";
import { FriendRequest } from "@/lib/types/database.types";
import { isValid } from "date-fns";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function FriendRequestListItem({
  request,
}: {
  request: FriendRequest;
}) {
  const sentAt = isValid(new Date(request.sent_at))
    ? format(request.sent_at, "PPP")
    : "";

  const handleAccept = async () => {
    const result = await acceptFriendRequestAction(request.id);
    if (result.ok) {
      toast.success("Friend request accepted");
    } else {
      toast.error(result.error);
    }
  };

  const handleReject = async () => {
    const result = await rejectFriendRequestAction(request.id);
    if (result.ok) {
      toast.success("Friend request rejected");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2 px-4 rounded-md">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback>
            {request.first_name.charAt(0)}
            {request.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-bold">{request.display_name}</p>
          <p className="text-sm text-muted-foreground">Sent {sentAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleAccept}>Accept</Button>
        <Button variant="destructive" onClick={handleReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}
