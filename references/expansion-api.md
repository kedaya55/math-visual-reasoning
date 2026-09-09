# 课程补充组件接口

[知识点索引](../assets/math/CURRICULUM-COVERAGE.md) · [离线预览](../assets/math/expansion-preview.html) · [检查记录](../assets/math/EXPANSION-QA.md)

## 共同约定

每个图形模块提供纯模型函数 `…Model(options)` 和 `create…(svgLayer, options)`。纯模型不需要浏览器；创建结果含 `group`、`items: Map`、`update(next)`、只读 `model`。`items` 的键是模型中的语义 ID，存续对象保留 SVG 节点。模型返回的 `items` 是图元描述，另外提供本模块的数学量；不要把两者混淆。

`update` **浅合并**参数并从完整状态重算；嵌套对象如 `camera`、`poses`、数组应传本次完整值。切换题型时明确重置不再适用的参数。`id` 在创建时确定，同一 SVG 内必须唯一。移除用 `group.remove()`。调用方不可修改模型或 Map 后期待系统维护数学一致性。

二维绘图默认 x 向右、y 向下；坐标网格变换按数学坐标 x 向右、y 向上。角度一般为度；底层三维 `rotateAroundAxis` 和材料坐标 `phi` 为弧度。尺寸必须为正，输入必须有限；有数量上限的图形是教学展示组件，不能作为无限规模计算器。

模块无第三方运行时依赖。复制时递归带上相对 `import` 引用及 `math-style.css`，不要只复制入口。可用随包 `scripts/copy-math-components.mjs` 自动收集依赖。原有 10 类组件接口见 `LIBRARY-API.md`（skill 中为 `references/component-api.md`）。

```js
import { createConeSurface } from './assets/cone-surface.mjs';
const cone = createConeSurface(svgLayer, {
  id: 'problem-cone', radius: 5, height: 5 * Math.sqrt(3), progress: 0,
});
// 由工程的同一个绝对时间状态给进度，不逐帧累加。
cone.update({ progress: 0.5 });
const { slant, sectorDegrees, chord } = cone.model;
```

SVG 图层和字号由工程布置；组件不会自动把画面缩放到视频右侧。预览的自动取景属于预览页，不能依赖它掩盖视频中的裁切。文字、细分格、三维遮挡都需在目标视频分辨率验收。

## 数、代数、度量

| 模块 / 创建入口 | 主要参数 | 数学返回与边界 |
| --- | --- | --- |
| `counting-array` / `createCountingArray` | `count,groupSize,selected,pattern`，`x,y,unit` | `quotient,remainder` 与单位对象；零显示 0；分组、方阵、三角排列 |
| `place-value` / `createPlaceValue` | `value` 十进制字符串，`exchangePower` 为数位幂或 null | `columns,transfers,value`；最多 6 位整数、4 位小数；一次换出一个单位，保留父子身份 |
| `arithmetic-board` / `createArithmeticBoard` | `a,b,operation,step`；`cell` 20–100 | `result,remainder,steps,current,partials`；非负整数 ≤999999，减法结果非负，除数非零；结果揭示由工程控制 |
| `arithmetic-board` / `createFactors` | `a,b` 正整数 | 质因数配对、`gcd,lcm`；1 无质因数 |
| `fraction-operation` / `createFractionOperation` | `a,b` 为 `{n,d}`、整数或十进制字符串，`operation` | `result,cells,groups`；非负数 ≤4，分母 ≤60，公分母 ≤120、结果 ≤8；乘法限 [0,1] 且网格 ≤400；不支持负面积 |
| `bar-model` / `createBarModel` | `rows:[{id,label,parts:[{id,value,label,color}]}]`，`max,width` | `totals`、按同一比例的各段；固定 max 可跨帧比较 |
| `bar-model` / `createMotionTracks` | `tracks:[{id,start,speed}]`，`time,min,max` | 位置、`relative.distance,meetingTime`；有符号匀速，距离非负 |
| `equation-model` / `createEquation` | `left,right:{x,constant}`，`relation`，`operations,stage` | 精确线性解/解集；操作为 `{kind:'add',value:{x,constant}}` 或 `{kind:'multiply',value}`；乘数非零，负数使不等号反向 |
| `expression-layout` / `createExpression` | `expression,x,y,size,gap` | 树节点为文字、`row.children`、`frac.numerator/denominator`、`pow.base/exponent`、`sqrt.value`；结构排版，非 TeX/公式识别/计算机代数 |
| `function-analysis` / `createFunctionComparison` | `first,second:{a,b,c}`，坐标范围、`probeX,samples` | 一次/二次曲线、真实求根交点、观察点；`polynomialRoots` 处理退化方程，`linearSystemModel({rows:[[a,b,c],…]})` 处理两元线性系统 |
| `interval-set` / `createIntervalSet` | `sets:[[{lo,hi,loClosed,hiClosed}]]`，`operation:'intersection'/'union'` | `result` 为规范化区间；null 端点表示对应的无穷，支持空集和单点 |
| `measurement` / `createRuler` | `min,max,step,start,end,width,unit` | `length,signedDifference,ticks,toScreen`；端点必须在量程内，刻度不超过 500 |
| `measurement` / `createClock` | `minutes,x,y,radius` | `hourAngle,minuteAngle,angle`；分钟数允许小数，两针连续同步 |
| `measurement` / `createProtractor` | `angle,x,y,radius` | 0–180 度射线、刻度和读数 |
| `measurement` / `convertMeasure` | `(value,from,to)` | 仅同量纲：mm/cm/dm/m/km；平方、立方单位及 ha/L/mL；g/kg/t；s/min/h/day；fen/jiao/yuan；degree/arcmin/arcsec。浮点结果，不代替精确有理货币运算 |
| `calendar-bearing` / `createCalendar` | `year,month,selected` | 公历 1600–9999，`leap,days`；日期 ID 含年月，选中日需存在 |
| `calendar-bearing` / `createBearing` | `points:[{id,bearing,distance}]`，`origin,unit` | `destinations` 含 east/north；角从正北顺时针 |

