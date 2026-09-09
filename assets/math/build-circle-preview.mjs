// Inline the shared style and circle module for offline file opening.
import { readFile, writeFile } from 'node:fs/promises';
const directory = new URL('./', import.meta.url);
const source = (await readFile(new URL('labeled-circle.mjs', directory), 'utf8')).replace(/^export /gm, '');
const template = await readFile(new URL('circle-preview.template.html', directory), 'utf8');
const styles = await readFile(new URL('math-style.css', directory), 'utf8');
await writeFile(new URL('circle-preview.html', directory), template.replace('/* SHARED_STYLES */', styles).replace('/* COMPONENT_SOURCES */', source));
