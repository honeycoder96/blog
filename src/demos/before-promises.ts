import type { DemoConfig } from './types';

const demos: Record<string, DemoConfig> = {
  'call-stack': {
    title: 'Call Stack Trace',
    template: 'vanilla',
    showPreview: false,
    files: {
      '/index.js': { code: '', hidden: true },
      '/src/index.js': {
        code: `// Tip: open DevTools and add a breakpoint inside multiply()
// to see the call stack grow and shrink

function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  const result = square(n);
  console.log(result);
}

printSquare(4);
printSquare(5);
printSquare(6);`,
        active: true,
      },
    },
  },

  'blocking-thread': {
    title: 'Blocking the Thread',
    template: 'vanilla',
    showPreview: true,
    infiniteLoopProtection: false,
    files: {
      '/index.js': { code: '', hidden: true },
      '/index.html': {
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; background: #0a0a0a; color: #fafafa; }
    button { padding: 10px 20px; font-size: 14px; cursor: pointer; background: #262626; color: #fafafa; border: 1px solid #404040; border-radius: 8px; }
    button:hover { background: #404040; }
    #counter { font-variant-numeric: tabular-nums; color: #86efac; font-size: 1.5rem; font-weight: 600; }
    .label { color: #a3a3a3; font-size: 0.875rem; margin-bottom: 12px; }
    #status { color: #eab308; font-size: 0.875rem; margin-top: 12px; min-height: 1.25rem; }
  </style>
</head>
<body>
  <p class="label">Counter: <span id="counter">0</span></p>
  <button id="btn">Start Heavy Work (blocks ~3s)</button>
  <p id="status"></p>
  <script src="src/index.js"></script>
</body>
</html>`,
        hidden: true,
      },
      '/src/index.js': {
        code: `// Click "Start Heavy Work" and notice the UI freezes completely
// The button becomes unresponsive, the counter stops updating

let count = 0;

// Update the counter display every 100ms
setInterval(() => {
  count++;
  document.getElementById('counter').textContent = count;
}, 100);

function doHeavyWork() {
  document.getElementById('status').textContent = 'Working...';
  const start = Date.now();
  // Synchronously block for ~3 seconds
  while (Date.now() - start < 3000) {
    // Just spinning. Doing nothing useful.
    // But JS is completely occupied.
  }
  document.getElementById('status').textContent = 'Done! Notice the counter jumped.';
  console.log('Heavy work done');
}

document.getElementById('btn').addEventListener('click', doHeavyWork);`,
        active: true,
      },
    },
  },

  'event-loop-trace': {
    title: 'Full Event Loop Trace',
    template: 'vanilla',
    showPreview: false,
    files: {
      '/index.js': { code: '', hidden: true },
      '/src/index.js': {
        code: `// Run this and predict the output before looking at the console

console.log('script start');       // (1)

setTimeout(function macroTask() {
  console.log('setTimeout');       // (5)
}, 0);

Promise.resolve()
  .then(function microTask1() {
    console.log('promise 1');      // (3)
  })
  .then(function microTask2() {
    console.log('promise 2');      // (4)
  });

console.log('script end');         // (2)

// Expected output:
// script start
// script end
// promise 1
// promise 2
// setTimeout`,
        active: true,
      },
    },
  },
};

export default demos;