## 平面几何

| 模块 / 创建入口 | 主要参数 | 数学返回与边界 |
| --- | --- | --- |
| `construction` / `createConstruction` | `kind,a,b,p,radius,progress,lengths,destination,direction` | 六种 kind 见预览；圆弧进度 0–1，结果由真实交点确定；SSS 要满足严格三角不等式；各作图的退化条件会被拒绝 |
| `parallel-lines` / `createParallelLines` | `angle,separation,secondAngle,center,length` | 两交点与八角；angle 15–165 度，第二线偏转不超过 20 度，截线不能近乎平行；显示线段自动延伸至交点外 |
| `triangle-geometry` / `createTriangleGeometry` | 三个非共线 `points`；`show:'medians'/'altitudes'/'bisectors'/'circumcenter'`，`showCircle` | 面积、四心、内外接圆半径及相关辅助线；钝角外部对象不会强行拉回内部 |
| `triangle-geometry` / `createRightTriangleRatios` | `a,b,x,y,unit,squares` | 三边、锐角、`sin,cos,tan` 与正方形面积共用模型；a、b 为正直角边 |
| `circle-geometry` / `createCircleGeometry` | `kind:'inscribed'/'chord'/'tangent'/'regular'`，`center,radius,start,end,vertex,external,sides` | 圆周角取不含顶点的弧；切点由圆外点计算；正多边形按等分圆心角建立 |
| `grid-transform` / `createGridTransform` | `points,kind,axis,center,translation,degrees,factor,origin,unit,range` | `transformed,areaRatio,orientationReversed,toScreen`；1–30 点，网格 range 1–15，位似比非零；像点可能超过所设网格范围，工程需调整 |
| `dissection` / `createDissection` | 凸 `points`，两点 `cut`，`poses:{'piece-0':{x,y,rotation},…}` | `pieces` 含来源、面积及刚体姿态；一次无限直线切割，支持相切；不求解目标拼图、重叠或连续多刀 |

## 立体几何

