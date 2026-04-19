import test from 'node:test';
import assert from 'node:assert/strict';

import { RemoveBGVideoClient } from '../src/index.js';

test('createJob uses /v1/jobs endpoint', async () => {
  const client = new RemoveBGVideoClient({ apiKey: 'test_key', baseUrl: 'https://api.example.com' });

  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    assert.equal(url, 'https://api.example.com/v1/jobs');
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'job_1' }),
    };
  };

  try {
    const data = await client.createJob({ video_url: 'https://cdn.example.com/in.mp4' });
    assert.equal(data.id, 'job_1');
  } finally {
    global.fetch = originalFetch;
  }
});
