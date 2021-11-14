import * as esbuild from 'esbuild';

const mode = process.env.NODE_ENV?.toLowerCase() ?? 'development';

console.log(`[Worker] Running esbuild in ${mode} mode`);

esbuild.build({
  entryPoints: ['./worker/index.ts'],
  bundle: true,
  minify: mode === 'production',
  format: 'esm',
  define: {
    "process.env.NODE_ENV": `"${mode}"`,
  },
  outfile: 'worker.js',
});
