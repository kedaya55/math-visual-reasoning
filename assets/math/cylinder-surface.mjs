import {createDiagram,diagramDot,diagramText} from './diagram.mjs';
import {spaceSceneModel} from './space-geometry.mjs';
import {positive,finite,mathColors as C} from './svg-helpers.mjs';
export function cylinderSurfaceModel({radius=2,height=4,progress=0,segments=96,showBases=true,camera={},wireframe=false}={}){
 positive([radius,height]);finite([progress]);if(progress<0||progress>1||!Number.isInteger(segments)||segments<16||segments>240)throw new RangeError('Progress in [0,1] and 16–240 strips');const width=2*Math.PI*radius,curvature=(1-progress)/radius,map=(s,y)=>{finite([s,y]);if(s< -1e-8||s>width+1e-8||y<0||y>height)throw new RangeError('Point outside cylinder material');const u=s-width/2;if(curvature<1e-8)return[u,y,0];return[Math.sin(curvature*u)/curvature,y,(1-Math.cos(curvature*u))/curvature]};
 const edge=y=>Array.from({length:segments+1},(_,i)=>map(width*i/segments,y)),faces=Array.from({length:segments},(_,i)=>({id:`strip/${i}`,points:[map(width*i/segments,0),map(width*(i+1)/segments,0),map(width*(i+1)/segments,height),map(width*i/segments,height)],color:i<segments/2?C.green:C.purple})),lines=[{id:'bottom-edge',points:edge(0),color:C.green},{id:'top-edge',points:edge(height),color:C.green},{id:'seam-a',points:[map(0,0),map(0,height)],color:C.gold},{id:'seam-b',points:[map(width,0),map(width,height)],color:C.gold}],markers=[{id:'A',point:map(0,0)},{id:'C',point:map(0,height)}];
 if(progress>1e-5)markers.push({id:'A-copy',label:'A′',point:map(width,0),offset:[18,18]});
 // Bases are attached only while closed; the separate disks at full opening are a net layout.
 if(showBases&&progress===0)for(const [i,y]of [0,height].entries()){const ring=edge(y);faces.push({id:'base/'+i,points:i?ring:[...ring].reverse(),color:C.gold});}
 const scene=spaceSceneModel({faces,lines,markers,wireframe,showHidden:false,camera:{yaw:-20*(1-progress),pitch:22*(1-progress),unit:Math.min(48,650/width),target:[0,height/2,radius*(1-progress)],...camera}});
 if(showBases&&progress===1){const unit=scene.camera.unit,left=scene.project(map(width*.25,0)),right=scene.project(map(width*.75,height));scene.items.push(diagramDot('net-base-bottom',left[0],left[1]+radius*unit,C.gold,radius*unit,{fill:C.gold,'fill-opacity':.1,stroke:C.gold,'stroke-width':2}),diagramDot('net-base-top',right[0],right[1]-radius*unit,C.gold,radius*unit,{fill:C.gold,'fill-opacity':.1,stroke:C.gold,'stroke-width':2}));}
 return{...scene,width,height,radius,progress,map,lateralArea:width*height,surfaceArea:width*height+2*Math.PI*radius**2,volume:Math.PI*radius**2*height,materialFaces:faces,basesMode:progress===0?'attached':progress===1?'separate-net':'omitted'};
}
export function createCylinderSurface(layer,options={}){return createDiagram(layer,options,cylinderSurfaceModel,'cylinder-surface');}
