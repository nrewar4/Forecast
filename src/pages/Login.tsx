import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/Auth";

export default function Login() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError("That username and password combination is not recognized.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,121,32,0.07),transparent_70%)]"
      />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-6 flex justify-center">
          <Link to="/" aria-label="APAC Supply Chain | CDMO home" className="press inline-block">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-lift">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Restricted area for the APAC team.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-foreground">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <p role="alert" className="animate-fade-in rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !username.trim() || !password}
              className="press inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>

          {isAdmin ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              You are already signed in.{" "}
              <Link to="/admin" className="font-semibold text-primary hover:underline">
                Open the admin dashboard
              </Link>
            </p>
          ) : null}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground hover:underline">
            Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
