import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/account");

  return (
    <div className="min-h-screen bg-[#f0ebe3]">
      <header className="border-b border-mist bg-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl font-semibold text-forest">
              {brand.name} Admin
            </Link>
            <nav className="hidden gap-4 text-sm font-medium text-ink/70 md:flex">
              <Link href="/admin" className="hover:text-forest">
                Dashboard
              </Link>
              <Link href="/admin/partners" className="hover:text-forest">
                Partners
              </Link>
              <Link href="/admin/properties" className="hover:text-forest">
                Properties
              </Link>
              <Link href="/admin/bookings" className="hover:text-forest">
                Bookings
              </Link>
              <Link href="/" className="hover:text-forest">
                ← Site
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink/50 sm:inline">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
        <nav className="flex gap-3 overflow-x-auto border-t border-mist px-4 py-2 text-sm md:hidden">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/partners">Partners</Link>
          <Link href="/admin/properties">Properties</Link>
          <Link href="/admin/bookings">Bookings</Link>
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
