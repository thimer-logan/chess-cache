"use server";

import { createClient } from "@/lib/server";
import { Orientation } from "@/lib/types/database.types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVariation(variation: {
  name: string;
  sequence_id: number;
  start_fen: string;
  orientation: Orientation;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("variations")
    .insert(variation)
    .select()
    .single();

  if (error) {
    console.error("Error creating variation:", error);
    throw new Error("Failed to create variation");
  }

  revalidatePath(`/sequences/${variation.sequence_id}`);
  redirect(`/sequences/${variation.sequence_id}/${data.id}`);
}
