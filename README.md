# litellm-proxy-thinking

Bundled provider policy for litellm-proxy thinking profiles in OpenClaw.

## Why

OpenClaw routes all models through a `litellm-proxy` provider. The `/think` menu
shows the same base levels for every model regardless of what they actually
support. This provider policy fixes it so each model only shows levels it
supports.

## How it works

OpenClaw's thinking resolver first tries `resolveActiveThinkingProvider()` (plugin
registry — fails for litellm-proxy), then falls back to
`resolveBundledProviderPolicySurface("litellm-proxy")` which loads
`provider-policy-api.js` from `/app/dist/extensions/litellm-proxy/`.

## Files

- `provider-policy-api.js` — exports `resolveThinkingProfile`
- `openclaw.plugin.json` — plugin manifest

## Auto-recovery

`container-setup.sh` restores these files from this GitHub repo on every
container recreate.
