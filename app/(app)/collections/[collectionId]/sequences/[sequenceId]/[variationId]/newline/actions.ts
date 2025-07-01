"use server";

import { createLine } from "@/lib/api/lines";
import { Line } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLineAction(
  name: string,
  variationId: string,
  collectionId: string,
  sequenceId: string
): Promise<ActionResult<Line>> {
  let newLineId: number | null = null;

  try {
    const data = await createLine(variationId, name);
    newLineId = data.id;
    revalidatePath(
      `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
    );
  } catch (error) {
    console.error("Error creating line:", error);
    return { ok: false, error: "Failed to create line" };
  }

  if (newLineId !== null) {
    redirect(
      `/collections/${collectionId}/sequences/${sequenceId}/${variationId}/${newLineId}`
    );
  } else {
    redirect(
      `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
    );
  }
}
