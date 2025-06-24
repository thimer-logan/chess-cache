import ProfileListItem from "@/components/profile-list-item";
import { Profile } from "@/lib/types/database.types";

interface FriendsListProps {
  friends: Profile[];
  currentUserId: string;
}

export default async function FriendsList({
  friends,
  currentUserId,
}: FriendsListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Current Friends</h3>
      <div className="flex flex-col gap-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ProfileListItem
              key={friend.id}
              profile={friend}
              isFriend={true}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No friends yet</p>
        )}
      </div>
    </div>
  );
}
