# REA M1 — native shared runtime candidate

Status: **CODE_CANDIDATE / NOT RUNTIME_ACCEPTED**. This is an implementation starting point, not evidence of successful build or real-site analysis. Follow [shared runtime contract](../REA-SHARED-RUNTIME-PLAN.md).

The image puts REA 6.7.0 and system Chromium in the same container. Chromium owns navigation; REA CLI performs the actual passive page and bundle analysis over loopback CDP. Every invocation receives a disposable browser profile, prints explicit failures, and closes the browser in finally. No host Docker socket, network listener, existing user profile, Codex credentials or production data are mounted.

## Build and run on an authorized Docker host

```sh
docker build -t loong-rea:m1 01-reverse-engineering/shared-runtime
docker run --rm --init --network bridge --memory=1g --cpus=1 --pids-limit=128 \
  --cap-drop=ALL --security-opt=no-new-privileges \
  -v "$PWD/.rea-output:/output" loong-rea:m1 --versions
docker run --rm --init --network bridge --memory=1g --cpus=1 --pids-limit=128 \
  --cap-drop=ALL --security-opt=no-new-privileges \
  -v "$PWD/.rea-output:/output" loong-rea:m1 \
  https://developer.mozilla.org/en-US/docs/Web/JavaScript /output
```

Do **not** add `--no-sandbox` to conceal Chromium sandbox errors. Confirm actual image build, non-root launch, Chromium sandbox/namespace compatibility, HTTPS CA trust, REA CLI version output, and observed script parse counts. On browsers with `--disable-dev-shm-usage` requirements, investigate host constraints first. The image is not pinned by digest; a formal reproducibility acceptance must lock the exact base and Debian package versions, plus upstream package integrity.

## Required acceptance

1. `--versions` returns supported REA and Chromium versions; build is repeatable from clean cache.
2. Existing fixture acceptance is reproduced in **this** container, not merely cited from an earlier execution host.
3. Real public HTTPS site: read `inspect.json` and `bundle.json` to confirm REA evidence, parsed script count, completeness, policy filters, and any parse failures. Do not accept a zero-result bundle as success. Respect the site's robots/terms, do not authenticate or bypass access controls.
4. Reject TLS trust bypasses. If a proxy is used, install its authorized CA through the standard trust store; do not use `--ignore-certificate-errors`, `NODE_TLS_REJECT_UNAUTHORIZED=0` or Chromium insecure flags.
5. Inspect whether raw JSON contains secrets or personal data before publishing a **redacted** evidence summary. State DIRECT / INFERRED / UNKNOWN separately.
6. Independently verify cleanup, timeout behavior, container exit status and no leftover browser; test nonzero exit on unreachable website.
7. Only after these checks mark M1 RUNTIME_ACCEPTED, then arrange M2 on an authorized host. Current GitHub connector is not a Hetzner shell.

`.rea-output/` is local and must never be committed. This candidate intentionally does not add an MCP server, watcher, persistent daemon or public API.
