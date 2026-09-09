# 数学可复用组件

先看 [四种几何素材样式](style-board.html)：三角形、圆形、矩形、坐标轴的统一外观与标注方案已确认，背景采用 `#0B151C`，样式页中的 y 标注与箭头保留清楚间距。[预览图](style-board.png)为当前外观基准。对应静态 SVG 在 [designs/](designs/)；直角三角形、圆形与矩形均已支持尺寸参数调整，坐标轴支持正负范围与间距调整。

打开 [三角形交互预览](triangle-preview.html) 可调整底和高，[圆形交互预览](circle-preview.html) 可调整半径，[矩形交互预览](rectangle-preview.html) 可连续调整底和高，[坐标轴交互预览](axes-preview.html) 可调整正负范围与间距；[showcase.html](showcase.html) 包含矩形与斜率交互短例。预览页已内嵌所需样式和脚本，可离线打开。

## 课程补充库（v0.2）

按教育部 2022 年版数学课标补充 39 类交互示例，覆盖数与运算、代数与关系、度量与位置、平面几何、立体几何、统计与概率。先查 [课程知识点索引](CURRICULUM-COVERAGE.md)，再打开 [新素材预览](expansion-preview.html) 或 [接口说明](EXPANSION-API.md)。检查范围见 [EXPANSION-QA.md](EXPANSION-QA.md)。

## 原有小学、初中主干组件

原有 10 类可复用组件，见 [统一交互预览](library-preview.html)、[知识点覆盖表](COVERAGE.md)、[接口与接入说明](LIBRARY-API.md) 和 [验证记录](LIBRARY-QA.md)。包括数轴、等分格、一般多边形与变换、角标、扇形等分、函数图、代数块、立体图、统计图和概率树。它们补齐常用数学表征；完整证明与动作编排仍按题目完成。

## 原有组件

| 文件 | 职责 | 验证范围 |
| --- | --- | --- |
| `math-style.css` | 中文/数学字体、变量色、文字色、坐标轴基础样式 | 本机字体与样片编码画面；展示页宽/窄窗口 |
| `edge-label.mjs` | 物理边与括号、正立文字的几何绑定 | 沿用 skill 组件，已接入样片及动态 Δx/Δy 演示 |
| `labeled-rectangle.mjs` | 矩形尺寸、指定边标注与统一姿态更新 | 样片平移/旋转/归位；尺寸预览 9 组组合及调整后的四边旋转绑定 |
| `right-triangle.mjs` | 直角三角形底、高及顶点、边长、直角标记同步更新 | 9 组尺寸、标注边界、键盘/恢复操作与窄屏；已接入直角三角形面积视频 |
| `labeled-circle.mjs` | 圆周、半径线、圆心与半径标注同步更新 | 半径边界、端点、键盘/恢复操作与窄屏；已接入圆面积视频 |
| `coordinate-plane.mjs` | 等比例坐标映射、正负刻度范围与间距更新、横纵增量计算 | 坐标轴 18 组参数及原有默认参数；坐标及除零边界测试；已接入斜率视频 |

`a` 使用绿色、`b` 使用红色，矩形面积填色使用较淡的紫色；斜率短例另约定 Δx 为绿色、Δy 为红色、直线为紫色。配色不能代替字母/数值。字幕和说明保持白色，符号、指数保持中性白色。

## 接入新视频

把需要的模块及 `math-style.css` 复制到视频的 `assets/`。矩形依赖 `edge-label.mjs`，没有运行时第三方依赖；样片采用本地 GSAP 驱动时间。工程保留自己的副本，避免相对路径指向别的视频或本机 skill 目录。

直角三角形也依赖 `edge-label.mjs`，使用同一份样式。`x/y` 为直角顶点 C 的位置，底向右、高向上；尺寸必须为有限正数。每次 `update` 原地更新图形与标注，不重建元素。布局间距按已验收样式固定，不提供任意极端尺寸下的自动避让。

```js
import { createRightTriangle } from './assets/right-triangle.mjs';
const triangle = createRightTriangle(layer, {
  id: 'triangle', width: 270, height: 195, x: 160, y: 345,
});
triangle.update({ width: 320, height: 220 });
```

修改三角形组件或 `triangle-preview.template.html` 后运行 `node components/math/build-triangle-preview.mjs` 更新离线预览。

