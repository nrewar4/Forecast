// Admin authentication. Sessions live in localStorage so a signed-in admin
// stays signed in across reloads; they expire after SESSION_HOURS.
//
// Credentials are checked against a SHA-256 hash so the plain password never
// ships in the bundle. Override without code changes via .env:
//   VITE_ADMIN_USERNAME          (default "admin")
//   VITE_ADMIN_PASSWORD_SHA256   (hex sha256 of the password)

const SESSION_KEY = "apac.admin_session.v1";
const SESSION_HOURS = 24 * 7;

const ADMIN_USERNAME =
  (import.meta.env.VITE_ADMIN_USERNAME as string | undefined) || "admin";

// Default password: apacss@2026
const ADMIN_PASSWORD_SHA256 =
  (import.meta.env.VITE_ADMIN_PASSWORD_SHA256 as string | undefined) ||
  "28ce0c0f124f4a49f23ba45bfa1a40499f086504cf7a5551a9bfe5b64afc86d2";

export type AdminSession = {
  username: string;
  token: string;
  createdAt: number;
  expiresAt: number;
};

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session?.token || Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME.toLowerCase()) return false;
  const hash = await sha256Hex(password);
  return hash === ADMIN_PASSWORD_SHA256.toLowerCase();
}

export function createSession(username: string): AdminSession {
  const now = Date.now();
  const session: AdminSession = {
    username,
    token: crypto.randomUUID(),
    createdAt: now,
    expiresAt: now + SESSION_HOURS * 60 * 60 * 1000,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable (private mode); the session lasts for this tab only
  }
  return session;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
