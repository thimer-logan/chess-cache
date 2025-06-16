"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import Image from "next/image";

export function NavHeader() {
  const pathname = usePathname();

  return (
    <div className="flex w-full items-center gap-6 px-2 sm:px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent title="Chess" side="left">
          <SheetTitle className="hidden">Chess</SheetTitle>
          <div className="grid gap-2 py-6 px-4">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/friends"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Friends
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="hidden sm:flex items-center gap-2">
        <Image src="/logo.png" alt="Chess" width={32} height={32} />
        <h2 className="text-lg font-bold">ChessCache</h2>
      </Link>
      <NavigationMenu className="hidden sm:flex">
        <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname === "/collections"}
            >
              <Link href="/collections">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild data-active={pathname === "/friends"}>
              <Link href="/friends">Friends</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
