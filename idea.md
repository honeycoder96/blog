Here's a comprehensive table of contents for your Promises book — structured to take a reader from zero to polyfill author:


## Part I - The Problem Space

### 01 - The World Before Promises

```
How JavaScript is single-threaded and what that really means
Synchronous vs asynchronous execution
The call stack, the event loop, and the callback queue
Why blocking the thread is so dangerous
```

### 02 - Callbacks — The Original Async Pattern

```
How callbacks work and why they were the standard
Callback hell — the pyramid of doom in depth
Inversion of control — trusting a third party with your continuation
The problems callbacks leave unsolved: error handling, timing, trust
```

### 03 - What Promises Set Out to Solve

```
Restoring inversion of control back to the caller
Representing a future value — the core mental model
Separating the concern of producing a value from consuming it
A brief history: jQuery Deferreds, Q, Bluebird, and the road to the spec
```

## Part II - Core Mechanics

### 04 - Anatomy of a Promise
The three states: pending, fulfilled, and rejected
State transitions — why they are one-way and immutable
The executor function — what it is and when it runs
Resolve vs reject — what each one actually does internally

### 05 - Consuming Promises with .then()
Signature of .then(onFulfilled, onRejected)
Return values from .then() handlers and what they produce
Why .then() always returns a new promise
Synchronous vs microtask-queued handler execution

### 06 - Error Handling with .catch()

.catch(fn) as syntactic sugar for .then(null, fn)
How rejections propagate down a chain
Catching errors thrown synchronously inside an executor
Recovering from errors and resuming a fulfilled chain
Unhandled promise rejections — how and why they surface

### 07 - Cleanup with .finally()
When .finally() runs — fulfilled and rejected
Why .finally() is transparent to the value
Real-world use cases: loaders, resource cleanup, analytics
Subtle gotchas with returning values or throwing inside .finally()

### 08 - Promise Chaining In Depth

Building sequential async pipelines
Returning a promise from .then() — flattening and adoption
The promise resolution procedure — what "resolving with a thenable" means
Common chaining mistakes: branching, breaking the chain, silent swallows
Chaining vs nesting — why flat is better

## Part III - The Promise API

09 - Promise.resolve() and Promise.reject()
Creating pre-settled promises — when and why
Wrapping non-promise values and thenables
The identity shortcut: when Promise.resolve(p) === p
10
Promise.all()
Parallelising independent async operations
Fail-fast behaviour — one rejection cancels all
Ordering guarantees on the result array
When not to use it: dependent tasks, large batches
11
Promise.allSettled()
Running promises regardless of individual failures
The { status, value/reason } result shape
When to prefer allSettled over all
Building resilient multi-fetch patterns
12
Promise.race()
The first-settled-wins semantic
Building timeout wrappers with race
Why losing promises are not cancelled — and what that means
Request de-duplication and fastest-response patterns
13
Promise.any()
First-fulfilled-wins — ignoring individual rejections
AggregateError — when every promise rejects
Comparing any vs race vs all — choosing the right combinator
Fallback-chain patterns and redundant source queries

## Part IV - Promises and async/await

14
async/await — Syntactic Sugar Over Promises
What async functions always return
How await suspends and resumes execution
Translating .then() chains to await and back
Error handling with try/catch vs .catch()
15
Common async/await Pitfalls
Accidentally serialising parallel work with await in loops
The await in forEach trap
Forgetting to await — floating promises
Top-level await and module implications

## Part V - Patterns and Recipes

16
Sequential vs Parallel Execution Patterns
Running tasks in order with reduce + promises
Parallelising with Promise.all and collecting results
Mixed patterns — parallel groups with sequential dependencies
17
Concurrency Control and Rate Limiting
The problem with unbounded parallelism
Building a promise pool / concurrency limiter from scratch
Throttled promise queues for API rate limits
18
Retry, Timeout, and Fallback Patterns
Automatic retry with exponential backoff
Timeout wrappers using Promise.race
Circuit breaker pattern in async code
Waterfall fallbacks — trying sources in priority order
19
Deferred Pattern and Promise Factories
Separating resolve/reject from the executor — the deferred object
When the deferred pattern is the right tool
Lazy promises — deferring execution until consumed
Memoising async calls: caching promise instances
20
Cancellation — The Gap Promises Leave
Why the spec has no cancellation
AbortController and AbortSignal as the practical solution
Wrapping fetch and other APIs with cancellation support
Cooperative cancellation in promise chains
21
Promisifying Callback-based APIs
Writing a promisify utility by hand
util.promisify in Node.js and its custom symbol
Handling multi-value callbacks and edge cases
Promisifying event emitters

