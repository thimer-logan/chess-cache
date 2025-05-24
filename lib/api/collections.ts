"use server";

import { createClient } from "@/lib/server";
import {
  Collection,
  CollectionWithSequences,
} from "@/lib/types/database.types";

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collections:", error);
    throw new Error("Failed to fetch collections");
  }

  return data;
}

export async function getCollectionsWithSequences(): Promise<
  CollectionWithSequences[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select(
      `
      *,
      sequences (
        id,
        name,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collections:", error);
    throw new Error("Failed to fetch collections");
  }

  return data;
}

export async function getCollectionById(
  id: string
): Promise<Collection | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching collection:", error);
    throw new Error("Failed to fetch collection");
  }

  return data;
}
