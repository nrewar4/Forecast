// Input validation and sanitisation for every user-input boundary.
//
// On SQL injection: this app has NO database and runs NO SQL, so there is no
// SQL-injection surface today. These helpers are defence in depth so that (a)
// nothing dangerous is ever put into an outbound API URL or into localStorage,
// and (b) if a backend is added later (the enquiry endpoint is the likely one,
// see INTEGRATION.md), every value it receives has already been length-capped
// and cleaned at the source. The server must STILL use parameterised queries and
// its own validation; client-side checks are never sufficient on their own.

// Removes control characters (C0 range and DEL), collapses whitespace, and caps
// length. Use on any free-text field before storing it or sending it anywhere.
export function sanitizeText(input: string, maxLen = 500): string {
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 0x20 || code === 0x7f ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

// A chemical name / CAS / query. Allowlist only: letters, digits, spaces and the
// small punctuation set real chemical names use. Anything else (angle brackets,
// quotes, semicolons, SQL/script metacharacters) simply cannot survive, so the
// value is always safe to place in an API path or store.
const CHEM_DISALLOWED = /[^A-Za-z0-9 ,._'()+\-/[\]]/g;
export function sanitizeChemQuery(input: string, maxLen = 120): string {
  return sanitizeText(input, maxLen).replace(CHEM_DISALLOWED, "").trim();
}

// Email shape gate (not a full RFC validator). Caps length per the spec.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(input: string): boolean {
  const v = input.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

// Flags the classic injection / XSS meta-patterns in free text so obviously
// hostile submissions can be rejected early. Kept tight to avoid false positives
// on legitimate copy (for example "Union Carbide" does not match "union select").
const MALICIOUS_RE =
  /<\s*script|<\/\s*script|javascript:|on(?:error|load|click)\s*=|\bunion\b\s+\bselect\b|\bor\b\s+1\s*=\s*1|;\s*drop\s+table\b|\bdelete\b\s+\bfrom\b|\/\*|--\s/i;
export function looksMalicious(input: string): boolean {
  return MALICIOUS_RE.test(input);
}
