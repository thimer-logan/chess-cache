export async function getSupabase() {
  if (typeof window === "undefined") {
    const { createClient } = await import(
      /* webpackMode: "eager" */
      "@/lib/server"
    );
    return await createClient();
  }

  const { createClient } = await import(
    /* webpackMode: "eager" */
    "@/lib/client"
  );
  return createClient();
}
