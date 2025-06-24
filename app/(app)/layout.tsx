import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import SiteHeader from "@/components/site-header";
import { getUserProfile } from "@/lib/api/user";

export default async function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data?.user?.id) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile(data.user.id);

  if (!profile) {
    redirect("/auth/login");
  }

  const isAuthPage =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/auth");
  if (isAuthPage && error) {
    redirect("/auth/login");
  }

  return (
    <>
      <SiteHeader user={data?.user} profile={profile} />
      <main className="mx-auto my-0 p-6 max-w-screen-lg">
        <div className="flex flex-1">{children}</div>
      </main>
      {modal}
    </>
  );
}
