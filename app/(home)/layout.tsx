import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import SiteHeader from "@/components/site-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  const isAuthPage =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/auth");
  if (isAuthPage && (error || !data?.user)) {
    redirect("/auth/login");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto my-0 p-6 max-w-screen-lg">
        <div className="flex flex-1">{children}</div>
      </main>
    </>
  );
}
