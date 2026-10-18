import test from 'node:test';
import assert from 'node:assert/strict';
import {editKey, INDENT} from '../../assets/code-editor.js';

const at = (value, start, end = start) => ({value, start, end});

test('Tab inserts four spaces at the caret', () => {
  assert.deepEqual(editKey(at('ab', 1), 'Tab'), at('a' + INDENT + 'b', 5));
  assert.equal(INDENT.length, 4);
});

test('Tab over several lines indents each line and Shift+Tab takes one level back', () => {
  const indented = editKey(at('a\nb\nc', 0, 3), 'Tab');
  assert.equal(indented.value, '    a\n    b\nc');
  assert.deepEqual([indented.start, indented.end], [4, 11]);
  const back = editKey(at(indented.value, indented.start, indented.end), 'Tab', true);
  assert.equal(back.value, 'a\nb\nc');
  assert.equal(editKey(at('  x', 3), 'Tab', true).value, 'x');
});

test('Enter keeps the indentation of the current line', () => {
  assert.deepEqual(editKey(at('    foo();', 10), 'Enter'), at('    foo();\n    ', 15));
});

test('Enter after an opening brace adds one level and splits an empty block', () => {
  assert.deepEqual(editKey(at('if (a) {', 8), 'Enter'), at('if (a) {\n    ', 13));
  assert.deepEqual(editKey(at('    for (;;) {}', 14), 'Enter'), at('    for (;;) {\n        \n    }', 23));
});

test('a closing brace on a blank line steps back one level', () => {
  assert.deepEqual(editKey(at('if (a) {\n        ', 17), '}'), at('if (a) {\n    }', 14));
  assert.equal(editKey(at('    x = 1', 9), '}'), null);
  assert.equal(editKey(at('a', 1), 'ArrowUp'), null);
});

test('typing an opening brace adds the closing one, wraps a selection and can be typed over or deleted together', () => {
  assert.deepEqual(editKey(at('f()', 3), '{'), at('f(){}', 4));
  assert.deepEqual(editKey(at('ab', 0, 2), '{'), at('{ab}', 1, 3));
  assert.deepEqual(editKey(at('{}', 1), '}'), at('{}', 2));
  assert.deepEqual(editKey(at('{}', 1), 'Backspace'), at('', 0));
  assert.equal(editKey(at('{x}', 2), 'Backspace'), null);
});
