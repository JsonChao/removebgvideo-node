# removebgvideo-node

Official Node.js SDK for RemoveBGVideo Public API (`/v1`), aligned with our website API.

## Installation

```bash
npm install removebgvideo-node
```

## Quick Start

```js
import { RemoveBGVideoClient } from 'removebgvideo-node';

const client = new RemoveBGVideoClient({
  apiKey: process.env.REMOVEBGVIDEO_API_KEY,
});

const job = await client.createJob({
  video_url: 'https://cdn.example.com/input.mp4',
  model: 'pro',
  text_prompt: 'person wearing red jacket',
  bg_type: 'transparent',
  output_format: 'webm',
  auto_start: true,
});

const result = await client.waitForCompletion(job.id);
console.log(result.output_url);
```

## More Examples

- `examples/basic.js` - create and wait for a job
- `examples/upload-then-process.js` - upload local file then process
- `examples/admin.js` - admin key operations

## Public API (`RemoveBGVideoClient`)

- `upload(fileOrBlob, filename?)`
- `createJob(options)`
- `startJob(jobId)`
- `getJob(jobId)`
- `listJobs({ limit, offset, status })`
- `usageSummary({ days })`
- `usageEvents({ limit })`
- `waitForCompletion(jobId, { intervalMs, timeoutMs })`

## Admin API (`RemoveBGVideoAdminClient`)

```js
import { RemoveBGVideoAdminClient } from 'removebgvideo-node';

const admin = new RemoveBGVideoAdminClient({
  adminToken: process.env.REMOVEBGVIDEO_ADMIN_TOKEN,
});

console.log(await admin.getConfig());
```

- `getConfig()`
- `listKeys()`
- `createKey({ client_id, note })`
- `disableKey({ key_fingerprint })`
- `enableKey({ key_fingerprint })`

## Environment

- `REMOVEBGVIDEO_API_KEY`
- `REMOVEBGVIDEO_ADMIN_TOKEN` (if using admin client)

## License

MIT

## Release

See [RELEASING.md](./RELEASING.md) for npm release steps.
