"use server";

import { deleteCollection, updateCollection } from "@/lib/api/collections";
import { createSequence } from "@/lib/api/sequences";
import { Collection, Sequence } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCollectionAction(collection: {
  id: number;
  name: string;
  image: string;
}): Promise<ActionResult<Collection>> {
  try {
    const data = await updateCollection(collection);
    revalidatePath("/collections");
    return { ok: true, data };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { ok: false, error: "Failed to update collection" };
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
  redirect("/collections");
}

export async function createSequenceAction(
  collectionId: string,
  name: string
): Promise<ActionResult<Sequence>> {
  let data: Sequence | null = null;

  try {
    data = await createSequence({
      name,
      collection_id: parseInt(collectionId),
    });
    revalidatePath(`/collections/${collectionId}`);
  } catch (error) {
    console.error("Error creating sequence:", error);
    return { ok: false, error: "Failed to create sequence" };
  }

  if (data) {
    redirect(`/collections/${collectionId}/sequences/${data.id}`);
  }

  return { ok: false, error: "Failed to create sequence" };
}
