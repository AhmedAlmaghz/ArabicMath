/* Advanced build with Rollup + sourcemaps */
const path = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const { minify } = require('terser');

async function buildAdvanced() {
  console.log('🏗️ Advanced build (Rollup) ...');
  const input = path.resolve('src/ArabicMath.js');
  const outDir = path.resolve('dist');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const bundle = await rollup({ input });
  const outFile = path.join(outDir, 'arabic-math.rollup.js');
  await bundle.write({
    file: outFile,
    format: 'umd',
    name: 'ArabicMath',
    sourcemap: true,
    exports: 'default',
  });

  const code = fs.readFileSync(outFile, 'utf8');
  const min = await minify(code, { sourceMap: { content: 'inline', url: 'arabic-math.rollup.min.js.map' } });
  fs.writeFileSync(path.join(outDir, 'arabic-math.rollup.min.js'), min.code);
  console.log('✅ Advanced build done');
}

if (require.main === module) {
  buildAdvanced().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = buildAdvanced;
