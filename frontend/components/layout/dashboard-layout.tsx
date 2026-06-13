"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  title: string;
  description: string;
  links: {
    label: string;
    href: string;
  }[];
  children: React.ReactNode;
};

export function DashboardLayout({ title, description, links, children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/25">
      <div className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            {title}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/products">Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-lg border bg-background p-3 lg:sticky lg:top-20 lg:h-fit">
          <p className="px-3 pb-3 text-xs font-semibold uppercase text-muted-foreground">
            Navigation
          </p>
          <nav className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
                  pathname === link.href.split("?")[0] && "bg-accent text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
