import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../src/app.js';

test('health route returns service status', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const body = await response.json();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.service, 'CampusBid API');
});
