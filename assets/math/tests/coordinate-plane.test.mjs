import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinateMap,riseRun} from '../coordinate-plane.mjs';
test('math y points upward and both axes use the same unit',()=>{
 const map=coordinateMap({origin:[150,610],unit:80});
 assert.deepEqual(map([0,0]),[150,610]);
 assert.deepEqual(map([4,2]),[470,450]);
 assert.deepEqual(map([-1,-2]),[70,770]);
});
test('rise/run handles translated points, negative and horizontal slopes, and vertical lines',()=>{
 assert.deepEqual(riseRun([1,2],[5,4]),{dx:4,dy:2,slope:.5});
 assert.deepEqual(riseRun([1,3],[5,1]),{dx:4,dy:-2,slope:-.5});
 assert.deepEqual(riseRun([1,2],[5,2]),{dx:4,dy:0,slope:0});
 assert.deepEqual(riseRun([1,2],[1,4]),{dx:0,dy:2,slope:null});
});
test('invalid values cannot silently produce a broken diagram',()=>{
 assert.throws(()=>coordinateMap({unit:0}),RangeError);
 assert.throws(()=>coordinateMap({origin:[Infinity,0]}),RangeError);
 assert.throws(()=>coordinateMap()([NaN,0]),RangeError);
 assert.throws(()=>riseRun([0,0],[1,Infinity]),RangeError);
});
