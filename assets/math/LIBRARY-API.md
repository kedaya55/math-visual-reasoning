# 新增组件接口

后续课程补充见 [EXPANSION-API.md](EXPANSION-API.md)；本文保留原有组件接口。

[覆盖范围](COVERAGE.md) · [离线预览](library-preview.html)

## 公共使用方式

各模块导出独立的纯模型函数与 SVG 创建函数；模型不需要浏览器。创建函数接受同一坐标系的 SVG 层与参数，返回 `group`、`update(next)`、只读 `model` 以及需要独立调度的节点集合。`update` 使用当前完整状态加本次参数，重新计算依赖量，不累加动画位移。调用方不要直接修改返回模型的数据。

图形使用画布坐标（x 向右、y 向下）；函数使用数学坐标，通过已有坐标轴映射。文字保持正立。`group.remove()` 可移除整个组件。ID 由调用方保证页面内唯一；集合成员另使用稳定语义 ID。

把使用的模块和 `svg-helpers.mjs` 复制到新工程的 `assets/`；多边形另外需要 `edge-label.mjs`，函数图通常配 `coordinate-plane.mjs`。沿用 `math-style.css`。没有新增运行时依赖，不自动替换历史视频中的副本。

```js
import { createPolygon } from './assets/polygon.mjs';
const triangle = createPolygon(svgLayer, {
  id: 'triangle-1',
  points: [[0, 0], [280, 0], [80, -180]],
  base: 0, altitudeVertex: 2,
  vertexLabels: ['A', 'B', 'C'], edgeLabels: ['b'], heightLabel: 'h',
  pose: { x: 500, y: 500 },
});
triangle.update({ points: [[0, 0], [280, 0], [-80, -180]] });
// 垂足移到边的延长线，延长线与高一起更新。
triangle.update({ pose: { rotation: 30 } });
```

| 模块 | 导出 | 核心参数与返回数据 |
| --- | --- | --- |
| `number-line.mjs` | `numberLineModel`, `createNumberLine` | `min/max/step/x/y/width`；`markers:[{id,value,label,color,labelOffset}]`；`interval:{start,end,startClosed,endClosed}`；`jump:{from,to,label}`。返回稳定的 `toScreen(value)` 引用和点节点集合 |
| `fraction-grid.mjs` | `fractionGridModel`, `createFractionGrid` | `x/y/width/height/rows/columns/selected`；选中前 `selected` 个格，按行排列。`sourceRows/sourceColumns/sourceId` 固定来源分组；`sourceColors`、`showUnits`、`label`。模型返回 `value/denominator/cells`，每格含 `id/parentId/pose/unit`；`cells` 节点集合可独立调度 |
| `polygon.mjs` | `polygonModel`, `transformPoints`, `createPolygon` | `points` 为顺边界排列的简单多边形；`pose` 支持已有刚体参数及 `reflect:'x'/'y'/null`（先按局部轴反射，再应用姿态）。`base` 是底边起点索引，`altitudeVertex` 是非底边顶点；返回面积、周长、高、垂足、是否外部高 |
| `angle.mjs` | `angleModel`, `createAngle` | `vertex/start/end/radius/reflex`；默认选小角；`label` 覆盖自动角度，`showRays:false` 可只画角标，`rightSquare:false` 禁用直角方框。返回角度、弧线路径、文字位置 |
| `sector-partition.mjs` | `sectorPartitionModel`, `createSectorPartition` | `x/y/radius/count/sourceCount/startAngle`，角度单位为度；`sourceColors/arcColors/sourceLabels` 按来源组映射；每块含 `id/parentId/area/arcLength/pose`；`showLabels:false` 可由题目自行接管来源标记 |
| `function-graph.mjs` | `functionValue`, `functionGraphModel`, `createFunctionGraph` | `kind:'linear'/'quadratic'/'reciprocal'`；分别为 ax+b、ax²+bx+c、a/x。参数 `a/b/c/xMin/xMax/yMin/yMax/probeX/samples`，创建时传 `toScreen`；可用 `probeLabelOffset:[dx,dy]` 调整文字。返回分段曲线、观察点、二次函数顶点 |
| `algebra-tiles.mjs` | `algebraTilesModel`, `createAlgebraTiles` | `terms:[{id,kind:'x2'/'x'/'one',sign:1/-1,x,y,rotation}]`；`unit/xLength` 为视觉尺寸。返回同类项系数与 `evaluate(x)`；`tiles` 提供可追踪项的节点 |
| `solid.mjs` | `solidModel`, `createSolid` | `kind:'cuboid'/'cylinder'/'cone'/'sphere'`；`width/depth/height/radius/origin/unit`。宽深高相等即正方体；球忽略高。返回体积、表面积与空间到画布的 `project` |
| `data-chart.mjs` | `dataChartModel`, `createDataChart` | `kind:'bar'/'line'/'pie'`；`data:[{id,label,value,color}]`；`x/y/width/height/max`。`max` 默认取最大值，统一比较时应显式固定。返回占比、总和、均值、中位数 |
| `probability-tree.mjs` | `probabilityTreeModel`, `createProbabilityTree` | `tree:{id,label,children:[...]}`；子节点额外有 `probability`，表示给定父节点后的条件概率。`x/y/width/height` 控制布局；返回所有节点、边及末端路径概率 |

