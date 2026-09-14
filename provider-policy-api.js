const RANKS = { off: 0, minimal: 10, low: 20, medium: 30, high: 40, xhigh: 60 };

// Models whose only reasoning control is binary on/off (supported_reasoning_efforts: [low]).
// Synced with openclaw-config models.yaml 2026-09-14: qwen and kimi moved to graded
// efforts (qwen: low/medium/high; kimi: low/medium/high/xhigh) — only minimax is binary now.
const BINARY_MODELS = new Set(["minimax"]);

const NO_MINIMAL_PROVIDERS = new Set([
  "deepseek", "deepseek-flash", "glm", "kimi", "qwen", "minimax",
  "gpt5", "gpt5-pro", "sonnet", "gemini-flash", "gemini-pro"
]);

function resolveThinkingProfile({ modelId, compat }) {
  const id = (modelId || "").toLowerCase().trim();
  const efforts = compat?.supportedReasoningEfforts;
  const noMinimal = NO_MINIMAL_PROVIDERS.has(id);

  // 1. If compat is available, use it (stays aligned with models.yaml automatically)
  if (Array.isArray(efforts) && efforts.length > 0) {
    if (efforts.length === 1 && efforts[0] === "low") {
      return {
        levels: [{ id: "off", label: "off" }, { id: "low", label: "on" }],
        defaultLevel: "off",
      };
    }
    const ids = ["off"];
    if (!noMinimal) ids.push("minimal");
    for (const effort of efforts) {
      if (effort !== "off" && !ids.includes(effort)) ids.push(effort);
    }
    ids.sort((a, b) => (RANKS[a] ?? 999) - (RANKS[b] ?? 999));
    return {
      levels: ids.map((l) => ({ id: l, label: l })),
      defaultLevel: "off",
    };
  }

  // 2. Fallback: use BINARY_MODELS set when compat is unavailable
  if (BINARY_MODELS.has(id)) {
    return {
      levels: [{ id: "off", label: "off" }, { id: "low", label: "on" }],
      defaultLevel: "off",
    };
  }

  // 3. Unknown model with no compat → undefined (fall through to OpenClaw base logic)
  return undefined;
}

export { resolveThinkingProfile };
