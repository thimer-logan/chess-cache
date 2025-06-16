import { getSupabase } from "../supabase";
import { Profile } from "../types/database.types";

export async function getUserProfile(user_id: string): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
  }

  return data;
}
