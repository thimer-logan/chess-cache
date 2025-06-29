import { getSupabase } from "../supabase";
import { Line, LineWithMoves } from "../types/database.types";

export async function getVariationLines(
  variationId: string
): Promise<LineWithMoves[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("lines")
    .select("*, moves(*)")
    .eq("variation_id", variationId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getLine(lineId: string): Promise<LineWithMoves> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("lines")
    .select("*, moves(*)")
    .eq("id", lineId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createLine(
  variationId: string,
  name: string
): Promise<Line> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("lines")
    .insert({
      variation_id: variationId,
      name,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
