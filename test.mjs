import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {solveProof} from './pow.mjs';

test('solves a valid SHA-256 leading-zero-bit entry challenge',()=>{
  const challenge='example-challenge';
  const nonce=solveProof(challenge,8,100_000);
  const digest=createHash('sha256').update(`${challenge}:${nonce}`).digest();
  assert.equal(digest[0],0);
});

test('rejects invalid and unbounded challenge difficulty',()=>{
  assert.throws(()=>solveProof('test',-1));
  assert.throws(()=>solveProof('test',30));
  assert.throws(()=>solveProof('test',8,0));
});
