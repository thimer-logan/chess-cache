import { FriendRequest } from "@/lib/types/database.types";
import FriendRequestListItem from "./friend-request-list-item";

export default async function FriendRequests({
  friendRequests,
}: {
  friendRequests: FriendRequest[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Friend Requests</h3>
      <div className="flex flex-col gap-4">
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <FriendRequestListItem key={request.id} request={request} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No friend requests</p>
        )}
      </div>
    </div>
  );
}
