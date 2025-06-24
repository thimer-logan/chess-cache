"use client";

import { FriendRequest, type Profile } from "@/lib/types/database.types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format, isValid } from "date-fns";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  acceptFriendRequestAction,
  addFriendAction,
  rejectFriendRequestAction,
  removeFriendAction,
} from "@/app/(app)/friends/actions";

interface ProfileListItemProps {
  currentUserId: string;
  profile: Profile;
  isFriend?: boolean;
  friendRequest?: FriendRequest;
}

export default function ProfileListItem({
  currentUserId,
  profile,
  isFriend = false,
  friendRequest,
}: ProfileListItemProps) {
  const createdAt = isValid(new Date(profile.created_at))
    ? format(profile.created_at, "PPP")
    : "";

  const handleAddFriend = async () => {
    try {
      const result = await addFriendAction(profile.id);
      if (result.ok) {
        toast.success("Friend request sent");
      } else {
        toast.error("Failed to send friend request");
      }
    } catch (error) {
      toast.error("Failed to send friend request");
      console.error(error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const result = await removeFriendAction(profile.id);
      if (result.ok) {
        toast.success("Friend removed");
      } else {
        toast.error("Failed to remove friend");
      }
    } catch (error) {
      toast.error("Failed to remove friend");
      console.error(error);
    }
  };

  const handleAccept = async () => {
    if (!friendRequest) return;
    const result = await acceptFriendRequestAction(friendRequest.id);
    if (result.ok) {
      toast.success("Friend request accepted");
    } else {
      toast.error(result.error);
    }
  };

  const handleReject = async () => {
    if (!friendRequest) return;
    const result = await rejectFriendRequestAction(friendRequest.id);
    if (result.ok) {
      toast.success("Friend request rejected");
    } else {
      toast.error(result.error);
    }
  };

  const renderButton = () => {
    if (isFriend) {
      return (
        <Button variant="destructive" onClick={handleRemoveFriend}>
          Remove Friend
        </Button>
      );
    }

    if (friendRequest) {
      if (friendRequest.sender_id === currentUserId) {
        return (
          <Button variant="outline" disabled>
            Pending
          </Button>
        );
      }

      return (
        <FriendRequestButtons onAccept={handleAccept} onReject={handleReject} />
      );
    }
    return <Button onClick={handleAddFriend}>Add Friend</Button>;
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2 px-4 rounded-md">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback>
            {profile.first_name.charAt(0)}
            {profile.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold">{profile.display_name}</p>
          <p className="text-sm text-muted-foreground">Joined {createdAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">{renderButton()}</div>
    </div>
  );
}

function FriendRequestButtons({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <>
      <Button onClick={onAccept}>Accept</Button>
      <Button variant="destructive" onClick={onReject}>
        Reject
      </Button>
    </>
  );
}
