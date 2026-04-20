export class ApiError extends Error {
  constructor(message, { statusCode, code, requestId } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.requestId = requestId;
  }
}

export class RemoveBGVideoClient {
  constructor({ apiKey, baseUrl = 'https://api.removebgvideo.com', timeoutMs = 30000 } = {}) {
    if (!apiKey) {
      throw new Error('apiKey is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  async #request(path, { method = 'GET', headers = {}, body } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const resp = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body,
        signal: controller.signal,
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const error = data?.error || {};
        throw new ApiError(
          error.message || `Request failed with status ${resp.status}`,
          {
            statusCode: resp.status,
            code: error.code,
            requestId: error.request_id,
          }
        );
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  #jsonHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
    };
  }

  async upload(fileOrBlob, filename = 'video.mp4') {
    const form = new FormData();
    form.append('file', fileOrBlob, filename);
    return this.#request('/v1/uploads', {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
      },
      body: form,
    });
  }

  async createJob({
    video_url,
    model = 'original',
    bg_type = 'green',
    output_format = 'webm',
    text_prompt,
    webhook_url,
    bg_color,
    auto_start = true,
    metadata,
  }) {
    const payload = {
      video_url,
      model,
      bg_type,
      output_format,
      auto_start,
    };
    if (text_prompt) payload.text_prompt = text_prompt;
    if (webhook_url) payload.webhook_url = webhook_url;
    if (bg_color) payload.bg_color = bg_color;
    if (metadata) payload.metadata = metadata;

    return this.#request('/v1/jobs', {
      method: 'POST',
      headers: this.#jsonHeaders(),
      body: JSON.stringify(payload),
    });
  }

  async startJob(jobId, overrides = {}) {
    return this.#request(`/v1/jobs/${jobId}/start`, {
      method: 'POST',
      headers: this.#jsonHeaders(),
      body: JSON.stringify(overrides || {}),
    });
  }

  async getJob(jobId) {
    return this.#request(`/v1/jobs/${jobId}`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  }

  async listJobs({ limit = 20, offset = 0, status } = {}) {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (status) params.set('status', status);
    return this.#request(`/v1/jobs?${params.toString()}`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  }

  async usageSummary({ days = 7 } = {}) {
    return this.#request(`/v1/usage/summary?days=${encodeURIComponent(days)}`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  }

  async usageEvents({ limit = 20 } = {}) {
    return this.#request(`/v1/usage/events?limit=${encodeURIComponent(limit)}`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  }

  async waitForCompletion(jobId, { intervalMs = 2000, timeoutMs = 600000 } = {}) {
    const startedAt = Date.now();

    while (true) {
      const job = await this.getJob(jobId);
      if (job.status === 'completed') return job;
      if (job.status === 'failed') {
        throw new ApiError(job.error || 'Job failed');
      }

      if (Date.now() - startedAt > timeoutMs) {
        throw new Error(`Job ${jobId} did not complete within ${timeoutMs}ms`);
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}

export class RemoveBGVideoAdminClient {
  constructor({ adminToken, baseUrl = 'https://api.removebgvideo.com', timeoutMs = 30000 } = {}) {
    if (!adminToken) {
      throw new Error('adminToken is required');
    }
    this.adminToken = adminToken;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  async #request(path, { method = 'GET', body } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const resp = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'X-Admin-Token': this.adminToken,
          'Content-Type': 'application/json',
        },
        body,
        signal: controller.signal,
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const error = data?.error || {};
        throw new ApiError(
          error.message || `Request failed with status ${resp.status}`,
          {
            statusCode: resp.status,
            code: error.code,
            requestId: error.request_id,
          }
        );
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  getConfig() {
    return this.#request('/v1/admin/config');
  }

  listKeys() {
    return this.#request('/v1/admin/keys');
  }

  createKey({ client_id, note } = {}) {
    return this.#request('/v1/admin/keys', {
      method: 'POST',
      body: JSON.stringify({ client_id, note }),
    });
  }

  disableKey({ key_fingerprint } = {}) {
    return this.#request('/v1/admin/keys/disable', {
      method: 'POST',
      body: JSON.stringify({ key_fingerprint }),
    });
  }

  enableKey({ key_fingerprint } = {}) {
    return this.#request('/v1/admin/keys/enable', {
      method: 'POST',
      body: JSON.stringify({ key_fingerprint }),
    });
  }
}
