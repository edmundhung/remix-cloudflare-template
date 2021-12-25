import * as esbuild from 'esbuild';

async function build() {
  const mode = process.env.NODE_ENV?.toLowerCase() ?? 'development';
  const version = process.env.VERSION ?? new Date().toISOString();

  console.log(`Building Worker in ${mode} mode for version ${version}`);

  const outfile = './dist/worker.mjs';
  const startTime = Date.now();
  const result = await esbuild.build({
    entryPoints: ['./worker/index.ts'],
    bundle: true,
    minify: mode === 'production',
    sourcemap: mode !== 'production',
    format: 'esm',
    metafile: true,
    external: ['__STATIC_CONTENT_MANIFEST'],
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env.VERSION': `"${version}"`,
    },
    outfile,
  });
  const endTime = Date.now();

  console.log(`Built in ${endTime - startTime}ms`);

  if (mode === 'production') {
    console.log(await esbuild.analyzeMetafile(result.metafile));
  }
}

build().catch((e) => console.error('Unknown error caught during build:', e));