圆形使用 `createLabeledCircle(layer, { id, radius, x, y })` 创建，`x/y` 为圆心位置；调用 `update({ radius })` 原地更新半径，半径线保持水平向右，r 标注位于线段中点上方。模块无其他脚本依赖，搭配 `math-style.css` 使用。半径须为有限正数；当前预览验证范围为 50–180 画布单位，较小半径下不提供标注自动避让。修改组件或 `circle-preview.template.html` 后运行 `node components/math/build-circle-preview.mjs` 更新离线预览。


```js
import { createLabeledRectangle } from './assets/labeled-rectangle.mjs';
const item = createLabeledRectangle(shapeLayer, labelLayer, {
  id: 'example', width: 320, height: 200,
  edges: [{ side: 'bottom', text: 'a' }, { side: 'left', text: 'b' }],
  pose: { x: 200, y: 300, rotation: 0 },
});
// 时间线只修改这一个 pose；图形和边长随后一起更新。
item.pose.rotation = 90;
item.update(item.pose);
```

- `shapeLayer` 与 `labelLayer` 必须在同一输出坐标系，标注层不得放在旋转组内部。
- `pose` 包含 `x/y/rotation/cx/cy/scale`，旋转默认围绕矩形中心；`scale` 只能为正的统一缩放。
- `edges` 在构建时确定；使用 `setSize({ width, height })` 原地调整尺寸并更新所有边长标注，`width/height` 读取值同步更新。尺寸必须为有限正数。
- `setSize` 保留当前姿态和旋转中心；需绕新中心旋转时显式调用 `update({ cx: width / 2, cy: height / 2 })`。旧 `showcase.html` 仍使用重建尺寸的演示方式；新的尺寸交互见 `rectangle-preview.html`。
- `id` 在页面中须唯一，同一矩形中每个 `text` 也须唯一；教学显隐、文本排版和碰撞避让由分镜负责。
- 在时间线定位/更新后调用 `update`，并初始化一次。当前 HyperFrames 的定位会触发回调；如果调用 `seek(t, true)` 抑制回调，调用方须随后显式更新几何。
- `group` 控制区域整体显隐，`labels` 是独立标注，二者由同一段时间线安排。不要在下一步依据尚未建立时隐藏标注。

```js
import { createCoordinatePlane, riseRun } from './assets/coordinate-plane.mjs';
const plane = createCoordinatePlane(layer, {
  origin: [150, 610], unit: 80, xMax: 6, yMax: 6,
});
const point = [4, 2];
const screenPoint = plane.toScreen(point); // [470, 450]，数学 y 向上
const { dx, dy, slope } = riseRun([0, 0], point); // 4, 2, 0.5
```

坐标轴默认保持第一象限参数。设置 `xMin/yMin` 可显示负方向；下限为 −20 至 0 的整数，上限为 1 至 20 的整数，范围必须包含原点。调用 `plane.update({ xMin: -3, xMax: 3, yMin: -2, yMax: 2, unit: 50 })` 更新刻度、网格与标注，已有 `toScreen` 引用使用最新映射。可同时更新 `origin`；整数范围变化时仅增删相应数字，两轴保持同一间距。预览已验证 x 范围 ±2 至 ±4、y 范围 ±1 至 ±3、间距 45–55；其他布局仍需检查文字避让。`dx=0` 时 `slope=null`，调用方应显示“不存在”，不能显示 Infinity 或套用除法公式。

修改矩形组件或 `rectangle-preview.template.html` 后运行 `node components/math/build-rectangle-preview.mjs` 更新矩形离线预览。

修改坐标轴组件或 `axes-preview.template.html` 后运行 `node components/math/build-axes-preview.mjs` 更新离线预览。

## 修改与检查

编辑模块、`math-style.css` 或 `showcase.template.html` 后，在项目根目录运行：

```sh
node components/math/build-showcase.mjs
node --test components/math/tests/coordinate-plane.test.mjs
```

构建只是把这组固定模块内嵌为离线展示页，无下载、安装或网络请求。不要直接修改生成的 `showcase.html`。组件改动后，按需同步到使用它的工程，并复查实际片段；不自动更新所有历史视频。

当前展示页的斜率例子验证了参数、点、增量、比值的同步；历史斜率动画（开发项目中） 已将坐标组件接入 HyperFrames 时间线，包含差量追踪与一般式推导，检查记录见其 历史 QA（开发项目中）。完整样片验证记录见 历史完全平方 QA（开发项目中），展示页记录见 [QA.md](QA.md)。一般三角形及外部高已由新增 `polygon.mjs` 提供；已补[结构化分式、根式和幂排版](EXPANSION-API.md)，自动避让与通用 TeX 解析尚未实现。新增组件尚未逐一接入完整视频时间线，组件预览检查不替代视频验收。
