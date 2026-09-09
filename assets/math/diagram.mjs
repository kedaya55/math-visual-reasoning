import {svgGroup,svgNode,setAttrs,reconcile,mathColors as C,pathPoints} from './svg-helpers.mjs';
// A small renderer shared by the new models. IDs survive updates; ordering follows the model.
export function diagramLine(id,points,color=C.white,extra={}){return{id,tag:'path',attrs:{d:pathPoints(points),fill:'none',stroke:color,'stroke-width':2.5,...extra}};}
export function diagramPolygon(id,points,color=C.green,extra={}){return{id,tag:'path',attrs:{d:pathPoints(points,true),fill:color,'fill-opacity':.16,stroke:color,'stroke-width':2,...extra}};}
export function diagramText(id,text,x,y,color=C.white,size=24,extra={}){return{id,tag:'text',text:String(text),attrs:{x,y,fill:color,stroke:'none','font-size':size,'text-anchor':'middle','dominant-baseline':'central',...extra}};}
export function diagramDot(id,x,y,color=C.white,r=4,extra={}){return{id,tag:'circle',attrs:{cx:x,cy:y,r,fill:color,stroke:'none',...extra}};}
export function diagramRect(id,x,y,width,height,color=C.green,extra={}){return{id,tag:'rect',attrs:{x,y,width,height,fill:color,'fill-opacity':.2,stroke:color,'stroke-width':2,...extra}};}
export function createDiagram(layer,options,makeModel,defaultId){
 let state={...options},model;const group=svgGroup(layer,options.id??defaultId),items=new Map();
 function update(next={}){const candidate={...state,...next},m=makeModel(candidate),ids=new Set();for(const item of m.items){if(ids.has(item.id))throw new RangeError('Duplicate drawing ID');ids.add(item.id);if(items.has(item.id)&&items.get(item.id).tagName!==item.tag)throw new RangeError('A drawing ID must keep its element type');for(const value of Object.values(item.attrs))if((typeof value==='number'&&!Number.isFinite(value))||(typeof value==='string'&&/NaN|Infinity|undefined/.test(value)))throw new RangeError('Nonfinite drawing attribute');}
  reconcile(items,m.items,i=>i.id,i=>svgNode(group,i.tag,{'data-part-id':i.id}),(node,item)=>{if(node.tagName!==item.tag)throw new RangeError('A drawing ID must keep its element type');for(const a of [...node.attributes])if(a.name!=='data-part-id'&&!(a.name in item.attrs))node.removeAttribute(a.name);setAttrs(node,item.attrs);if(item.text!==undefined)node.textContent=item.text;group.append(node)});state=candidate;model=m;return m;
 }update();return{group,items,update,get model(){return model}};
}
