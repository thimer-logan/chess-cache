"use server";

import { createClient } from "@/lib/server";
import { Move, Variation } from "@/lib/types/database.types";

export async function getVariations(sequenceId: string): Promise<Variation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("variations")
    .select("*")
    .eq("sequence_id", sequenceId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getVariationMoves(variationId: string): Promise<Move[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("moves")
    .select("*")
    .eq("variation_id", variationId)
    .order("ply", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
