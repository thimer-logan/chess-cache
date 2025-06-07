"use server";

import { createVariation } from "@/lib/api/variations";
import { Orientation, Variation } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVariationAction(variation: {
  name: string;
  sequence_id: number;
  start_fen: string;
  orientation: Orientation;
}): Promise<ActionResult<Variation>> {
  const response: ActionResult<Variation> = {
    ok: false,
    error: "Failed to create variation",
    data: undefined,
  };

  try {
    const data = await createVariation(variation);
    response.ok = true;
    response.data = data;
  } catch (error) {
    console.error("Error creating variation:", error);
    return response;
  }

  revalidatePath(`/sequences/${variation.sequence_id}`);
  redirect(`/sequences/${variation.sequence_id}/${response.data?.id}`);
}
