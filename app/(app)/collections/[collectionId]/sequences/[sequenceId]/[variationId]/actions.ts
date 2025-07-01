"use server";

import { deleteVariation } from "@/lib/api/variations";
import { Variation } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function deleteVariationAction(
  variation: Variation,
  collectionId: string
): Promise<ActionResult<void>> {
  try {
    await deleteVariation(variation.id);
    revalidatePath(
      `/collections/${collectionId}/sequences/${variation.sequence_id}`
    );
    return { ok: true };
  } catch (error) {
    console.error("Error deleting variation:", error);
    return { ok: false, error: "Failed to delete variation" };
  }
}
