import fs from 'node:fs';
import { RemoveBGVideoClient } from '../src/index.js';

const client = new RemoveBGVideoClient({ apiKey: process.env.REMOVEBGVIDEO_API_KEY });

// 1) Upload local file
const file = new Blob([fs.readFileSync('./input.mp4')], { type: 'video/mp4' });
const upload = await client.upload(file, 'input.mp4');

// 2) Create job
const job = await client.createJob({
  video_url: upload.video_url,
  model: 'pro',
  text_prompt: 'person wearing red jacket',
  bg_type: 'transparent',
  output_format: 'webm',
  auto_start: true,
});

// 3) Wait for completion
const done = await client.waitForCompletion(job.id);
console.log('Output URL:', done.output_url);
