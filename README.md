# Arabic Math JS

Translate and render math expressions in Arabic with RTL support.

## Features
- Translation of variables/functions/operators to Arabic.
- RTL-aware rendering with simple renderer (and optional MathJax/KaTeX hooks).
- Utilities for RTL handling and string/math helpers.
- Dev server, basic and advanced build pipelines, examples, tests.

## Project Structure
- `src/ArabicMath.js` — main UMD library entry.
- `src/core/` — `translator.js`, `parser.js` (stub), `renderer.js`.
- `src/utils/` — `rtl-handler.js`, `math-utils.js`, `string-utils.js`.
- `src/dictionaries/symbols.js` — core dictionaries.
- `src/styles/` — `arabic-math.css`, `themes.css`, `fonts/font-loader.js`.
- `examples/interactive-demo.html` — browser demo.
- `tests/test-runner.html`, `tests/performance/benchmark.js` — basic tests/benchmark.
- `tools/serve.js` — local dev server (default http://localhost:3000).
- `tools/build.js`, `tools/build-advanced.js` — build scripts.

## Quick Start
```bash
npm install
npm run build
npm run dev
```
Then open http://localhost:3000 to view the interactive demo.

## Usage (Browser)
```html
<link rel="stylesheet" href="dist/arabic-math.min.css" />
<script src="dist/arabic-math.min.js"></script>
<script>
  const am = new ArabicMath({ rtl: true, autoTranslate: true, mathRenderer: 'none' });
  am.render('#out', 'int_0^1 x^2 dx = 1/3');
</script>
```

## Notes
- `parser.js` and `renderer.js` are minimal stubs intended for extension.
- For MathJax/KaTeX, set `mathRenderer` to `mathjax` or `katex` and include the respective libraries.
- Run security audit: `npm run audit` (custom checks in `security/audit-script.js`).
