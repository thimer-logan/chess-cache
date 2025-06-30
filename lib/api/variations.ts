"use server";

import {
  Move,
  Orientation,
  Variation,
  VariationWithFullLines,
  VariationWithLines,
} from "@/lib/types/database.types";
import { getSupabase } from "../supabase";
import { MoveWithLine } from "../types/utils";

export async function getVariations(sequenceId: string): Promise<Variation[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .select("*")
    .eq("sequence_id", sequenceId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getVariation(variationId: string): Promise<Variation> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .select("*")
    .eq("id", variationId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getVariationMoves(variationId: string): Promise<Move[]> {
  const supabase = await getSupabase();

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

export async function getVariationsWithFullLines(
  sequenceId: string
): Promise<VariationWithFullLines[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .select("*, lines(*, moves(*))")
    .eq("sequence_id", sequenceId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getVariationsWithLines(
  sequenceId: string
): Promise<VariationWithLines[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .select("*, lines(*)")
    .eq("sequence_id", sequenceId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getVariationWithLines(
  variationId: string
): Promise<VariationWithFullLines> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .select("*, lines(*, moves(*))")
    .eq("id", variationId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createVariation(variation: {
  name: string;
  sequence_id: number;
  start_fen: string;
  orientation: Orientation;
}): Promise<Variation> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .insert(variation)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteVariation(variationId: number): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("variations")
    .delete()
    .eq("id", variationId);

  if (error) {
    throw error;
  }

  return true;
}

export async function deleteVariationMoves(
  variationId: number
): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("moves")
    .delete()
    .eq("variation_id", variationId);

  if (error) {
    throw error;
  }

  return true;
}

export async function saveVariationStartFen(
  variationId: number,
  fen: string
): Promise<Variation> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("variations")
    .update({ start_fen: fen })
    .eq("id", variationId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveVariationMoves(
  variationId: number,
  moves: MoveWithLine[]
): Promise<Move[]> {
  // TODO: Need to transform this into a single atomic operation.
  const supabase = await getSupabase();

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
    variation_id: variationId,
  }));

  const { data, error } = await supabase
    .from("moves")
    .upsert(cleanedMoves)
    .select();

  if (error) {
    throw error;
  }

  return data;
}
