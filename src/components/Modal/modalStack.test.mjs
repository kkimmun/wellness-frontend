import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createModalStack } from './modalStack.js';
test('new modal hides previous and closing restores pending flow', () => {
 const stack = createModalStack();
 const closeForm = stack.register('form');
 const closeNotice = stack.register('notice');
 assert.equal(stack.getSnapshot(), 'notice');
 closeNotice(); assert.equal(stack.getSnapshot(), 'form');
 closeForm(); assert.equal(stack.getSnapshot(), null);
});
test('session expiry takes precedence even over later alerts', () => {
 const stack = createModalStack();
 const closeSession = stack.register('session', 100);
 const closeError = stack.register('error');
 assert.equal(stack.getSnapshot(), 'session');
 closeError(); closeSession(); assert.equal(stack.getSnapshot(), null);
});
test('unmounting hidden dialog does not disturb current dialog; remount works', () => {
 const stack = createModalStack();
 const closeFirst = stack.register('first');
 const closeSecond = stack.register('second');
 closeFirst(); assert.equal(stack.getSnapshot(), 'second');
 closeSecond();
 const closeAgain = stack.register('first');
 assert.equal(stack.getSnapshot(), 'first'); closeAgain();
});
