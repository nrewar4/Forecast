import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, Lock, User } from "lucide-react";
import { useAuth } from "@/context/Auth";
import { Logo } from "@/components/layout/Logo";

// Admin sign-in. On success the visitor returns to the page they were heading
// for (the route guard stores it in location.state.from).
export default function Login() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await login(username, password);
    setBusy(false);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError("Wrong username or password.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4">

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="APAC Supply Chain home" className="press">
            <Logo className="h-14 w-auto" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-ink">Admin sign in</h1>
              <p className="text-xs text-muted-foreground">Restricted area for the APAC team</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Username
              </span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </label>

            {error ? (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="press inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>

          {isAdmin ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              You are already signed in.{" "}
              <Link to="/admin" className="font-semibold text-primary hover:underline">
                Go to the dashboard
              </Link>
            </p>
          ) : null}
        </div>

        <Link
          to="/"
          className="press mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </div>
  );
}