| 模块 / 创建入口 | 主要参数 | 数学返回与边界 |
| --- | --- | --- |
| `cone-surface` / `createConeSurface` | `radius,height,progress,segments,route,routeProgress,camera,showHidden,wireframe` | 母线、扇形角、侧面积和指定路线；材料映射保持长度；默认 r=5、h=5√3，扇形 180°，路线 10√2；默认相机随展开改变俯仰，可覆盖 |
| `cylinder-surface` / `createCylinderSurface` | `radius,height,progress,segments,showBases,camera,wireframe` | 宽 `2πr`、高 h、侧面积；底面只在闭合与最终布局出现，中间不含底面铰接 |
| `cuboid-net` / `createCuboidNet` | `width,height,depth,progress,camera,showLabels,wireframe` | 指定十字形六面网、表面积体积；绕共享边刚性旋转；不枚举所有网形 |
| `prism-surface` / `createPrismSurface` | 凸 `base`（3–16 点）、`height,progress,camera,wireframe` | 周长、侧面积、侧面矩形；底面只在闭合态出现，不是完整双底面铰接展开 |
| `solid-section` / `createCuboidSection` | `width,height,depth,normal,offset,camera` | 第一卦限长方体与 `normal·[x,y,z]=offset` 相交；`section,area` 可为空、点、线段、3–6 边形 |
| `solid-section` / `createRoundSection` | `kind:'cone'/'cylinder'`，`radius,height,fraction,camera` | 平行底面截面，fraction 为从底面起的高度比 [0,1]；非任意圆锥曲线 |
| `cube-assembly` / `createCubeAssembly` | 整数 `width,height,depth`，可选 `cubes:[[x,y,z]]`，`paintedFaces,highlight,explode,camera,view` | 小块身份、染色面数、外露面和三视图来源；染色按完整外包长方体切开前的外表面计算；单层块可有 4–6 染色面，勿套 n≥2 的公式 |
| `solid-views` / `createSolidViews` | `kind:'cuboid'/'cylinder'/'cone'/'sphere'`，尺寸、`unit` | 主、左、俯视图的真实宽高；曲面视图与立体表示分开 |
| `solid-views` / `createShadowProjection` | `kind:'parallel'/'central'`，尺寸、`direction,light,camera` | 光线与 y=0 地面的真实交点、影子轮廓；光源和光线需满足可投影条件 |

三维投影使用正交相机 `{yaw,pitch,origin,target,unit}`。面以不透明填色和深度处理呈现，后方线可隐藏/虚线；这是受限 SVG 三维表征，面排序不等于通用三维引擎的逐像素深度缓冲。复杂相交或大量爆炸小块须检查遮挡。`wireframe:true` 是诊断选项，不默认用于教学成片。

圆锥材料点的 `rho` 是到顶点的母线距离，`phi` 是展开扇形角；二维展开图中的直线点逐个映回侧面，不能在屏幕投影里直接连接端点。`coneChordModel({slant,from,to,samples})` 使用材料角弧度；跨度必须小于 π。路线与切口选择必须符合本题的行走范围。

## 统计、概率及基础函数

| 模块 / 创建入口 | 主要参数 | 数学返回与边界 |
| --- | --- | --- |
| `classification` / `createClassification` | `objects:[{id,shape,color,value}]`，`by:'shape'/'color'/'parity'`，`progress` | `groups,sourceIds,count`；同一对象从原位置到分类位置，形色不随分类改变 |
| `statistics` / `createStatistics` | `data:[{id,value,frequency}]`，`kind:'deviations'/'histogram'/'box'`，`bins,quartileMethod` | 频数非负整数；均值、中位数、全部众数、离差平方和、总体方差、四分位数。直方图 `[左,右)`，末组含右端点；不等组距用频数密度 |
| `sample-space` / `createSampleSpace` | `first,second` 为有身份和可选 weight 的对象数组；`withoutReplacement,event` | 有序对、可能数、有利数和加权概率；second=null 复用同一池；不放回排除同一 ID，事件函数必须是确定性的纯函数。只有等权时才能以结果个数比直接求概率 |
| `sample-space` / `createFrequencyExperiment` | 明确的 0/1 `results`，`count,theoretical` | 已观察次数、成功次数与频率；count=0 时频率未定义；不在 update 中随机取样 |
| `rational` | `rational,rationalOp,rationalText,rationalNumber,integerGcd,integerLcm` | 输入整数、十进制字符串或 `{n,d}`；BigInt 中间计算，输出安全整数分子分母；小数精确输入用字符串，越界/零分母拒绝 |
| `geometry-utils` | 2D 向量、直线/圆交点、垂足、旋转、凸裁切 | 供上述模型复用，几何容差不是一般命题证明 |
| `space-geometry` | `cameraModel,spaceSceneModel,rotateAroundAxis,createSpaceScene` 等 | 自定义有限多边形面/线/标记场景；`spaceSceneModel` 返回 project/isHidden；marker 可设 dot:false 仅留文字 |
| `diagram` | `createDiagram` 与 `diagramLine/Polygon/Text/Dot/Rect` | 用稳定 ID 更新图元，写入前校验重复 ID、类型冲突与非有限属性；不提供自动避让 |

所有入口的最小实例、可调参数及完整选项可在 `expansion-examples.mjs` 按示例 ID 定位。新增参数或改变题型后，执行对应模型测试并在实际画面检查；不能把预览滑块的取值集合视为接口全部有效范围。
