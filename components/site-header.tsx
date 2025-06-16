import { User } from "@supabase/supabase-js";
import { NavHeader } from "./nav-header";
import NavUser from "./nav-user";
import { Profile } from "@/lib/types/database.types";

interface SiteHeaderProps {
  user: User;
  profile: Profile;
}

export default function SiteHeader({ user, profile }: SiteHeaderProps) {
  return (
    <header
      data-slot="site-header"
      className="bg-background top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex items-center w-full gap-2 px-2 py-2 max-w-screen-lg mx-auto">
        <NavHeader />
        <div className="ml-auto">
          <NavUser user={user} profile={profile} />
        </div>
      </div>
    </header>
  );
}