## 分割与时间线

等分格和扇形的 `parentId` 表示固定的原始来源组，不表示任意上一次调用的临时分块。提高细分度时使用新子块 ID；不会把另一个来源的旧 ID 分配给它。需要逐层分割时，由题目记录当前层到下一层的几何覆盖与交接关系。

`poses` 是按模型中每个子块的 `id` 索引的完整位移表，值为 `{x,y,rotation}`。等分格绕自身中心旋转；扇形绕原圆心（扇形顶点）旋转。未提供的子块回到零位移。不要把 `poses` 写成逐帧累加量。

```js
import { sectorPartitionModel, createSectorPartition } from './assets/sector-partition.mjs';
const base = { id: 'circle-cut', x: 800, y: 450, radius: 180, count: 16, sourceCount: 4 };
const pieces = createSectorPartition(svgLayer, base);
function setProgress(progress) {
  const poses = {};
  for (const sector of sectorPartitionModel(base).sectors) {
    if (sector.parentId === 'source-0') poses[sector.id] = { x: 100 * progress, y: 0, rotation: 0 };
  }
  pieces.update({ poses });
}
// 在已有时间线的定位 / 更新回调中用绝对进度调用；先建立来源再移动。
```

函数图在坐标轴更新后须调用自身 `update()`，它会通过同一个 `toScreen` 读取最新映射。绘图是有限采样，不把曲线采样点当作符号解；反比例图在零点断开，超出纵轴范围的点也会分段。

## 参数与验证边界

- 数轴最多 200 个刻度，区间必须在当前轴范围内；不自动避让多个相邻点标签。
- 等分格最多 400 格，行列数必须分别是来源行列数的整数倍；本次画面验证为 3–15 列。小格可隐藏单位文字，但来源仍需通过题目说明。
- 多边形 3–100 点，拒绝自交、折返、相邻重复点和零面积；本次预览验证三角形、平行四边形、梯形、五边形。面积来自顶点而非套用外观公式。
- 扇形 2–256 块，总数是来源组数的整数倍；本次交互验证为 4–64 块、固定 4 个来源组。
- 函数每条曲线 20–4000 个采样间隔；预览使用 400，反比例 a ≠ 0，x = 0 时观察点返回 `y:null`。
- 概率树最多 200 节点、8 层；同一节点下概率和容差为 1e−9。大树不会自动放大布局，本次视觉验证为两次不放回取球。
- 图表支持 1–40 个非负值，扇形图必须有正总量；本次视觉验证为 4 类。长分类名、多点重合或更密集数据需题目调整布局。
- 字体、标签间距与任意组合参数的避让不是自动保证。已验证范围见 [LIBRARY-QA.md](LIBRARY-QA.md)。

重建离线预览：`node components/math/build-library-preview.mjs`。必要模型检查：`node --test components/math/tests/library.test.mjs`。
