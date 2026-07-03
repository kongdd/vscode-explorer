const assert = require('assert/strict');
const { convertRemotePath } = require('../dist/pathMapping.js');

assert.equal(convertRemotePath('/mnt/z', '/mnt/z', 'Z:/'), 'Z:/');
assert.equal(convertRemotePath('/mnt/z/project/data.csv', '/mnt/z', 'Z:/'), 'Z:/project/data.csv');
assert.equal(convertRemotePath('/mnt/z/project/data.csv', '/mnt/z/', 'Z:\\'), 'Z:/project/data.csv');
assert.equal(convertRemotePath('/mnt/zz/project/data.csv', '/mnt/z', 'Z:/'), undefined);

console.log('path mapping smoke tests passed');
