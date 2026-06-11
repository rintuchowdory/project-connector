import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Radar, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Start" },
  { to: "/rechner", label: "Renten-Rechner" },
  { to: "/coach", label: "KI Coach" },
] as const;

export function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Renten<span className="text-accent">Radar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === item.to && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profil">Profil</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Abmelden
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">Anmelden</Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profil" onClick={() => setOpen(false)}>
                      Profil
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Abmelden
                  </Button>
                </>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Anmelden
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
