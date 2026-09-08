import test from 'node:test';
import assert from 'node:assert/strict';
import { rigidMatrix, edgeLabelGeometry } from '../edge-label.mjs';

const edge = { start: [0, 240], end: [360, 240], outward: [0, 1] };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('physical edge, perpendicular offset and screen spacing survive rotation, translation and scale', () => {
  for (const rotation of [0, 30, 45, 90, 180, 270, 360]) {
    for (const scale of [0.5, 1, 2]) {
      const pose = { x: 170, y: -80, cx: 180, cy: 120, rotation, scale };
      const g = edgeLabelGeometry(edge, pose);
      const vx = g.edgeEnd[0] - g.edgeStart[0], vy = g.edgeEnd[1] - g.edgeStart[1];
      close(Math.hypot(vx, vy), 360 * scale);
      close(vx * g.normal[0] + vy * g.normal[1], 0);
      const midpoint = g.edgeStart.map((v, i) => (v + g.edgeEnd[i]) / 2);
      for (let i = 0; i < 2; i++) {
        close(g.bracketStart[i] - g.edgeStart[i], g.normal[i] * 18);
        close(g.text[i] - midpoint[i], g.normal[i] * 42);
      }
      const m = rigidMatrix(pose);
      close(m.a * 180 + m.c * 120 + m.e, 170 + 180);
      close(m.b * 180 + m.d * 120 + m.f, -80 + 120);
    }
  }
});

test('bottom a follows the bottom physical edge to the left after 90 degrees', () => {
  const g = edgeLabelGeometry(edge, { rotation: 90, cx: 180, cy: 120 });
  close(g.normal[0], -1); close(g.normal[1], 0);
  close(g.edgeStart[0], 60); close(g.edgeEnd[0], 60);
  close(g.text[0], 18); close(g.text[1], 120);
});

test('reverse and repeated seeking produce exactly the same state without mutating inputs', () => {
  const original = JSON.stringify(edge);
  const states = [0, 45, 90].map(rotation => edgeLabelGeometry(edge, { rotation }));
  for (const index of [2, 0, 1, 2, 1, 0]) {
    assert.deepEqual(edgeLabelGeometry(edge, { rotation: [0, 45, 90][index] }), states[index]);
  }
  assert.equal(JSON.stringify(edge), original);
});

test('reject degenerate edges, invalid normals and unsupported poses', () => {
  for (const invalid of [
    { ...edge, end: [0, 240] }, { ...edge, outward: [0, 0] },
    { ...edge, outward: [1, 1] }, { ...edge, start: [NaN, 0] },
  ]) assert.throws(() => edgeLabelGeometry(invalid), RangeError);
  for (const pose of [{ scale: 0 }, { scale: -1 }, { rotation: Infinity }]) {
    assert.throws(() => edgeLabelGeometry(edge, pose), RangeError);
  }
});
