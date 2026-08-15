import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { readFileSync } from 'node:fs';

const files = ['dist/minium.css', 'dist/minium.min.css'];

const budgetKb = Number(process.env.CSS_GZIP_BUDGET_KB ?? 20);
const budgetBytes = Math.floor(budgetKb * 1024);

// Match what a well-configured CDN actually serves: max-level gzip as the
// universal fallback, and Brotli (quality 11) for modern browsers.
const maxGzip = (buf) => gzipSync(buf, { level: 9 }).byteLength;
const maxBrotli = (buf) =>
  brotliCompressSync(buf, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: buf.byteLength,
    },
  }).byteLength;

for (const file of files) {
  const content = readFileSync(file);
  console.log(
    `${file}: raw=${content.byteLength} bytes, ` +
      `gzip=${maxGzip(content)} bytes, brotli=${maxBrotli(content)} bytes`,
  );
}

// Budget is gated on gzip: it is the conservative ceiling, since any client
// without Brotli support still receives at least max-level gzip.
const minifiedCss = readFileSync('dist/minium.min.css');
const minifiedGzipBytes = maxGzip(minifiedCss);
const minifiedBrotliBytes = maxBrotli(minifiedCss);

console.log(`CSS files checked: ${files.length}`);
console.log(`Budget: ${budgetBytes} bytes (${budgetKb} KiB)`);
console.log(`Budget target (dist/minium.min.css gzip): ${minifiedGzipBytes} bytes`);
console.log(`For reference (dist/minium.min.css brotli): ${minifiedBrotliBytes} bytes`);

if (minifiedGzipBytes > budgetBytes) {
  console.error('CSS gzip budget exceeded for dist/minium.min.css.');
  process.exit(1);
}
