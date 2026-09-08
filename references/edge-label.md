# 随物理边移动的边长标注

仅在二维图形需要平移、旋转或统一缩放时读取。组件在 [assets/edge-label.mjs](../assets/edge-label.mjs)，无框架依赖；复制到视频工程的 assets 后使用，避免工程依赖 skill 的绝对路径。

## 约定与用法

- 边用对象本地坐标的 `start`、`end` 与垂直向外的 `outward` 定义。该方向由图形内部决定，不能随屏幕方位改名。
- `pose` 包含平移 `x,y`、旋转角度 `rotation`、本地中心 `cx,cy` 和正的统一缩放 `scale`；缺省分别为 0、0、0、0、0、1。坐标向右/向下为正，正角度顺时针。变换顺序为绕中心缩放与旋转，再平移。
- 图形与标注必须使用同一 pose。标签层是 SVG 中与变换结果共用坐标系的独立层，不能放进图形的旋转组。若有父组变换，统一到该输出坐标系后再使用。

```js
import { rigidMatrix, createEdgeLabel } from './assets/edge-label.mjs';

const aLabel = createEdgeLabel(labelLayer, {
  id: 'area-ab-left-length-a', text: 'a',
  edge: { start: [0, 240], end: [360, 240], outward: [0, 1] },
});
function update(pose) {
  const m = rigidMatrix(pose);
  shape.setAttribute('transform', `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`);
  aLabel.update(pose);
}
update({ x: 300, y: 200, cx: 180, cy: 120, rotation: 90 });
```

示例中下方的 a 会随同一条边转到左侧，文字仍正立。在工程现有的时间线更新/定位回调中调用 `update`，初始化时也调用一次；模块须在时间线注册和渲染就绪前加载完毕，不能另起计时器。

样式由工程设置，例如 `.edge-label { color: #F3F5F7; font-size: 44px; stroke-width: 3px; }`。`offset`（默认 18）、`tick`（8）、`textGap`（24）均为输出 SVG 坐标单位；图形自身缩放不会缩放这些间距或字号，整个 SVG 被屏幕缩放仍会一起缩放。

`createEdgeLabel` 只创建一次，返回 `group` 与 `update(pose)`；时间线可控制 group 显隐，但依据未被承接前不能淡出。纯函数 `edgeLabelGeometry` 可单独用于检查，返回变换后的边、外法线、括号路径与文字位置。

## 使用边界与验收

组件只负责边与标签的几何绑定，不判断教学时机、外法线是否指向图形内部、文字是否碰撞，也不支持透视、剪切或非均匀缩放。它不读取逐帧包围盒、不自动换边、不自动隐藏标签。

调用方按同一物理边检查旋转前、中、后及倒放定位；再查看实际字体、其它对象和运动路径是否遮挡。尤其要检查“边长建立 → 图形移走 → 面积 ab 出现”整条依据链，单独组件通过不代表样片通过。

组件几何测试：在本 skill 目录运行 `node --test assets/tests/edge-label.test.mjs`。测试覆盖边长不变（缩放时按比例变化）、外向偏移、90° 方位、重复/反向定位及非法输入；浏览器视觉与实际工程接入另行验证。
