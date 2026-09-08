// One radius drives the circle, radius segment and its upright label.
export function createLabeledCircle(layer, { id, radius, x = 0, y = 0 }) {
  const state = { radius, x, y };
  const validate = next => {
    if (![next.radius, next.x, next.y].every(Number.isFinite) || next.radius <= 0) {
      throw new RangeError('Positive radius and finite center required');
    }
  };
  validate(state);
  const element = (tag, attributes = {}) => {
    const node = layer.ownerDocument.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  };
  const group = element('g', { id });
  const circle = element('circle', { cx: 0, cy: 0, fill: 'var(--math-area, #B19CFF)',
    'fill-opacity': .12, stroke: 'var(--math-area, #B19CFF)', 'stroke-width': 3 });
  const radiusLine = element('line', { x1: 0, y1: 0, y2: 0,
    stroke: 'var(--math-a, #55DFBC)', 'stroke-width': 2 });
  const center = element('circle', { cx: 0, cy: 0, r: 4, fill: 'var(--math-white, #F3F5F7)' });
  const text = (value, attributes) => {
    const node = element('text', { 'font-family': 'var(--font-math, "Helvetica Neue", Arial, sans-serif)',
      'font-weight': 500, 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attributes });
    node.textContent = value;
    return node;
  };
  const centerLabel = text('O', { x: -20, y: 24, 'font-size': 23, fill: 'var(--math-white, #F3F5F7)' });
  const radiusLabel = text('r', { y: -27, 'font-size': 34, fill: 'var(--math-a, #55DFBC)' });
  group.append(circle, radiusLine, center, centerLabel, radiusLabel);
  function update(next = {}) {
    const candidate = { ...state, ...next };
    validate(candidate);
    Object.assign(state, candidate);
    group.setAttribute('transform', `translate(${state.x} ${state.y})`);
    circle.setAttribute('r', state.radius);
    radiusLine.setAttribute('x2', state.radius);
    radiusLabel.setAttribute('x', state.radius / 2);
    return { ...state };
  }
  update();
  layer.append(group);
  return { group, circle, radiusLine, center, centerLabel, radiusLabel, update };
}
