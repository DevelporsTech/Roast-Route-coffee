import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const target = path.join(root, 'app/src/main/assets');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!html.includes('type="module"') || html.includes('/src/main.tsx')) {
  throw new Error('Build the web app before synchronizing Android assets.');
}
await mkdir(target, { recursive: true });
for (const name of await readdir(target)) await rm(path.join(target, name), { recursive: true, force: true });
await cp(dist, target, { recursive: true });
console.log('Android includes the complete current web build, including lazy-loaded screens.');
