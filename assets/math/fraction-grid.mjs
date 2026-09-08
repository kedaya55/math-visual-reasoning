import {svgGroup,svgNode,svgText,setAttrs,positive,finite,reconcile,mathColors as C} from './svg-helpers.mjs';
export function fractionGridModel({x=100,y=120,width=600,height=180,rows=1,columns=6,selected=3,sourceRows=1,sourceColumns=1,sourceId='whole',poses={}}={}){
 positive([width,height]);finite([x,y]);if(![rows,columns,sourceRows,sourceColumns].every(v=>Number.isInteger(v)&&v>0)||rows*columns>400||rows%sourceRows||columns%sourceColumns||!Number.isInteger(selected)||selected<0||selected>rows*columns)throw new RangeError('Integer subdivision of source grid and valid selected count required');
 const w=width/columns,h=height/rows,cells=[];
 for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){const parentId=`${sourceId}/${Math.floor(r/(rows/sourceRows))}:${Math.floor(c/(columns/sourceColumns))}`,id=rows===sourceRows&&columns===sourceColumns?parentId:`${parentId}/grid-${rows/sourceRows}x${columns/sourceColumns}/${r%(rows/sourceRows)}:${c%(columns/sourceColumns)}`,pose={x:0,y:0,rotation:0,...poses[id]};finite([pose.x,pose.y,pose.rotation]);cells.push({id,parentId,row:r,column:c,x:x+c*w,y:y+r*h,width:w,height:h,selected:r*columns+c<selected,pose,unit:1/(rows*columns)});}
 return{x,y,width,height,rows,columns,selected,denominator:rows*columns,value:selected/(rows*columns),cells};
}
export function createFractionGrid(layer,options={}){
 let state={...options};const group=svgGroup(layer,options.id??'fractions'),outline=svgNode(group,'rect',{stroke:C.muted}),label=svgText(group,''),cells=new Map();let model;
 function update(next={}){const candidate={...state,...next},m=fractionGridModel(candidate);state=candidate;model=m;setAttrs(outline,{x:m.x,y:m.y,width:m.width,height:m.height});
 reconcile(cells,m.cells,c=>c.id,c=>{const group=svgNode(outline.parentNode,'g',{'data-piece-id':c.id});return{group,rect:svgNode(group,'rect'),label:svgText(group,'')}},(n,c)=>{const color=state.sourceColors?.[c.parentId]??state.color??C.green;setAttrs(n.group,{'data-parent-id':c.parentId,transform:`translate(${c.pose.x} ${c.pose.y}) rotate(${c.pose.rotation} ${c.x+c.width/2} ${c.y+c.height/2})`});setAttrs(n.rect,{x:c.x,y:c.y,width:c.width,height:c.height,stroke:c.selected?color:C.muted,fill:c.selected?color:'none','fill-opacity':.24});setAttrs(n.label,{x:c.x+c.width/2,y:c.y+c.height/2,fill:color,display:state.showUnits?'inline':'none',transform:`rotate(${-c.pose.rotation} ${c.x+c.width/2} ${c.y+c.height/2})`});n.label.textContent=`1/${m.denominator}`});
 setAttrs(label,{x:m.x+m.width/2,y:m.y+m.height+42});label.textContent=state.label??`${m.selected}/${m.denominator}`;group.append(label);return m;
 }update();return{group,cells,update,get model(){return model}};
}
