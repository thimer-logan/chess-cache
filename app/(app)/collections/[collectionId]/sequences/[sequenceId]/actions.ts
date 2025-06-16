"use server";

import { deleteSequence } from "@/lib/api/sequences";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteSequenceAction(
  sequenceId: string,
  collectionId: string
): Promise<ActionResult<void>> {
  try {
    await deleteSequence(sequenceId);
  } catch (error) {
    console.error("Error deleting sequence:", error);
    return { ok: false, error: "Failed to delete sequence" };
  }

  revalidatePath(`/collections/${collectionId}`);
  redirect(`/collections/${collectionId}`);
}
