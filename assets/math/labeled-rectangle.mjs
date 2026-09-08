import { rigidMatrix, createEdgeLabel } from './edge-label.mjs';

// Geometry and edge labels share local coordinates and one pose; layout/timing stay with the scene.
export function createLabeledRectangle(shapeLayer, labelLayer, {
  id, width, height, color = '#B19CFF', edges = [], pose = {},
}) {
  if (![width,height].every(v => Number.isFinite(v) && v > 0)) throw new RangeError('Positive rectangle dimensions required');
  const doc = shapeLayer.ownerDocument;
  const element = tag => doc.createElementNS('http://www.w3.org/2000/svg',tag);
  const group=element('g'), shape=element('g'), rect=element('rect');
  group.id='area-'+id;shape.id='shape-'+id;rect.id='fill-'+id;
  for (const [key,value] of Object.entries({width,height,fill:color,'fill-opacity':.18,stroke:color,'stroke-width':3})) rect.setAttribute(key,value);
  shape.append(rect);group.append(shape);shapeLayer.append(group);
  const sides={
    top:{start:[0,0],end:[width,0],outward:[0,-1]},
    right:{start:[width,0],end:[width,height],outward:[1,0]},
    bottom:{start:[0,height],end:[width,height],outward:[0,1]},
    left:{start:[0,0],end:[0,height],outward:[-1,0]},
  };
  const labels=edges.map(({side,text,...spacing})=>{
    if(!sides[side]) throw new RangeError('Unknown rectangle side');
    const label=createEdgeLabel(labelLayer,{id:`edge-${id}-${text}`,text,edge:sides[side],...spacing});
    label.group.classList.add('edge-label-'+text);
    return label;
  });
  const state={x:0,y:0,cx:width/2,cy:height/2,rotation:0,scale:1,...pose};
  function update(next=state) {
    Object.assign(state,next);
    const m=rigidMatrix(state);
    shape.setAttribute('transform',`matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`);
    return labels.map(label=>label.update(state));
  }
  // Resize in local coordinates; preserve the current pose, including its pivot.
  function setSize({width: nextWidth = width, height: nextHeight = height} = {}) {
    if (![nextWidth,nextHeight].every(v => Number.isFinite(v) && v > 0)) throw new RangeError('Positive rectangle dimensions required');
    width=nextWidth;height=nextHeight;
    rect.setAttribute('width',width);rect.setAttribute('height',height);
    sides.top.end=[width,0];
    sides.right.start=[width,0];sides.right.end=[width,height];
    sides.bottom.start=[0,height];sides.bottom.end=[width,height];
    sides.left.end=[0,height];
    return update();
  }
  update();
  return {group,shape,rect,labels,pose:state,get width(){return width},get height(){return height},update,setSize};
}
