"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Heart, Map, User } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isExplore = pathname?.startsWith("/explore");
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "z-40 w-full",
        isExplore
          ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-cream/95 to-transparent"
          : "relative bg-cream/80 backdrop-blur-md border-b border-mist"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-forest md:text-3xl">
            {brand.name}
          </span>
          {!isExplore && (
            <span className="hidden text-sm text-moss/80 sm:inline">weekend escapes</span>
          )}
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-forest hover:bg-mist/80"
          >
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
          </Link>
          <Link
            href="/account/saved"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-forest hover:bg-mist/80"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-2 text-sm font-medium text-cream hover:bg-moss"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
