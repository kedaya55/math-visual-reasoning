import { createEdgeLabel } from './edge-label.mjs';

// C is the lower-left origin; a extends right and b extends upward.
export function createRightTriangle(layer, { id, width, height, x = 0, y = 0 }) {
  const state = { width, height, x, y };
  const validate = next => {
    if (![next.width, next.height, next.x, next.y].every(Number.isFinite) ||
        next.width <= 0 || next.height <= 0) throw new RangeError('Positive dimensions and finite origin required');
  };
  validate(state);
  const element = (tag, attributes = {}) => {
    const node = layer.ownerDocument.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  };
  const group = element('g', { id });
  const shape = element('path', { fill: 'var(--math-area, #B19CFF)', 'fill-opacity': .12,
    stroke: 'var(--math-area, #B19CFF)', 'stroke-width': 3, 'stroke-linejoin': 'round' });
  const rightAngle = element('path', { fill: 'none', stroke: 'var(--math-white, #F3F5F7)', 'stroke-width': 2 });
  group.append(shape, rightAngle);
  const edges = {
    a: { start: [0, 0], end: [width, 0], outward: [0, 1] },
    b: { start: [0, -height], end: [0, 0], outward: [-1, 0] },
  };
  const labels = Object.fromEntries(Object.entries(edges).map(([text, edge]) => {
    const label = createEdgeLabel(group, { id: `${id}-${text}`, text, edge, offset: 24, tick: 10, textGap: 28 });
    label.group.style.color = `var(--math-${text}, ${text === 'a' ? '#55DFBC' : '#F47D7D'})`;
    label.group.setAttribute('font-size', 34);
    label.group.setAttribute('stroke-width', 2);
    return [text, label];
  }));
  const texts = {};
  for (const name of ['A', 'B', 'C', 'c']) {
    const node = element('text', { fill: 'var(--math-white, #F3F5F7)',
      'font-family': 'var(--font-math, "Helvetica Neue", Arial, sans-serif)', 'font-weight': 500,
      'font-size': name === 'c' ? 34 : 23, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    node.textContent = name;
    texts[name] = node;
    group.append(node);
  }
  function update(next = {}) {
    const candidate = { ...state, ...next };
    validate(candidate);
    Object.assign(state, candidate);
    const { width: w, height: h, x, y } = state;
    const c = Math.hypot(w, h), mark = Math.min(21, w / 6, h / 6);
    group.setAttribute('transform', `translate(${x} ${y})`);
    shape.setAttribute('d', `M0 ${-h} L${w} 0 L0 0 Z`);
    rightAngle.setAttribute('d', `M0 ${-mark} H${mark} V0`);
    edges.a.end = [w, 0];
    edges.b.start = [0, -h];
    labels.a.update();
    labels.b.update();
    const positions = { A: [-8, -h - 26], B: [w + 23, 8], C: [-27, 20],
      c: [w / 2 + 38 * h / c, -h / 2 - 38 * w / c] };
    for (const [name, [tx, ty]] of Object.entries(positions)) {
      texts[name].setAttribute('x', tx);
      texts[name].setAttribute('y', ty);
    }
    return { width: w, height: h, hypotenuse: c };
  }
  update();
  layer.append(group);
  return { group, shape, rightAngle, labels, texts, update };
}
