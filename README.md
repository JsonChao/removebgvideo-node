<p align="center">
  <img src="https://removebgvideo.com/images/remove-bg-video-logo.png" alt="RemoveBGVideo" width="72" />
</p>

<h1 align="center">RemoveBGVideo Node.js SDK</h1>

<p align="center">
  Official Node.js SDK for RemoveBGVideo Public API (<code>/v1</code>)
</p>

<p align="center">
  <a href="https://github.com/JsonChao/removebgvideo-node/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/JsonChao/removebgvideo-node/ci.yml?branch=main&label=CI" alt="CI" /></a>
  <a href="https://github.com/JsonChao/removebgvideo-node/actions/workflows/release.yml"><img src="https://img.shields.io/github/actions/workflow/status/JsonChao/removebgvideo-node/release.yml?branch=main&label=Release" alt="Release" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933" alt="Node >=18" />
  <img src="https://img.shields.io/badge/API-v1-7c3aed" alt="API v1" />
  <img src="https://img.shields.io/badge/license-MIT-16a34a" alt="MIT License" />
</p>

<p align="center">
  <a href="https://removebgvideo.com/docs"><strong>📘 Full Documentation</strong></a>
  ·
  <a href="https://removebgvideo.com/api"><strong>🧪 API Playground</strong></a>
  ·
  <a href="https://removebgvideo.com/api-management"><strong>🔐 API Management</strong></a>
  ·
  <a href="https://github.com/JsonChao/removebgvideo-node"><strong>🐙 GitHub</strong></a>
</p>

## Why This SDK

`removebgvideo-node` wraps the `/v1` REST API and gives you:

- Consistent authentication (`X-Api-Key`) and request timeout handling
- Typed method signatures for jobs, uploads, usage, and admin operations
- Built-in polling helper (`waitForCompletion`) for async video workflows
- Structured API errors (`ApiError`) with `statusCode`, `code`, and `requestId`

## Installation

```bash
npm install removebgvideo-node
```

## Requirements

- Node.js 18+
- RemoveBGVideo API key for public endpoints
- Optional admin token for admin endpoints

## Quick Start

```js
import { RemoveBGVideoClient } from 'removebgvideo-node';

const client = new RemoveBGVideoClient({
  apiKey: process.env.REMOVEBGVIDEO_API_KEY,
});

const created = await client.createJob({
  video_url: 'https://cdn.example.com/input.mp4',
  model: 'original',
  bg_type: 'transparent',
  output_format: 'webm',
  auto_start: true,
});

const result = await client.waitForCompletion(created.id, {
  intervalMs: 2000,
  timeoutMs: 10 * 60 * 1000,
});

console.log(result.output_url);
```

## Authentication

### Public API Client

```js
import { RemoveBGVideoClient } from 'removebgvideo-node';

const client = new RemoveBGVideoClient({
  apiKey: process.env.REMOVEBGVIDEO_API_KEY,
  baseUrl: 'https://api.removebgvideo.com',
  timeoutMs: 30000,
});
```

### Admin API Client

```js
import { RemoveBGVideoAdminClient } from 'removebgvideo-node';

const admin = new RemoveBGVideoAdminClient({
  adminToken: process.env.REMOVEBGVIDEO_ADMIN_TOKEN,
  baseUrl: 'https://api.removebgvideo.com',
  timeoutMs: 30000,
});
```

## End-to-End Workflows

### 1) Process an Existing Video URL

```js
const created = await client.createJob({
  video_url: 'https://cdn.example.com/input.mp4',
  model: 'human',
  bg_type: 'transparent',
  output_format: 'webm',
  auto_start: true,
});

const done = await client.waitForCompletion(created.id);
console.log(done.status, done.output_url);
```

### 2) Upload Local File Then Process

```js
import fs from 'node:fs/promises';

const file = await fs.readFile('./input.mp4');
const blob = new Blob([file], { type: 'video/mp4' });

const uploaded = await client.upload(blob, 'input.mp4');
const created = await client.createJob({
  video_url: uploaded.video_url,
  model: 'light',
  output_format: 'webm',
  auto_start: true,
});

const done = await client.waitForCompletion(created.id);
console.log(done.output_url);
```

### 3) Create Pending Job, Start Later

