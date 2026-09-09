// Bundle only this local preview's known module graph. No CDN or runtime dependencies.
import {readFile,writeFile} from 'node:fs/promises';
const base=new URL('./',import.meta.url),seen=new Set(),bundles=[];
async function bundle(name){if(seen.has(name))return;seen.add(name);const source=await readFile(new URL(name+'.mjs',base),'utf8'),imports=[...source.matchAll(/^import\s+\{([^}]+)\}\s+from\s+'\.\/([a-z0-9-]+)\.mjs';/gm)];for(const m of imports)await bundle(m[2]);const exports=[...source.matchAll(/^export\s+(?:function|const|let|class)\s+(\w+)/gm)].map(m=>m[1]);let code=source.replace(/^import\s+\{([^}]+)\}\s+from\s+'\.\/([a-z0-9-]+)\.mjs';/gm,(_,names,dep)=>`const {${names.replace(/\s+as\s+/g,':')}}=modules[${JSON.stringify(dep)}];`).replace(/^export /gm,'');if(/^import |^export /m.test(code))throw new Error('Unsupported syntax in fixed preview graph: '+name);bundles.push(`modules[${JSON.stringify(name)}]=(()=>{\n${code}\nreturn{${exports.join(',')}};\n})();`);}
await bundle('expansion-examples');
const template=await readFile(new URL('expansion-preview.template.html',base),'utf8');
await writeFile(new URL('expansion-preview.html',base),template.replace('/* MODULES */',(()=>`const modules={};\n${bundles.join('\n')}`)).replace(/<\/script(?=[^>]*>)/gi,'</script'));
console.log(`Built offline expansion preview from ${seen.size} modules.`);
