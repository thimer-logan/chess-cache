import {
  Collection,
  CollectionShare,
  CollectionWithSequences,
} from "@/lib/types/database.types";
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export async function getCollections(): Promise<Collection[]> {
  const supabase = await getSupabase();

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
  const supabase = await getSupabase();

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

export async function getCollectionById(id: string): Promise<Collection> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export async function createCollection(collection: {
  name: string;
  image: string;
}): Promise<Collection> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("collections")
    .insert(collection)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCollection(collectionId: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);

  if (error) {
    throw error;
  }

  return true;
}

export async function updateCollection(collection: {
  id: number;
  name: string;
  image: string;
}): Promise<Collection> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("collections")
    .update(collection)
    .eq("id", collection.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function shareCollection(
  collectionId: string,
  userId: string
): Promise<CollectionShare> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("collection_shares")
    .insert({
      collection_id: collectionId,
      target_user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
