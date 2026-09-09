import {createDiagram,diagramText,diagramLine} from './diagram.mjs';
import {finite,positive,mathColors as C} from './svg-helpers.mjs';
// Structured expressions, not a TeX parser or symbolic algebra engine.
export function expressionLayoutModel({expression={type:'frac',numerator:'a+b',denominator:'2'},x=100,y=160,size=40,gap=10}={}){
 finite([x,y,gap]);positive([size]);if(size>200||gap<0)throw new RangeError('Unsupported formula scale');let count=0;
 function layout(e,s,id,depth){if(++count>300||depth>12)throw new RangeError('Formula too large');if(typeof e==='string'||typeof e==='number')e={type:'text',text:String(e)};if(!e||typeof e!=='object')throw new RangeError('Expression required');const color=e.color??C.white;
  if(e.type==='text'){const text=String(e.text??''),width=[...text].reduce((n,c)=>n+(/[\u2E80-\uFFFF]/.test(c)?1.04:.68)*s,0);return{width:Math.max(width,.3*s),ascent:.85*s,descent:.3*s,items:[diagramText(id,text,0,0,color,s,{'text-anchor':'start','dominant-baseline':'alphabetic'})]};}
  const shift=(m,dx,dy)=>m.items.map(i=>({...i,attrs:{...i.attrs,transform:`translate(${dx} ${dy})${i.attrs.transform?' '+i.attrs.transform:''}`}}));
  if(e.type==='row'){if(!Array.isArray(e.children)||!e.children.length)throw new RangeError('Nonempty expression row required');const parts=e.children.map((v,i)=>layout(v,s,`${id}/${i}`,depth+1));let w=0,items=[];for(const p of parts){items.push(...shift(p,w,0));w+=p.width+gap*s/size}return{width:w-gap*s/size,ascent:Math.max(...parts.map(p=>p.ascent)),descent:Math.max(...parts.map(p=>p.descent)),items};}
  if(e.type==='frac'){const a=layout(e.numerator,s*.82,id+'/n',depth+1),b=layout(e.denominator,s*.82,id+'/d',depth+1),w=Math.max(a.width,b.width)+s*.4,axis=-s*.28,ay=axis-s*.17-a.descent,by=axis+s*.17+b.ascent;return{width:w,ascent:-ay+a.ascent,descent:by+b.descent,items:[...shift(a,(w-a.width)/2,ay),...shift(b,(w-b.width)/2,by),diagramLine(id+'/bar',[[0,axis],[w,axis]],color,{'stroke-width':Math.max(1.5,s*.035)})]};}
  if(e.type==='pow'){const a=layout(e.base,s,id+'/base',depth+1),b=layout(e.exponent,s*.6,id+'/exp',depth+1),dy=-a.ascent*.8-b.descent;return{width:a.width+b.width+s*.08,ascent:Math.max(a.ascent,b.ascent-dy),descent:a.descent,items:[...a.items,...shift(b,a.width+s*.08,dy)]};}
  if(e.type==='sqrt'){const a=layout(e.value,s,id+'/value',depth+1),w=a.width+s*.62,top=-a.ascent-s*.12;return{width:w,ascent:-top,descent:a.descent,items:[...shift(a,s*.58,0),diagramLine(id+'/root',[[0,-s*.22],[s*.12,-s*.3],[s*.25,s*.1],[s*.46,top],[w,top]],color)]};}
  throw new RangeError('Supported expression types: text, row, frac, pow, sqrt');
 }
 const m=layout(expression,size,'expr',0);return{...m,x,y,items:m.items.map(i=>({...i,attrs:{...i.attrs,transform:`translate(${x} ${y})${i.attrs.transform?' '+i.attrs.transform:''}`}})),bounds:{x,y:y-m.ascent,width:m.width,height:m.ascent+m.descent}};
}
export function createExpression(layer,options={}){return createDiagram(layer,options,expressionLayoutModel,'expression');}
