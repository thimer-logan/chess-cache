"use server";

import {
  deleteVariationMoves,
  saveVariationStartFen,
} from "@/lib/api/variations";
import { createClient } from "@/lib/server";
import { Variation } from "@/lib/types/database.types";
import { ActionResult, MoveWithVariation } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function saveVariationMovesAction(
  variationId: number,
  sequenceId: number,
  moves: MoveWithVariation[]
) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("moves")
    .delete()
    .eq("variation_id", variationId);

  if (deleteError) {
    console.error("Error deleting variation moves:", deleteError);
    throw new Error("Failed to delete variation moves");
  }

  // Physically remove id field from each move
  const cleanedMoves = moves.map((move) => ({
    fen: move.fen,
    ply: move.ply,
    san: move.san,
    variation_id: move.variation_id,
  }));
  const { data, error } = await supabase
    .from("moves")
    .upsert(cleanedMoves)
    .select();

  if (error) {
    console.error("Error saving variation:", error);
    throw new Error("Failed to save variation");
  }

  revalidatePath(`/sequences/${sequenceId}/${variationId}`);
  return data;
}

export async function deleteVariationMovesAction(
  variation: Variation
): Promise<ActionResult<void>> {
  try {
    await deleteVariationMoves(variation.id);

    revalidatePath(`/sequences/${variation.sequence_id}/${variation.id}`);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting variation moves:", error);
    return { ok: false, error: "Failed to delete variation moves" };
  }
}

export async function saveVariationStartFenAction(
  variationId: number,
  fen: string
): Promise<ActionResult<Variation>> {
  try {
    const data = await saveVariationStartFen(variationId, fen);

    revalidatePath(`/sequences/${data.sequence_id}/${variationId}`);
    return { ok: true, data };
  } catch (error) {
    console.error("Error saving variation start fen:", error);
    return { ok: false, error: "Failed to save variation start fen" };
  }
}
