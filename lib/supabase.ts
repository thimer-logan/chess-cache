export async function getSupabase() {
  console.log("typeof window", typeof window);
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
