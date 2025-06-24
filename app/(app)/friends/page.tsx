import FriendsList from "./friends-list";
import FriendRequests from "./friend-requests";
import UserSearch from "@/components/user-search";
import {
  getFriendRequests,
  getFriends,
  getSentFriendRequests,
} from "@/lib/api/friends";
import { getUserProfile } from "@/lib/api/user";

export default async function FriendsPage() {
  const [friends, friendRequests, sentFriendRequests, currentUser] =
    await Promise.all([
      getFriends(),
      getFriendRequests(),
      getSentFriendRequests(),
      getUserProfile(),
    ]);

  const allFriendRequests = [...friendRequests, ...sentFriendRequests];

  return (
    <div className="flex flex-col flex-1 gap-6 p-4">
      <h1 className="text-2xl font-bold">Friends</h1>
      {currentUser && (
        <>
          <UserSearch
            friends={friends}
            friendRequests={allFriendRequests}
            currentUserId={currentUser?.id}
          />

          <div className="flex flex-col gap-6">
            <FriendsList friends={friends} currentUserId={currentUser?.id} />
            <FriendRequests friendRequests={friendRequests} />
          </div>
        </>
      )}
    </div>
  );
}
