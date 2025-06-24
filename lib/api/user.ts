import { getSupabase } from "../supabase";
import { Profile } from "../types/database.types";

export async function getUserProfile(
  user_id?: string
): Promise<Profile | null> {
  const supabase = await getSupabase();
  if (!user_id) {
    const { data: user } = await supabase.auth.getUser();
    user_id = user.user?.id;
  }

  if (!user_id) {
    return null;
  }

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
