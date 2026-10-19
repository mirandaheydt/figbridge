import { cp, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('site/', root), output, { recursive: true });
console.log('Figbridge built in dist/.');
