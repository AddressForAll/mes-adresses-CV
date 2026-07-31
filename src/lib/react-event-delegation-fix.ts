/**
 * Restores React event delegation for the App Router root.
 *
 * `evergreen-ui`'s `toaster` singleton is constructed at *module import time*
 * (`toaster/src/index.js` is literally `var toaster = new Toaster()`). Its
 * constructor appends a `<div data-evergreen-toaster-container>` to `<body>`
 * and mounts its own React root on it — before Next.js hydrates the page.
 *
 * Creating that root makes react-dom run `listenToAllSupportedEvents(container)`,
 * which registers the delegated listeners on the container and then flags the
 * container's *ownerDocument* — `document._reactListening<hash> = true` — as it
 * registers `selectionchange` there.
 *
 * The App Router hydrates with `document` itself as the container, so react-dom
 * then calls `listenToAllSupportedEvents(document)`, sees that flag already set,
 * and returns early. The app root ends up with **no delegated listeners at all**:
 * React renders and updates correctly, but no synthetic event (`onClick`,
 * `onChange`, …) ever fires anywhere in the app, and nothing is logged.
 *
 * Clearing the flag before hydration lets the app root register its listeners
 * normally. Evergreen's toaster root keeps the ones it already registered on its
 * own container, so toasts are unaffected.
 *
 * Two things about the placement are load-bearing:
 *
 * 1. This module is imported from `instrumentation-client.ts`, which Next runs
 *    *before* it hydrates. A regular client component is too late: its module is
 *    only evaluated while React renders, i.e. after `hydrateRoot` has already
 *    given up on registering listeners.
 * 2. `toaster` is imported *by name* and touched below. `evergreen-ui` is marked
 *    side-effect-free, so a bare `import "evergreen-ui"` is dropped by the
 *    bundler and the toaster would then initialise later — after hydration had
 *    already been skipped, leaving nothing to clear here.
 */
import { toaster } from "evergreen-ui";

if (typeof document !== "undefined") {
  if (!toaster) {
    throw new Error("evergreen-ui toaster singleton failed to initialise");
  }

  for (const key of Object.keys(document)) {
    if (key.startsWith("_reactListening")) {
      delete (document as unknown as Record<string, unknown>)[key];
    }
  }
}

export {};
