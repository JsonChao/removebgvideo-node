import { RemoveBGVideoAdminClient } from '../src/index.js';

const admin = new RemoveBGVideoAdminClient({
  adminToken: process.env.REMOVEBGVIDEO_ADMIN_TOKEN,
});

const config = await admin.getConfig();
console.log(config);
