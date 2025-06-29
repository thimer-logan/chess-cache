"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { MoveWithLine } from "@/lib/types/utils";
import { redirect } from "next/navigation";
import { deleteLine } from "@/lib/api/lines";
import { ActionResult } from "@/lib/types/utils";

export async function saveLineMovesAction(
  lineId: number,
  variationId: number,
  sequenceId: number,
  collectionId: string,
  moves: MoveWithLine[]
) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("moves")
    .delete()
    .eq("line_id", lineId);

  if (deleteError) {
    console.error("Error deleting variation moves:", deleteError);
    throw new Error("Failed to delete variation moves");
  }

  // Physically remove id field from each move
  const cleanedMoves = moves.map((move) => ({
    fen: move.fen,
    ply: move.ply,
    san: move.san,
    line_id: lineId,
  }));
  const { data, error } = await supabase
    .from("moves")
    .upsert(cleanedMoves)
    .select();

  if (error) {
    console.error("Error saving variation:", error);
    throw new Error("Failed to save variation");
  }

  revalidatePath(
    `/collections/${collectionId}/sequences/${sequenceId}/${variationId}/${lineId}`
  );
  return data;
}

export async function deleteLineAction(
  lineId: number,
  variationId: number,
  sequenceId: number,
  collectionId: string
): Promise<ActionResult<void>> {
  try {
    await deleteLine(lineId.toString());
  } catch (error) {
    console.error("Error deleting line:", error);
    return { ok: false, error: "Failed to delete line" };
  }

  revalidatePath(
    `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
  );
  redirect(
    `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
  );
}
