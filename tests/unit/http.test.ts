import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { clearTokenCache } from '../../src/core/auth.js';
import { resetConfigCache } from '../../src/core/config.js';
import { apiGet, apiPost } from '../../src/core/http.js';
import { restoreTestEnv, resetTestEnv } from '../helpers/env.js';
import { installFetchMock, jsonResponse, textResponse } from '../helpers/mock-fetch.js';

describe('http client', () => {
  let restoreFetch: (() => void) | undefined;

  beforeEach(() => {
    resetTestEnv({
      TMRW_API_BASE: 'https://api.tmrwdao.com',
      TMRW_AUTH_BASE: 'https://api.tmrwdao.com',
      TMRW_PRIVATE_KEY: undefined,
    });
    clearTokenCache();
    resetConfigCache();
  });

  afterEach(() => {
    if (restoreFetch) restoreFetch();
    clearTokenCache();
    resetConfigCache();
    restoreTestEnv();
  });

  test('apiGet builds query and returns data', async () => {
    const mocked = installFetchMock((url) => {
      expect(url).toBe('https://api.tmrwdao.com/api/app/demo/list?skipCount=1&maxResultCount=2');
      return jsonResponse({ code: '20000', data: { ok: true } });
    });
    restoreFetch = mocked.restore;

    const data = await apiGet<{ ok: boolean }>('/demo/list', {
      skipCount: 1,
      maxResultCount: 2,
      ignored: undefined,
    });

    expect(data.ok).toBeTrue();
  });

  test('apiGet supports absolute url', async () => {
    const mocked = installFetchMock((url) => {
      expect(url).toBe('https://example.com/custom?a=1');
      return jsonResponse({ data: { ok: 1 } });
    });
    restoreFetch = mocked.restore;

    const data = await apiGet<{ ok: number }>('https://example.com/custom', { a: 1 });
    expect(data.ok).toBe(1);
  });

  test('apiGet injects Authorization header when auth=true', async () => {
    resetTestEnv({
      TMRW_API_BASE: 'https://api.tmrwdao.com',
      TMRW_AUTH_BASE: 'https://api.tmrwdao.com',
      TMRW_PRIVATE_KEY: '1'.repeat(64),
    });
    resetConfigCache();

    const mocked = installFetchMock((url, init) => {
      if (url.endsWith('/connect/token')) {
        return jsonResponse({
          access_token: 'auth-token',
          token_type: 'Bearer',
          expires_in: 120,
        });
      }

      const headers = (init?.headers || {}) as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer auth-token');
      return jsonResponse({ code: '20000', data: { ok: true } });
    });
    restoreFetch = mocked.restore;

    const data = await apiGet<{ ok: boolean }>('/protected', undefined, { auth: true });
    expect(data.ok).toBeTrue();
  });

  test('apiPost sends JSON payload', async () => {
    const mocked = installFetchMock((url, init) => {
      expect(url).toBe('https://api.tmrwdao.com/api/app/demo/create');
      expect(init?.method).toBe('POST');
      expect(init?.body).toBe(JSON.stringify({ name: 'hello' }));
      return jsonResponse({ code: '20000', data: { id: 'x-1' } });
    });
    restoreFetch = mocked.restore;

    const data = await apiPost<{ name: string }, { id: string }>('/demo/create', { name: 'hello' });
    expect(data.id).toBe('x-1');
  });

  test('apiGet throws API_HTTP_ERROR on non-2xx', async () => {
    const mocked = installFetchMock(() => textResponse('down', 503));
    restoreFetch = mocked.restore;

    await expect(apiGet('/demo/fail')).rejects.toMatchObject({
      code: 'API_HTTP_ERROR',
    });
  });

  test('apiPost throws API_BUSINESS_ERROR on code!=20000', async () => {
    const mocked = installFetchMock(() =>
      jsonResponse({
        code: '30000',
        message: 'business failed',
      }),
    );
    restoreFetch = mocked.restore;

    await expect(apiPost('/demo/fail', { x: 1 })).rejects.toMatchObject({
      code: 'API_BUSINESS_ERROR',
    });
  });
});
