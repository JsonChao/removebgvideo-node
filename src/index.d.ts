export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  requestId?: string;
}

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface CreateJobOptions {
  video_url: string;
  model?: 'original' | 'light' | 'pro' | 'human';
  bg_type?: string;
  output_format?: string;
  text_prompt?: string;
  bg_color?: number[];
  auto_start?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ListJobsOptions {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface UsageSummaryOptions {
  days?: number;
}

export interface UsageEventsOptions {
  limit?: number;
}

export interface WaitOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

export class RemoveBGVideoClient {
  constructor(options: ClientOptions);
  upload(fileOrBlob: Blob | File, filename?: string): Promise<any>;
  createJob(options: CreateJobOptions): Promise<any>;
  startJob(jobId: string): Promise<any>;
  getJob(jobId: string): Promise<any>;
  listJobs(options?: ListJobsOptions): Promise<any>;
  usageSummary(options?: UsageSummaryOptions): Promise<any>;
  usageEvents(options?: UsageEventsOptions): Promise<any>;
  waitForCompletion(jobId: string, options?: WaitOptions): Promise<any>;
}

export interface AdminClientOptions {
  adminToken: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface CreateKeyOptions {
  client_id: string;
  note?: string;
}

export interface KeyFingerprintOptions {
  key_fingerprint: string;
}

export class RemoveBGVideoAdminClient {
  constructor(options: AdminClientOptions);
  getConfig(): Promise<any>;
  listKeys(): Promise<any>;
  createKey(options: CreateKeyOptions): Promise<any>;
  disableKey(options: KeyFingerprintOptions): Promise<any>;
  enableKey(options: KeyFingerprintOptions): Promise<any>;
}
