import test from 'node:test';
import assert from 'node:assert/strict';
import {effectiveMinutes} from '../../assets/practice-time.js';

const fixed = {practiceMinutes: 60, fixedPracticeMinutes: true};
const open = {practiceMinutes: 60};

test('a fixed-length exam ignores the requested time in exam mode', () => {
  assert.equal(effectiveMinutes(fixed, 'exam', '0'), 60);
  assert.equal(effectiveMinutes(fixed, 'exam', '30'), 60);
  assert.equal(effectiveMinutes(fixed, 'exam', 'abc'), 60);
  assert.equal(effectiveMinutes(fixed, 'exam', undefined), 60);
});

test('study mode keeps every time choice even for a fixed-length exam', () => {
  assert.equal(effectiveMinutes(fixed, 'study', '0'), 0);
  assert.equal(effectiveMinutes(fixed, 'study', '30'), 30);
  assert.equal(effectiveMinutes(fixed, 'study', undefined), 0);
});

test('other exams keep the old behaviour and fall back to the practice length on bad input', () => {
  assert.equal(effectiveMinutes(open, 'exam', '90'), 90);
  assert.equal(effectiveMinutes(open, 'exam', '0'), 0);
  assert.equal(effectiveMinutes(open, 'exam', '601'), 60);
  assert.equal(effectiveMinutes(open, 'exam', '-5'), 60);
  assert.equal(effectiveMinutes(open, 'exam', 'abc'), 60);
  assert.equal(effectiveMinutes(open, 'exam', undefined), 60);
});
