import { LogoutButton } from "@/components/logout-button";
import { NavHeader } from "./nav-header";

export default function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="bg-background top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex items-center w-full gap-2 px-2 py-2 max-w-screen-lg mx-auto">
        <NavHeader />
        <div className="ml-auto flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
