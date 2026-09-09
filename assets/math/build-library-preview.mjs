// Fixed local modules only, bundled into a single offline HTML like the existing previews.
import {readFile,writeFile} from 'node:fs/promises';
const dir=new URL('./',import.meta.url);
const modules=['svg-helpers','edge-label','coordinate-plane','number-line','fraction-grid','polygon','angle','sector-partition','function-graph','algebra-tiles','solid','data-chart','probability-tree'];
const sources=await Promise.all(modules.map(async name=>(await readFile(new URL(name+'.mjs',dir),'utf8')).replace(/^import .*?;\n/gm,'').replace(/^export /gm,'')));
const template=await readFile(new URL('library-preview.template.html',dir),'utf8');
await writeFile(new URL('library-preview.html',dir),template.replace('/* SHARED_STYLES */',await readFile(new URL('math-style.css',dir),'utf8')).replace('/* COMPONENT_SOURCES */',sources.join('\n')));
console.log('Offline library preview built');
