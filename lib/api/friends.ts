import { getSupabase } from "../supabase";
import { FriendRequest, Profile } from "../types/database.types";

export async function getFriends(): Promise<Profile[]> {
  const supabase = await getSupabase();

  const { data: friends, error } = await supabase.rpc("get_my_friends");

  if (error) {
    throw new Error(error.message);
  }

  return friends;
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase.rpc("get_pending_friend_requests");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase.rpc("accept_friend_request", {
    p_request_id: requestId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
