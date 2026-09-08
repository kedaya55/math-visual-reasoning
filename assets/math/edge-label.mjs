// Coordinates use x right, y down; positive rotation is clockwise in degrees.
export function rigidMatrix({ x = 0, y = 0, rotation = 0, cx = 0, cy = 0, scale = 1 } = {}) {
  if (![x, y, rotation, cx, cy, scale].every(Number.isFinite) || scale <= 0) {
    throw new RangeError('Pose must be finite with positive uniform scale');
  }
  const angle = rotation * Math.PI / 180;
  const a = scale * Math.cos(angle), b = scale * Math.sin(angle);
  const c = -b, d = a;
  return { a, b, c, d, e: x + cx - a * cx - c * cy, f: y + cy - b * cx - d * cy };
}

export function edgeLabelGeometry({ start, end, outward }, pose = {}, {
  offset = 18, tick = 8, textGap = 24,
} = {}) {
  if (![...start, ...end, ...outward, offset, tick, textGap].every(Number.isFinite) ||
      [start, end, outward].some(p => p.length !== 2) || Math.min(offset, tick, textGap) < 0) {
    throw new RangeError('Use finite 2D points and nonnegative label distances');
  }
  const dx = end[0] - start[0], dy = end[1] - start[1];
  const length = Math.hypot(dx, dy), normalLength = Math.hypot(...outward);
  if (!length || !normalLength || Math.abs(dx * outward[0] + dy * outward[1]) > 1e-9 * length * normalLength) {
    throw new RangeError('Edge must have length and outward must be a perpendicular nonzero vector');
  }
  const m = rigidMatrix(pose);
  const point = ([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
  const normal = [m.a * outward[0] + m.c * outward[1], m.b * outward[0] + m.d * outward[1]];
  const magnitude = Math.hypot(...normal);
  const n = normal.map(v => v / magnitude);
  const p = point(start), q = point(end);
  const shift = (p, distance) => p.map((v, i) => v + n[i] * distance);
  const bracketStart = shift(p, offset), bracketEnd = shift(q, offset);
  const segment = (p, q) => `M ${p[0]} ${p[1]} L ${q[0]} ${q[1]}`;
  const path = [segment(bracketStart, bracketEnd),
    segment(shift(p, offset - tick / 2), shift(p, offset + tick / 2)),
    segment(shift(q, offset - tick / 2), shift(q, offset + tick / 2))].join(' ');
  return { edgeStart: p, edgeEnd: q, normal: n, bracketStart, bracketEnd,
    text: shift(p.map((v, i) => (v + q[i]) / 2), offset + textGap), path };
}

// Place the layer outside the moving shape group, in the matrix's output coordinates.
// Update from the SAME pose as the shape on every timeline seek/update.
export function createEdgeLabel(layer, { id, text, edge, ...spacing }) {
  const doc = layer.ownerDocument;
  const element = tag => doc.createElementNS('http://www.w3.org/2000/svg', tag);
  const group = element('g'), bracket = element('path'), label = element('text');
  group.id = id;
  group.setAttribute('class', 'edge-label');
  bracket.setAttribute('fill', 'none');
  bracket.setAttribute('stroke', 'currentColor');
  label.setAttribute('fill', 'currentColor');
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('dominant-baseline', 'central');
  label.textContent = text;
  group.append(bracket, label);
  layer.append(group);
  return {
    group,
    update(pose) {
      const geometry = edgeLabelGeometry(edge, pose, spacing);
      bracket.setAttribute('d', geometry.path);
      label.setAttribute('x', geometry.text[0]);
      label.setAttribute('y', geometry.text[1]);
      return geometry;
    },
  };
}
