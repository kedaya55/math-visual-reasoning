// A linear, equally scaled Cartesian frame. Plot content and timing belong to its caller.
export function coordinateMap({origin=[0,0],unit=1}={}) {
  if(origin.length!==2||![...origin,unit].every(Number.isFinite)||unit<=0) throw new RangeError('Finite origin and positive unit required');
  return ([x,y])=>{
    if(![x,y].every(Number.isFinite)) throw new RangeError('Finite coordinates required');
    return [origin[0]+x*unit,origin[1]-y*unit];
  };
}
export function createCoordinatePlane(layer,{id='axes',origin=[110,650],unit=80,xMin=0,xMax=6,yMin=0,yMax=6}={}) {
  let state={origin:[...origin],unit,xMin,xMax,yMin,yMax};
  const validate=next=>{
    if(![next.xMin,next.yMin].every(n=>Number.isInteger(n)&&n<=0&&n>=-20)||
       ![next.xMax,next.yMax].every(n=>Number.isInteger(n)&&n>0&&n<=20)) throw new RangeError('Axis ranges must include zero, with limits from -20 to 20');
    return coordinateMap(next);
  };
  let mapping=validate(state);
  const group=layer.ownerDocument.createElementNS('http://www.w3.org/2000/svg','g');group.id=id;group.setAttribute('class','coordinate-plane');
  const add=(tag,attrs,text)=>{const e=layer.ownerDocument.createElementNS(group.namespaceURI,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;group.append(e);return e;};
  const grid=add('path',{class:'axis-grid'}),ticks=add('path',{class:'axis-line'}),axes=add('path',{class:'axis-line'});
  const zero=add('text',{'text-anchor':'end',class:'axis-number'},'0');
  const xLabel=add('text',{class:'axis-name'},'x'),yLabel=add('text',{'text-anchor':'middle',class:'axis-name'},'y');
  const numbers=new Map();
  function update(next={}) {
    const candidate={...state,...next,origin:[...(next.origin??state.origin)]};
    const nextMapping=validate(candidate);
    state=candidate;mapping=nextMapping;
    const {origin:[ox,oy],unit,xMin,xMax,yMin,yMax}=state;
    const left=ox+xMin*unit,right=ox+xMax*unit,top=oy-yMax*unit,bottom=oy-yMin*unit;
    const gridPaths=[],tickPaths=[],active=new Set();
    const number=(key,value,x,y,anchor)=>{
      active.add(key);
      if(!numbers.has(key))numbers.set(key,add('text',{class:'axis-number'},String(value).replace('-','−')));
      const node=numbers.get(key);node.setAttribute('x',x);node.setAttribute('y',y);node.setAttribute('text-anchor',anchor);
    };
    for(let x=xMin;x<=xMax;x++)if(x!==0){
      const px=ox+x*unit;
      gridPaths.push(`M${px} ${bottom}V${top}`);tickPaths.push(`M${px} ${oy-4}V${oy+4}`);
      number(`x${x}`,x,px,oy+28,'middle');
    }
    for(let y=yMin;y<=yMax;y++)if(y!==0){
      const py=oy-y*unit;
      gridPaths.push(`M${left} ${py}H${right}`);tickPaths.push(`M${ox-4} ${py}H${ox+4}`);
      number(`y${y}`,y,ox-20,py+7,'end');
    }
    for(const [key,node]of numbers)if(!active.has(key)){node.remove();numbers.delete(key)}
    grid.setAttribute('d',gridPaths.join(' '));ticks.setAttribute('d',tickPaths.join(' '));
    axes.setAttribute('d',`M${left-(xMin<0?20:0)} ${oy}H${right+26}M${ox} ${bottom+(yMin<0?20:0)}V${top-26}M${ox-7} ${top-14}L${ox} ${top-26}L${ox+7} ${top-14}M${right+14} ${oy-7}L${right+26} ${oy}L${right+14} ${oy+7}`);
    zero.setAttribute('x',ox-12);zero.setAttribute('y',oy+28);
    xLabel.setAttribute('x',right+45);xLabel.setAttribute('y',oy+9);
    yLabel.setAttribute('x',ox);yLabel.setAttribute('y',top-52);
  }
  update();layer.append(group);
  return {group,toScreen:point=>mapping(point),update};
}
export function riseRun(start,end) {
  if(![start,end].every(p=>p.length===2&&p.every(Number.isFinite))) throw new RangeError('Finite 2D points required');
  const dx=end[0]-start[0],dy=end[1]-start[1];
  return {dx,dy,slope:dx===0?null:dy/dx};
}
