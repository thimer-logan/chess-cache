"use server";

import { createCollection, deleteCollection } from "@/lib/api/collections";
import { createSequence } from "@/lib/api/sequences";
import { Collection, Sequence } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function createSequenceAction(sequence: {
  name: string;
  collection_id: number;
}): Promise<ActionResult<Sequence>> {
  try {
    const data = await createSequence(sequence);

    revalidatePath("/collections");
    return { ok: true, data };
  } catch (error) {
    console.error("Error creating sequence:", error);
    return { ok: false, error: "Failed to create sequence" };
  }
}

export async function createCollectionAction(collection: {
  name: string;
}): Promise<ActionResult<Collection>> {
  try {
    const data = await createCollection(collection);

    revalidatePath("/collections");
    return { ok: true, data };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { ok: false, error: "Failed to create collection" };
  }
}

export async function deleteCollectionAction(
  collectionId: string
): Promise<ActionResult<void>> {
  try {
    await deleteCollection(collectionId);
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { ok: false, error: "Failed to delete collection" };
  }

  revalidatePath("/collections");
  return { ok: true };
}
