import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { SITE_LINKS, type SiteLinkId } from "@/lib/site-links";
import { cn } from "@/lib/utils";

interface InfoPageProps {
  active: SiteLinkId;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function InfoPage({ active, title, description, children }: InfoPageProps) {
  return (
    <main className="relative flex min-h-screen flex-col">
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo size="sm" href="/" />
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </header>

      <nav
        aria-label="Site pages"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-1 px-6 pb-6 sm:gap-2"
      >
        {SITE_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            aria-current={active === link.id ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              active === link.id
                ? "bg-accent-muted text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <article className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pb-12 sm:px-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mb-8 text-muted">{description}</p>
        <div className="legal-prose theme-card rounded-2xl p-6 sm:p-8">
          {children}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}