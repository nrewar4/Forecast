// Admin authentication. This is a client-side gate: it controls which pages and
// navigation the browser shows. The admin password is checked as a SHA-256 hash
// so the plain text never sits in the bundle, and the session is a random token
// in localStorage with an expiry.
//
// Configure the password by setting VITE_ADMIN_PASSWORD_HASH in .env to the
// SHA-256 hex of your password. Without it, the default password is "apac-admin".
// For real multi-user security move to Supabase Auth; this gate is for keeping
// internal tooling out of casual view, not for protecting secrets.

const SESSION_KEY = "apac.auth.session.v1";
const SESSION_HOURS = 12;

// SHA-256("apac-admin")
const DEFAULT_HASH = "071668717afe20902480153d05e4a0d99d834ac9e3af40acdba198162b7d5ebf";

const ENV_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH as string | undefined)?.trim();

export const ADMIN_USERNAME = "admin";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type Session = { token: string; user: string; expiresAt: number };

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s.token || !s.expiresAt || Date.now() > s.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function isAdminSession(): boolean {
  return readSession() !== null;
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME) return false;
  const hash = await sha256Hex(password);
  const expected = ENV_HASH || DEFAULT_HASH;
  if (hash !== expected.toLowerCase()) return false;
  const session: Session = {
    token: crypto.randomUUID(),
    user: ADMIN_USERNAME,
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return false;
  }
  return true;
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
