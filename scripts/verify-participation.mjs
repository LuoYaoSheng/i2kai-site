import assert from 'node:assert/strict';
import { canPurchase, canSelfBuild, getProjectDetails } from '../src/data/maker.mjs';

const valid = {
  state: 'in_stock', productUrl: 'https://shop.example.com/item', price: 99,
  currency: 'CNY', verified: true, verificationEvidence: 'reviewed listing and QA',
  version: 'V1', supportInfo: 'Documented support and returns',
};
assert.equal(canPurchase(valid), true);
for (const state of ['not_available', 'planning', 'interest_only', 'paused', 'unknown', undefined]) {
  assert.equal(canPurchase({ ...valid, state }), false, `must block ${state}`);
}
for (const [key, value] of [
  ['productUrl', null], ['productUrl', 'javascript:alert(1)'], ['productUrl', 'http://example.com'],
  ['productUrl', 'https://user:secret@example.com'], ['price', null], ['price', 0], ['price', -1],
  ['price', Infinity], ['currency', ''], ['verified', false], ['verificationEvidence', ' '],
  ['version', ''], ['supportInfo', ''],
]) assert.equal(canPurchase({ ...valid, [key]: value }), false, `must block ${key}=${value}`);
assert.equal(canPurchase(), false);
assert.equal(canSelfBuild({ state: 'published', url: valid.productUrl, license: 'MIT' }), true);
assert.equal(canSelfBuild({ state: 'partial', url: valid.productUrl, license: 'MIT' }), true);
for (const item of [undefined, {}, { state: 'published', url: valid.productUrl },
  { state: 'not_published', url: valid.productUrl, license: 'MIT' },
  { state: 'published', url: 'javascript:alert(1)', license: 'MIT' }]) {
  assert.equal(canSelfBuild(item), false);
}
const hardwareSlugs = ['queue-caller', 'modular-ai-robot-kit', 'esp32-c3-weather-station'];
for (const slug of ['missing-project', 'smart-ble', 'open-iot-platform', ...hardwareSlugs]) {
  const detail = getProjectDetails(slug);
  assert.equal(canPurchase(detail.participation.kit), false);
  assert.equal(canPurchase(detail.participation.assembled), false);
}
for (const slug of hardwareSlugs) {
  const detail = getProjectDetails(slug);
  assert.equal(canSelfBuild(detail.openResources), false, `${slug} must not offer an unreviewed resource`);
  assert.deepEqual(detail.seriesIds, ['fun-builds']);
}
console.log('Participation guards: passed (valid, missing, unavailable, paused, unverified, invalid URL/price/license cases).');
