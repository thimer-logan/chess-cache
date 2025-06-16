"use server";

import { createCollection } from "@/lib/api/collections";
import { Collection } from "@/lib/types/database.types";
import { ActionResult } from "@/lib/types/utils";
import { revalidatePath } from "next/cache";

export async function createCollectionAction(collection: {
  name: string;
  image: string;
}): Promise<ActionResult<Collection>> {
  try {
    const data = await createCollection(collection);

    revalidatePath("/collections");
    return { ok: true, data };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { ok: false, error: "Failed to create collection" };
  }
}
