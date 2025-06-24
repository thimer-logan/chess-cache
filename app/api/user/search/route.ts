import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/server";

export const runtime = "edge";

const QuerySchema = z.object({
  q: z.string().min(2).max(50),
  limit: z.coerce.number().int().positive().max(20).default(10),
});

export async function GET(req: Request) {
  const params = QuerySchema.safeParse(
    Object.fromEntries(new URL(req.url).searchParams)
  );

  if (!params.success) {
    return NextResponse.json({ message: "Bad query" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`display_name.ilike.*${params.data.q}*`)
    .order("display_name", { ascending: true })
    .limit(params.data.limit);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
