import {svgGroup,svgNode,svgText,setAttrs,positive,finite,point,fmt,reconcile,mathColors as C} from './svg-helpers.mjs';
export function numberLineModel({min=-5,max=5,step=1,x=100,y=250,width=800,markers=[],interval=null,jump=null}={}){
 finite([min,max,step,x,y,width]);positive([step,width]);if(max<=min||(max-min)/step>200)throw new RangeError('Ordered range with at most 200 ticks required');
 const map=v=>{finite([v]);return x+(v-min)/(max-min)*width};
 const inside=v=>{finite([v]);if(v<min||v>max)throw new RangeError('Value outside number line')};
 const ticks=Array.from({length:Math.floor((max-min)/step+1e-9)+1},(_,i)=>({value:min+i*step,x:map(min+i*step)}));
 const ids=new Set();for(const m of markers){inside(m.value);if(!m.id||ids.has(m.id))throw new RangeError('Unique marker ids required');ids.add(m.id);}
 if(interval){inside(interval.start);inside(interval.end);if(interval.start>interval.end)throw new RangeError('Ordered interval required');}
 if(jump){inside(jump.from);inside(jump.to);}
 return{min,max,x,y,width,ticks,markers,interval:interval?{...interval,empty:interval.start===interval.end&&!(interval.startClosed&&interval.endClosed)}:null,jump,toScreen:map};
}
export function createNumberLine(layer,options={}){
 let state={...options},model=numberLineModel(state);const group=svgGroup(layer,options.id??'number-line'),axis=svgNode(group,'path'),band=svgNode(group,'path',{stroke:C.purple,'stroke-width':6}),ends=[0,1].map(()=>svgNode(group,'circle',{r:7,stroke:C.purple,'stroke-width':3})),jumpPath=svgNode(group,'path',{stroke:C.red}),jumpLabel=svgText(group,'',C.red),numbers=new Map(),markers=new Map();
 function update(next={}){const candidate={...state,...next},m=numberLineModel(candidate);state=candidate;model=m;
 setAttrs(axis,{d:`M${m.x-15} ${m.y}H${m.x+m.width+20}l-10 -6m10 6l-10 6`});
 reconcile(numbers,m.ticks,t=>fmt(t.value),()=>{const group=svgNode(axis.parentNode,'g');return{group,tick:svgNode(group,'path'),label:svgText(group,'',C.muted)}},(n,t)=>{setAttrs(n.tick,{d:`M${t.x} ${m.y-5}v10`});setAttrs(n.label,{x:t.x,y:m.y+30});n.label.textContent=fmt(t.value)});
 reconcile(markers,m.markers,p=>p.id,()=>{const group=svgNode(axis.parentNode,'g');return{group,dot:svgNode(group,'circle',{r:6}),label:svgText(group,'')}},(n,p)=>{setAttrs(n.dot,{cx:m.toScreen(p.value),cy:m.y,fill:p.color??C.green,stroke:'none'});setAttrs(n.label,{x:m.toScreen(p.value),y:m.y+(p.labelOffset??-36),fill:p.color??C.green});n.label.textContent=p.label??fmt(p.value)});
 setAttrs(band,{display:m.interval&&!m.interval.empty?'inline':'none'});ends.forEach(n=>setAttrs(n,{display:m.interval&&!m.interval.empty?'inline':'none'}));if(m.interval){const q=m.interval;setAttrs(band,{d:`M${m.toScreen(q.start)} ${m.y}H${m.toScreen(q.end)}`});ends.forEach((n,i)=>setAttrs(n,{cx:m.toScreen(i?q.end:q.start),cy:m.y,fill:(i?q.endClosed:q.startClosed)?C.purple:'#0B151C'}));}
 const j=m.jump;setAttrs(jumpPath,{display:j?'inline':'none'});setAttrs(jumpLabel,{display:j?'inline':'none'});if(j){const a=m.toScreen(j.from),b=m.toScreen(j.to),h=65,dir=Math.sign(b-a)||1;setAttrs(jumpPath,{d:a===b?'':`M${a} ${m.y-12}Q${(a+b)/2} ${m.y-h*2} ${b} ${m.y-12}l${-dir*12} -8m${dir*12} 8l0 -14`});setAttrs(jumpLabel,{x:(a+b)/2,y:m.y-h-24});jumpLabel.textContent=j.label??`${j.to-j.from>=0?'+':''}${fmt(j.to-j.from)}`;}
 return m;
 }update();return{group,markers,update,toScreen:v=>model.toScreen(v),get model(){return model}};
}
