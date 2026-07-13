// Calls the ASKCOS single-step retrosynthesis API via the Vite dev proxy.
// Returns { precursor_sets: [] } on any network/CORS/404 error so the
// orchestrator can silently fall back to Claude-only generation.

export type AskcosPreset = {
  smiles: string[];   // all reactants for this disconnection
  score: number;      // model confidence 0-1
  template: string;   // reaction SMARTS or template description
};

export type AskcosResult = {
  precursor_sets: AskcosPreset[];
};

// ASKCOS has shifted endpoint paths across versions. Try both in sequence.
const ENDPOINTS = [
  "/askcos-proxy/api/v2/retro/",
  "/askcos-proxy/api/v2/singlestep/",
];

function normaliseSet(s: Record<string, unknown>): AskcosPreset {
  const rawSmiles = s.smiles;
  const smiles: string[] = Array.isArray(rawSmiles)
    ? (rawSmiles as string[]).filter(Boolean)
    : typeof rawSmiles === "string" && rawSmiles
      ? [rawSmiles]
      : [];

  const score =
    typeof s.score === "number"
      ? s.score
      : typeof s.plausibility === "number"
        ? (s.plausibility as number)
        : 0;

  const template =
    typeof s.template === "string"
      ? s.template
      : typeof s.reaction_smarts === "string"
        ? (s.reaction_smarts as string)
        : "";

  return { smiles, score, template };
}

export async function getRetroSteps(
  smiles: string,
  signal?: AbortSignal,
): Promise<AskcosResult> {
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles, num_results: 5, max_depth: 1 }),
        signal,
      });

      if (res.status === 404) continue; // try next endpoint path
      if (!res.ok) return { precursor_sets: [] };

      const json = (await res.json()) as Record<string, unknown>;
      // ASKCOS v2 may wrap results under "output" or "precursor_sets"
      const raw = Array.isArray(json.output)
        ? (json.output as Record<string, unknown>[])
        : Array.isArray(json.precursor_sets)
          ? (json.precursor_sets as Record<string, unknown>[])
          : [];

      return { precursor_sets: raw.map(normaliseSet) };
    } catch (err) {
      if (signal?.aborted) throw err;
      // Network/CORS error, try next endpoint, then fall through to empty result
    }
  }
  return { precursor_sets: [] };
}
