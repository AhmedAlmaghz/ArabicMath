/* Basic build script for Arabic Math JS */
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function build() {
  console.log('🏗️ Building Arabic Math JS...');

  const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
  ensureDir(path.resolve('dist'));

  const jsFiles = [
    'src/dictionaries/symbols.js',
    'src/core/translator.js',
    'src/core/parser.js',
    'src/core/renderer.js',
    'src/utils/rtl-handler.js',
    'src/utils/string-utils.js',
    'src/utils/math-utils.js',
    'src/utils/font-loader.js',
    'src/ArabicMath.js'
  ];

  let combinedJS = '';
  for (const f of jsFiles) {
    if (!fs.existsSync(f)) { console.warn('⚠️ Missing file:', f); continue; }
    combinedJS += fs.readFileSync(f, 'utf8') + '\n';
  }

  // Write unminified
  fs.writeFileSync('dist/arabic-math.js', combinedJS);

  // Minify JS
  const minified = await minify(combinedJS, {
    compress: { dead_code: true, drop_debugger: true },
    mangle: { toplevel: true },
    output: { comments: false }
  });
  fs.writeFileSync('dist/arabic-math.min.js', minified.code);

  // CSS: combine base + themes
  const cssFiles = [
    'src/styles/arabic-math.css',
    'src/styles/themes.css',
    'src/styles/fonts/font-loader.css'
  ];
  let combinedCSS = '';
  for (const f of cssFiles) {
    if (!fs.existsSync(f)) { console.warn('⚠️ Missing CSS:', f); continue; }
    combinedCSS += fs.readFileSync(f, 'utf8') + '\n';
  }
  fs.writeFileSync('dist/arabic-math.css', combinedCSS);

  const minCSS = new CleanCSS({ level: 2 }).minify(combinedCSS);
  fs.writeFileSync('dist/arabic-math.min.css', minCSS.styles);

  // Sizes
  const jsKB = (fs.statSync('dist/arabic-math.min.js').size / 1024).toFixed(1);
  const cssKB = (fs.statSync('dist/arabic-math.min.css').size / 1024).toFixed(1);
  console.log(`✅ Build complete. JS: ${jsKB} KB, CSS: ${cssKB} KB`);
}

if (require.main === module) {
  build().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = build;
