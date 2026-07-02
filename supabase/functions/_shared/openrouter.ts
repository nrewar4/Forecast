// Minimal OpenRouter client for the Edge Functions. Requests a web-grounded
// completion and parses the first JSON object from the reply. One retry without
// the web plugin if the first call fails.

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function completeJson<T>(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<T> {
  const messages = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  async function once(web: boolean): Promise<string> {
    const body: Record<string, unknown> = { model, messages, temperature: 0.2 };
    if (web) body.plugins = [{ id: "web", max_results: 6 }];
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": "APAC Sourcing Intelligence",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`OpenRouter error ${res.status}: ${detail.slice(0, 300)}`);
    }
    const json = await res.json();
    return (json?.choices?.[0]?.message?.content as string) ?? "";
  }

  let raw: string;
  try {
    raw = await once(true);
  } catch {
    raw = await once(false);
  }
  return parseJson<T>(raw);
}

export function parseJson<T>(raw: string): T {
  let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  return JSON.parse(text) as T;
}
