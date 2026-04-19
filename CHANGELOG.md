# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0 - 2026-04-19

### Added
- Initial Node.js SDK for RemoveBGVideo Public API (`/v1`).
- Public client methods:
  - `upload`
  - `createJob`
  - `startJob`
  - `getJob`
  - `listJobs`
  - `usageSummary`
  - `usageEvents`
  - `waitForCompletion`
- Admin client methods:
  - `getConfig`
  - `listKeys`
  - `createKey`
  - `disableKey`
  - `enableKey`
- TypeScript declarations (`index.d.ts`).
- Basic examples and test.
- CI workflow for Node 18 and 20.
