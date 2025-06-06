import { Sequence, SequenceWithVariations } from "@/lib/types/database.types";
import { getSupabase } from "../supabase";

export async function getSequence(id: string): Promise<Sequence> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSequenceWithVariations(
  id: string
): Promise<SequenceWithVariations> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("sequences")
    .select("*, variations(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createSequence(sequence: {
  name: string;
  collection_id: number;
}): Promise<Sequence> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("sequences")
    .insert(sequence)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSequence(id: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase.from("sequences").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
