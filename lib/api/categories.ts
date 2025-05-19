"use server";

import { createClient } from "@/lib/server";
import { Category, CategoryWithSequences } from "@/lib/types/database.types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data;
}

export async function getCategoriesWithSequences(): Promise<
  CategoryWithSequences[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
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
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }

  return data;
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at">
): Promise<Category> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }

  return data;
}
