"use server";

import { shareCollection } from "@/lib/api/collections";
import { CollectionShare } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";

export async function shareCollectionAction(
  collectionId: string,
  userId: string
): Promise<ActionResult<CollectionShare>> {
  try {
    const collectionShare = await shareCollection(collectionId, userId);
    return { ok: true, data: collectionShare };
  } catch (error) {
    return { ok: false, error: error as string };
  }
}
