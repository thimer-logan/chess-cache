"use server";

import { createClient } from "@/lib/server";
import { Variation } from "@/lib/types/database.types";
import { MoveWithVariation } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function saveVariationMoves(
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

export async function deleteVariationMoves(variation: Variation) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("moves")
    .delete()
    .eq("variation_id", variation.id);

  if (error) {
    console.error("Error deleting variation moves:", error);
    throw new Error("Failed to delete variation moves");
  }

  revalidatePath(`/sequences/${variation.sequence_id}/${variation.id}`);
  return data;
}

export async function saveVariationStartFen(variationId: number, fen: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("variations")
    .update({ start_fen: fen })
    .eq("id", variationId)
    .select()
    .single();

  if (error) {
    console.error("Error saving variation start fen:", error);
    throw new Error("Failed to save variation start fen");
  }

  revalidatePath(`/sequences/${data.sequence_id}/${variationId}`);

  return data;
}
