"use server";

import { createLine } from "@/lib/api/lines";
import { deleteVariation } from "@/lib/api/variations";
import { Line, Variation } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function createLineAction(
  name: string,
  variationId: string,
  collectionId: string,
  sequenceId: string
): Promise<ActionResult<Line>> {
  try {
    const data = await createLine(variationId, name);
    revalidatePath(
      `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
    );
    return { ok: true, data };
  } catch (error) {
    console.error("Error creating line:", error);
    return { ok: false, error: "Failed to create line" };
  }
}

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
