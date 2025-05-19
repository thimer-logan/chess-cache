"use server";

import { createClient } from "@/lib/server";
import { Sequence } from "@/lib/types/database.types";
import { revalidatePath } from "next/cache";

export async function createSequence(sequence: {
  name: string;
  category_id: number;
}): Promise<Sequence> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sequences")
    .insert(sequence)
    .select()
    .single();

  if (error) {
    console.error("Error creating sequence:", error);
    throw new Error("Failed to create sequence");
  }

  // Revalidate the home page to show the new sequence
  revalidatePath("/");

  return data;
}
