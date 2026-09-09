// Inline the existing shared style and modules for offline file opening.
import { readFile, writeFile } from 'node:fs/promises';
const directory = new URL('./', import.meta.url);
const files = ['edge-label.mjs', 'labeled-rectangle.mjs'];
const sources = (await Promise.all(files.map(name => readFile(new URL(name, directory), 'utf8'))))
  .map(source => source.replace(/^import .*;\s*$/gm, '').replace(/^export /gm, '')).join('\n');
const template = await readFile(new URL('rectangle-preview.template.html', directory), 'utf8');
const styles = await readFile(new URL('math-style.css', directory), 'utf8');
await writeFile(new URL('rectangle-preview.html', directory), template.replace('/* SHARED_STYLES */', styles).replace('/* COMPONENT_SOURCES */', sources));
