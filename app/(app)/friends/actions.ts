"use server";

import {
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/api/friends";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function acceptFriendRequestAction(
  requestId: string
): Promise<ActionResult<void>> {
  try {
    const success = await acceptFriendRequest(requestId);

    if (success) {
      revalidatePath("/friends");
      return { ok: true, data: undefined };
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }

  return { ok: false, error: "Failed to accept friend request" };
}

export async function rejectFriendRequestAction(
  requestId: string
): Promise<ActionResult<void>> {
  try {
    const success = await rejectFriendRequest(requestId);

    if (success) {
      revalidatePath("/friends");
      return { ok: true, data: undefined };
    }
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }

  return { ok: false, error: "Failed to reject friend request" };
}

export async function addFriendAction(
  requestId: string
): Promise<ActionResult<void>> {
  try {
    const success = await sendFriendRequest(requestId);

    if (success) {
      revalidatePath("/friends");
      return { ok: true, data: undefined };
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }

  return { ok: false, error: "Failed to send friend request" };
}

export async function removeFriendAction(
  requestId: string
): Promise<ActionResult<void>> {
  try {
    const success = await removeFriend(requestId);

    if (success) {
      revalidatePath("/friends");
      return { ok: true, data: undefined };
    }
  } catch (error) {
    console.error("Error removing friend:", error);
  }

  return { ok: false, error: "Failed to remove friend" };
}