```js
const created = await client.createJob({
  video_url: 'https://cdn.example.com/input.mp4',
  model: 'pro',
  text_prompt: 'person wearing red jacket',
  auto_start: false,
});

await client.startJob(created.id);
const done = await client.waitForCompletion(created.id);
```

## Model Selection Guide

| Model | Speed | Quality | Best For | text_prompt |
|---|---|---|---|---|
| `original` | Standard | Highest | General quality-first segmentation | No |
| `light` | Fastest cost/perf | High | Simple scenes, throughput-first workloads | No |
| `pro` | Slowest | Highest | Complex objects with prompt-based targeting | Yes |
| `human` | Fast | High | Portraits / human subjects | No |

## Job Options Reference

`createJob(options)` accepts:

- `video_url` (string, required)
- `model` (`original` | `light` | `pro` | `human`, default `original`)
- `bg_type` (string, default `green`)
- `output_format` (string, default `webm`)
- `text_prompt` (string, optional, meaningful for `pro`)
- `bg_color` (number[], optional)
- `auto_start` (boolean, default `true`)
- `metadata` (object, optional)

## Public Client API

### Constructor

```ts
new RemoveBGVideoClient({
  apiKey: string,
  baseUrl?: string,
  timeoutMs?: number,
})
```

### Methods

- `upload(fileOrBlob, filename?)` -> `POST /v1/uploads`
- `createJob(options)` -> `POST /v1/jobs`
- `startJob(jobId)` -> `POST /v1/jobs/{id}/start`
- `getJob(jobId)` -> `GET /v1/jobs/{id}`
- `listJobs({ limit, offset, status })` -> `GET /v1/jobs`
- `usageSummary({ days })` -> `GET /v1/usage/summary`
- `usageEvents({ limit })` -> `GET /v1/usage/events`
- `waitForCompletion(jobId, { intervalMs, timeoutMs })` -> polling helper

### Polling Behavior (`waitForCompletion`)

- Returns job payload when `status === completed`
- Throws `ApiError` when `status === failed`
- Throws timeout error when elapsed time exceeds `timeoutMs`

## Admin Client API

### Constructor

```ts
new RemoveBGVideoAdminClient({
  adminToken: string,
  baseUrl?: string,
  timeoutMs?: number,
})
```

### Methods

- `getConfig()` -> `GET /v1/admin/config`
- `listKeys()` -> `GET /v1/admin/keys`
- `createKey({ client_id, note })` -> `POST /v1/admin/keys`
- `disableKey({ key_fingerprint })` -> `POST /v1/admin/keys/disable`
- `enableKey({ key_fingerprint })` -> `POST /v1/admin/keys/enable`

## Error Handling

All non-2xx API responses throw `ApiError`:

```js
import { ApiError } from 'removebgvideo-node';

try {
  await client.getJob('invalid-id');
} catch (err) {
  if (err instanceof ApiError) {
    console.error('status:', err.statusCode);
    console.error('code:', err.code);
    console.error('requestId:', err.requestId);
    console.error('message:', err.message);
  } else {
    console.error(err);
  }
}
```

## Retry Strategy (Recommended)

Retry only transient failures:

- Retry: HTTP `429`, `500`, `502`, `503`, `504`
- Do not retry without mutation: validation/auth errors (`400`, `401`, `403`, `404`)

```js
async function withRetry(fn, max = 3) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      const retryable = err?.statusCode && [429, 500, 502, 503, 504].includes(err.statusCode);
      if (!retryable || attempt > max) throw err;
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
}
```

## Usage & Billing Integration

```js
const summary = await client.usageSummary({ days: 7 });
const events = await client.usageEvents({ limit: 50 });

console.log(summary);
console.log(events);
```

Typical pattern:

1. Call `usageSummary` for dashboard metrics.
2. Call `usageEvents` for detailed event feed and reconciliation.

## TypeScript Notes

This package ships `src/index.d.ts`. If you use TS, you get typed constructors and method signatures out of the box.

## Examples Included

- [`examples/basic.js`](./examples/basic.js): basic create + wait
- [`examples/upload-then-process.js`](./examples/upload-then-process.js): upload local file then process
- [`examples/admin.js`](./examples/admin.js): admin key operations

## Environment Variables

- `REMOVEBGVIDEO_API_KEY`
- `REMOVEBGVIDEO_ADMIN_TOKEN` (admin only)

## Changelog and Releases

- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Release process: [RELEASING.md](./RELEASING.md)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
