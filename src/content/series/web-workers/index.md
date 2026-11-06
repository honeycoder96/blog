---
title: "Web Workers: JavaScript Off the Main Thread"
description: "Start with a frozen UI, finish with a production-grade multi-threaded frontend. One broken demo app, fixed post by post — covering dedicated workers, cross-tab sync, shared memory, and the mental model that makes all of it make sense."
category: JavaScript
order: 4
postOrder:
  - overview
  - main-thread-jank
  - event-loop-internals
  - worker-types-map
  - first-dedicated-worker
  - transferable-objects
  - inline-module-pool-workers
  - shared-workers
  - broadcast-channel
  - shared-array-buffer
  - atomics
  - wasm-workers
  - workers-react-vite
  - node-worker-threads
  - service-workers-vs-web-workers
  - interview-playbook
  - taskflow-final-architecture
blocks:
  - label: "Block 1 — The Why"
    posts: [main-thread-jank, event-loop-internals, worker-types-map]
  - label: "Block 2 — Dedicated Workers"
    posts: [first-dedicated-worker, transferable-objects, inline-module-pool-workers]
  - label: "Block 3 — Cross-Tab Sync"
    posts: [shared-workers, broadcast-channel]
  - label: "Block 4 — Shared Memory"
    posts: [shared-array-buffer, atomics]
  - label: "Block 5 — Power Users"
    posts: [wasm-workers, workers-react-vite, node-worker-threads]
  - label: "Block 6 — Clearing Confusion"
    posts: [service-workers-vs-web-workers]
---
