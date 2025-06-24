"use client";

import { useUserSearch } from "@/lib/hooks/useUserSearch";

import { Input } from "./ui/input";
import ProfileListItem from "./profile-list-item";
import { FriendRequest, Profile } from "@/lib/types/database.types";

interface UserSearchProps {
  friends: Profile[];
  friendRequests: FriendRequest[];
  currentUserId: string;
}

export default function UserSearch({
  friends,
  friendRequests,
  currentUserId,
}: UserSearchProps) {
  const { results, loading, setQuery } = useUserSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Search for a user"
        onChange={handleSearch}
      />
      {loading && <p className="text-sm text-gray-500">Searching…</p>}

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {results.map((u) => (
          <ProfileListItem
            key={u.id}
            profile={u}
            isFriend={friends.some((f) => f.id === u.id)}
            friendRequest={friendRequests.find(
              (request) =>
                request.receiver_id === u.id || request.sender_id === u.id
            )}
            currentUserId={currentUserId}
          />
        ))}
      </ul>
    </div>
  );
}
