/* Performance benchmark for Arabic Math JS */
(function () {
  function log(msg) {
    const el = document.getElementById('log');
    if (el) el.textContent += msg + '\n';
    console.log(msg);
  }

  function randomEquation() {
    const vars = ['x', 'y', 'z', 'a', 'b', 'c'];
    const ops = ['+', '-', '*', '/', '^'];
    const funcs = ['sin', 'cos', 'tan', 'log', 'ln', 'exp'];
    const v = () => vars[Math.floor(Math.random() * vars.length)];
    const o = () => ops[Math.floor(Math.random() * ops.length)];
    const f = () => funcs[Math.floor(Math.random() * funcs.length)];
    const n = () => Math.floor(Math.random() * 100);
    return `${f()}(${v()}) ${o()} ${v()}^${n()} ${o()} ${n()}`;
  }

  window.runBenchmark = function ({ iterations = 2000 } = {}) {
    const translator = new ArabicMathTranslator();
    const t0 = performance.now();
    let translated = '';
    for (let i = 0; i < iterations; i++) {
      translated = translator.translate(randomEquation());
    }
    const t1 = performance.now();
    log(`Translate ${iterations} eqs: ${(t1 - t0).toFixed(2)} ms`);

    const parser = new ArabicMathParser();
    const p0 = performance.now();
    for (let i = 0; i < iterations; i++) {
      parser.parse(translated);
    }
    const p1 = performance.now();
    log(`Parse ${iterations} eqs: ${(p1 - p0).toFixed(2)} ms`);

    const container = document.getElementById('perf-out');
    const renderer = new ArabicMathRenderer();
    const r0 = performance.now();
    for (let i = 0; i < Math.min(iterations, 500); i++) {
      const el = document.createElement('div');
      container.appendChild(el);
      renderer.render({ raw: translated }, { targetElement: el, options: { mathRenderer: 'none' } });
    }
    const r1 = performance.now();
    log(`Render ${Math.min(iterations, 500)} eqs: ${(r1 - r0).toFixed(2)} ms`);
  }
})();
