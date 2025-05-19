"use server";

import { createClient } from "@/lib/server";
import { Sequence, SequenceWithVariations } from "@/lib/types/database.types";

export async function getSequence(id: string): Promise<Sequence> {
  const supabase = await createClient();

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
  const supabase = await createClient();

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
