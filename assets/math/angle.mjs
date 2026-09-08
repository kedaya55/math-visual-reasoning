import {svgGroup,svgNode,svgText,setAttrs,positive,finite,point,pathPoints,fmt,mathColors as C} from './svg-helpers.mjs';
export function angleModel({vertex=[0,0],start=[100,0],end=[0,-100],radius=50,reflex=false}={}){
 [vertex,start,end].forEach(point);positive([radius]);const a=start.map((v,i)=>v-vertex[i]),b=end.map((v,i)=>v-vertex[i]);positive([Math.hypot(...a),Math.hypot(...b)]);const theta=Math.atan2(a[1],a[0]);let delta=Math.atan2(a[0]*b[1]-a[1]*b[0],a[0]*b[0]+a[1]*b[1]);if(reflex)delta=delta<=0?delta+2*Math.PI:delta-2*Math.PI;
 const at=(t,r=radius)=>[vertex[0]+r*Math.cos(t),vertex[1]+r*Math.sin(t)],p=at(theta,Math.min(radius,24)),q=at(theta+delta,Math.min(radius,24)),points=Array.from({length:Math.max(2,Math.ceil(Math.abs(delta)*16)+1)},(_,i,arr)=>i);
 // A sampled arc also represents a full turn and zero angle without SVG arc ambiguity.
 const count=points.length,arc=points.map((_,i)=>at(theta+delta*i/(count-1)));
 return{vertex,start,end,radius,radians:Math.abs(delta),degrees:Math.abs(delta)*180/Math.PI,arc,path:pathPoints(arc),label:at(theta+delta/2,radius+28),isRight:Math.abs(Math.abs(delta)-Math.PI/2)<1e-8,right:pathPoints([p,[p[0]+q[0]-vertex[0],p[1]+q[1]-vertex[1]],q])};
}
export function createAngle(layer,options={}){let state={...options},model;const group=svgGroup(layer,options.id??'angle'),rays=svgNode(group,'path',{stroke:C.muted}),arc=svgNode(group,'path',{stroke:options.color??C.green,'stroke-width':3}),label=svgText(group,'',options.color??C.green);
 function update(next={}){const candidate={...state,...next},m=angleModel(candidate);state=candidate;model=m;setAttrs(rays,{d:pathPoints([m.start,m.vertex,m.end]),display:state.showRays===false?'none':'inline'});setAttrs(arc,{d:m.isRight&&state.rightSquare!==false?m.right:m.path});setAttrs(label,{x:m.label[0],y:m.label[1]});label.textContent=state.label??`${fmt(m.degrees)}°`;return m;}update();return{group,arc,label,update,get model(){return model}};
}
