// Copy a selected component and its local imports; never overwrite different files.
import {readFile,mkdir,writeFile,access} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
const [destination,...entries]=process.argv.slice(2);
if(!destination||!entries.length)throw new Error('Usage: node copy-math-components.mjs <destination> <module.mjs> ...');
let source=new URL('../assets/math/',import.meta.url);
try{await access(new URL('svg-helpers.mjs',source));}catch{source=new URL('../components/math/',import.meta.url);}
const pending=new Map();
async function collect(name){
  if(!/^[a-z0-9-]+\.mjs$/.test(name)||basename(name)!==name)throw new Error('Expected a component filename: '+name);
  if(pending.has(name))return;
  const bytes=await readFile(new URL(name,source));pending.set(name,bytes);
  const code=bytes.toString('utf8');
  for(const match of code.matchAll(/^import\s+[\s\S]*?\sfrom\s+['"]([^'"]+)['"];?/gm)){
    if(!/^\.\/[a-z0-9-]+\.mjs$/.test(match[1]))throw new Error('Unsupported dependency: '+match[1]);
    await collect(match[1].slice(2));
  }
}
for(const entry of entries)await collect(entry);
pending.set('math-style.css',await readFile(new URL('math-style.css',source)));
const target=resolve(destination),writes=[];
if(target===fileURLToPath(source).replace(/\/$/,''))throw new Error('Destination must differ from the component library');
for(const [name,bytes]of pending){
  try{const existing=await readFile(resolve(target,name));if(!existing.equals(bytes))throw new Error('Destination differs; choose a new folder or review it first: '+name);}
  catch(error){if(error.code==='ENOENT')writes.push([name,bytes]);else throw error;}
}
await mkdir(target,{recursive:true});
for(const [name,bytes]of writes)await writeFile(resolve(target,name),bytes,{flag:'wx'});
console.log(`Ready: ${pending.size} files (${writes.length} copied) in ${target}`);
