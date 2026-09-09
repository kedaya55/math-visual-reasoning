// Inline the shared style and coordinate module for offline file opening.
import { readFile, writeFile } from 'node:fs/promises';
const directory = new URL('./', import.meta.url);
const source = (await readFile(new URL('coordinate-plane.mjs', directory), 'utf8')).replace(/^export /gm, '');
const template = await readFile(new URL('axes-preview.template.html', directory), 'utf8');
const styles = await readFile(new URL('math-style.css', directory), 'utf8');
await writeFile(new URL('axes-preview.html', directory), template.replace('/* SHARED_STYLES */', styles).replace('/* COMPONENT_SOURCES */', source));
