import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import SiteHeader from "@/components/site-header";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chess App",
  description: "A chess application for learning and practicing",
};

export default async function RootLayout({
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <SiteHeader />
        <main className="mx-auto my-0 p-6 max-w-screen-lg">
          <div className="flex flex-1">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
