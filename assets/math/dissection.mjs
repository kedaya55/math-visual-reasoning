import {createDiagram,diagramPolygon,diagramLine,diagramText} from './diagram.mjs';
import {clipConvexPolygon,convexPolygon,signedPolygonArea,rotatePoint,v2add} from './geometry-utils.mjs';
import {finite,point,mathColors as C,fmt} from './svg-helpers.mjs';
export function dissectionModel({points=[[180,180],[580,180],[680,380],[280,380]],cut=[[330,80],[330,460]],poses={},showAreas=true}={}){
 convexPolygon(points);if(!Array.isArray(cut)||cut.length!==2)throw new RangeError('Two cut points required');cut.forEach(point);const area=Math.abs(signedPolygonArea(points)),items=[diagramPolygon('source',points,C.muted,{'fill-opacity':.025,'stroke-dasharray':'6 5'}),diagramLine('cut',cut,C.gold,{'stroke-dasharray':'7 5'})],pieces=[];
 for(const [i,side]of [1,-1].entries()){const original=clipConvexPolygon(points,cut[0],cut[1],side);if(!original.length)continue;const id=`piece-${i}`,pose=poses[id]??{},center=original.reduce((a,p)=>a.map((v,j)=>v+p[j]/original.length),[0,0]),offset=[pose.x??0,pose.y??0],rotation=pose.rotation??0;finite([...offset,rotation]);const transformed=original.map(p=>v2add(rotatePoint(p,center,rotation),offset)),a=Math.abs(signedPolygonArea(original)),color=[C.green,C.purple][i];pieces.push({id,parentId:'source',points:transformed,original,area:a,center:v2add(center,offset)});items.push(diagramPolygon(id,transformed,color));if(showAreas)items.push(diagramText(id+'/area',fmt(a),...v2add(center,offset),color,22));}
 return{items,area,pieces};
}
export function createDissection(layer,options={}){return createDiagram(layer,options,dissectionModel,'dissection');}
