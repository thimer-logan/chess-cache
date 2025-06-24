import { getSupabase } from "@/lib/supabase";
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

export async function getSentFriendRequests(): Promise<FriendRequest[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc(
    "get_pending_sent_friend_requests"
  );

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

export async function rejectFriendRequest(requestId: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase.rpc("decline_friend_request", {
    p_request_id: requestId,
  });

  if (error) {
    console.error("Could not decline request:", error.message);
    return false;
  }

  return true;
}

export async function sendFriendRequest(receiverId: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not found");
  }

  const { error } = await supabase.from("friend_requests").insert({
    sender_id: user.user.id,
    receiver_id: receiverId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function removeFriend(friendId: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase.rpc("remove_friend", {
    p_friend_id: friendId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
