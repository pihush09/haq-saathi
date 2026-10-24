process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = ''; // Test offline fallback mode in unit tests
import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';
import { AddressInfo } from 'net';

let server: any;
let baseUrl = '';

test.before(async () => {
  await new Promise<void>((resolve) => {
    // Listen on port 0 to get an ephemeral free port
    server = app.listen(0, () => {
      const addr = server.address() as AddressInfo;
      baseUrl = `http://localhost:${addr.port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test('API GET /api/health returns 200 with service metadata', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data: any = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'Haq Saathi API');
  assert.equal(typeof data.aiConfigured, 'boolean');
});

test('API GET /api/schemes returns all verified schemes', async () => {
  const res = await fetch(`${baseUrl}/api/schemes`);
  assert.equal(res.status, 200);
  const data: any = await res.json();
  assert.ok(data.total >= 6);
  assert.ok(Array.isArray(data.schemes));
});

test('API POST /api/match processes valid profile and returns matches', async () => {
  const profile = {
    occupation: 'street_vendor',
    age: 32,
    monthlyIncome: 12000,
    isTaxPayer: false,
    hasEpfoEsic: false,
    hasBankAccount: true,
    state: 'Delhi'
  };

  const res = await fetch(`${baseUrl}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });

  assert.equal(res.status, 200);
  const data: any = await res.json();
  assert.ok(data.potentialMatches.length > 0);
  const svanidhi = data.potentialMatches.find((m: any) => m.schemeId === 'pmsvanidhi');
  assert.ok(svanidhi, 'Street vendor should potentially match PM SVANidhi');
});

test('API POST /api/match rejects sensitive fields like aadhaarNo', async () => {
  const badProfile = {
    occupation: 'street_vendor',
    age: 32,
    monthlyIncome: 12000,
    aadhaarNo: '1234-5678-9012'
  };

  const res = await fetch(`${baseUrl}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badProfile)
  });

  assert.equal(res.status, 400);
  const data: any = await res.json();
  assert.ok(data.error.includes('Sensitive personal identifiers'));
});

test('API POST /api/explain returns plain language explanation in fallback mode', async () => {
  const res = await fetch(`${baseUrl}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemeId: 'pmsym', language: 'hi' })
  });

  assert.equal(res.status, 200);
  const data: any = await res.json();
  assert.ok(data.simpleExplanation);
  assert.ok(data.officialUrl.startsWith('https://'));
});

test('API POST /api/checklist returns structured steps', async () => {
  const res = await fetch(`${baseUrl}/api/checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemeId: 'eshram' })
  });

  assert.equal(res.status, 200);
  const data: any = await res.json();
  assert.equal(data.schemeId, 'eshram');
  assert.ok(data.steps.length >= 3);
  assert.ok(data.documentsToPrepare.length >= 2);
});

test('Static Frontend is served at /', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes('Haq Saathi'));
  assert.ok(html.includes('id="root"'));
});