## Part VI - Limitations and Gotchas

22
What Promises Cannot Do
No built-in cancellation or abort
No progress or intermediate values — that's what observables are for
Single-value only — you can't emit multiple results over time
Promises are eager — they start on construction, not on subscription
23
Error Handling Pitfalls
Silently swallowed rejections
Mixing .then(null, fn) and .catch(fn) incorrectly
unhandledRejection events in Node.js
Re-throwing vs recovering inside a .catch()
Errors in .then() fulfilled handlers
24
Memory and Performance Considerations
Promise chains and microtask queue pressure
Long chains vs flat await — which is cheaper?
Retaining references to settled promises — memory leaks
Benchmarking promise-heavy code


## Part VII - Building the Polyfill

25
The Promises/A+ Specification — A Deep Read
What Promises/A+ specifies and what it deliberately leaves out
Terminology: promise, thenable, value, reason, resolve
The promise resolution procedure [[Resolve]](promise, x) line by line
The microtask requirement — why handlers must be async
26
Scaffolding the Polyfill — State and Executor
Representing internal state with closures
Running the executor and catching synchronous throws
Implementing resolve and reject as single-fire functions
Guarding against multiple resolutions

### 27. Implementing .then()

```
Creating and returning the next promise in the chain
Queueing handlers when the promise is still pending
Executing handlers when the promise is already settled
Scheduling handlers as microtasks with queueMicrotask
```

### 28 Implementing the Resolution Procedure

```
Detecting thenables — the duck-typing check
Adopting the state of a returned promise
Guarding against circular resolution (x === promise)
Handling non-function handlers — identity and thrower defaults
```

### 29 Adding .catch(), .finally(), and Static Methods

```
Deriving .catch() and .finally() from .then()
Implementing Promise.resolve() and Promise.reject()
Implementing Promise.all(), Promise.allSettled(), Promise.race(), Promise.any()
```

### 30 Testing and Validating the Polyfill

```
Running the official Promises/A+ compliance test suite
Fixing edge cases uncovered by the suite
Comparing behaviour against native Promise
Where to go next: observables, async generators, and structured concurrency
```

**30 chapters across 7 parts.** Here's the structural logic behind it:

Parts I–II build the *why* before touching any API — readers who skip straight to `.then()` without understanding inversion of control always get confused later, so those chapters earn their place.

Part III covers every static method as its own dedicated chapter rather than lumping them together — each combinator has distinct failure semantics worth a focused treatment.

Part IV keeps `async/await` deliberately separate. It's important to cement that it's desugared promises, not a replacement model — placing it after the core mechanics makes that obvious.

Part V is the practical heart — patterns like concurrency limiting, retry/backoff, and deferred are what developers actually reach for in production code, and they all become approachable once the mechanics from Part II are solid.

Part VI on limitations is often skipped in tutorials but critical for a book claiming A-to-Z coverage — especially the cancellation chapter, since that's a genuine spec gap that trips up almost everyone.

Part VII (the polyfill) is the payoff — by the time a reader reaches chapter 25, they'll have enough context to read the Promises/A+ spec and actually understand it, making the implementation feel inevitable rather than magical.

Want me to start writing any of these chapters, or adjust the structure first?


1. Module federation deep dive: sharing code without sharing pain
2. Islands architecture: the why behind Astro, Fresh, and partial hydration
3. Bundle splitting strategies that actually move the needle on Core Web Vitals
4. Building offline-first apps with service workers and sync strategies
5. On-device AI in the browser: architecture patterns for WebLLM / Transformers.js apps
6. Optimistic UI patterns — consistency models for instant-feeling apps
7. Structuring a monorepo for frontend: Turborepo lessons learned
8. Observability for the frontend: tracing user journeys end-to-end
9. Hybrid rendering strategies: mixing SSG, SSR, and CSR in a single app without chaos
10. Security Architecture

    a. Frontend security architecture: CSP, CORS, and the trust boundary you're ignoring
    b. OAuth and token management in SPAs — why the "right" way keeps changing
    c. Supply chain attacks on the frontend: securing your dependency graph

11. CRDTs in the browser: building conflict-free collaborative features
12. Chrome extension architecture patterns — background workers, content scripts, and messaging done right ← directly relevant to VoiceFill
