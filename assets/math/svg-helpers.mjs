// Small shared SVG operations; mathematical models remain usable without a DOM.
export const mathColors={white:'#F3F5F7',muted:'#AAB6C2',green:'#55DFBC',red:'#F47D7D',purple:'#B19CFF',gold:'#E6BD72'};
export function svgNode(parent,tag,attrs={},text){const n=parent.ownerDocument.createElementNS('http://www.w3.org/2000/svg',tag);setAttrs(n,attrs);if(text!==undefined)n.textContent=text;parent.append(n);return n;}
export function setAttrs(node,attrs){for(const[k,v]of Object.entries(attrs))node.setAttribute(k,String(v));}
export function svgGroup(layer,id){return svgNode(layer,'g',{id,fill:'none',stroke:mathColors.white,'stroke-width':2,'font-family':'Helvetica Neue, PingFang SC, sans-serif','font-size':24});}
export function svgText(parent,text,color=mathColors.white){return svgNode(parent,'text',{fill:color,stroke:'none','text-anchor':'middle','dominant-baseline':'central'},text);}
export function finite(values){if(!values.every(Number.isFinite))throw new RangeError('Finite numbers required');}
export function positive(values){finite(values);if(values.some(v=>v<=0))throw new RangeError('Positive values required');}
export function point(p){if(!Array.isArray(p)||p.length!==2)throw new RangeError('2D point required');finite(p);return p;}
export function fmt(n){return String(Number(n.toFixed(4))).replace('-','−');}
export function pathPoints(points,close=false){return points.map((p,i)=>`${i?'L':'M'}${p.join(' ')}`).join(' ')+(close?' Z':'');}
// Keep DOM identity by semantic key for items that survive a parameter update.
export function reconcile(cache,items,key,create,update){const active=new Set();for(const item of items){const k=key(item);if(active.has(k))throw new RangeError('Duplicate semantic key');active.add(k);if(!cache.has(k))cache.set(k,create(item));update(cache.get(k),item);}for(const[k,n]of cache)if(!active.has(k)){(n.group??n).remove();cache.delete(k);}}
