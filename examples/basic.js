import { RemoveBGVideoClient } from '../src/index.js';

const client = new RemoveBGVideoClient({
  apiKey: process.env.REMOVEBGVIDEO_API_KEY,
});

const job = await client.createJob({
  video_url: 'https://cdn.example.com/input.mp4',
  model: 'original',
  bg_type: 'green',
  output_format: 'webm',
  auto_start: true,
});

const done = await client.waitForCompletion(job.id);
console.log('Output URL:', done.output_url);
