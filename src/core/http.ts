import { getConfig } from './config.js';
import { getAccessToken } from './auth.js';
import { SkillError } from './errors.js';
import type { ApiResponse } from './types.js';

function joinUrl(base: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

function encodeQuery(params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.set(k, String(v));
  });
  const query = q.toString();
  return query ? `?${query}` : '';
}

export async function apiGet<T>(
  path: string,
  query?: Record<string, unknown>,
  options?: { auth?: boolean },
): Promise<T> {
  const config = getConfig();
  const headers: Record<string, string> = {};
  if (options?.auth) {
    const token = await getAccessToken();
    headers.Authorization = `${token.tokenType} ${token.accessToken}`;
  }
  const url = joinUrl(`${config.apiBase}/api/app`, path) + encodeQuery(query);

  const resp = await fetch(url, { method: 'GET', headers });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new SkillError('API_HTTP_ERROR', `${resp.status} ${path}`, text);
  }

  const json = (await resp.json()) as ApiResponse<T>;
  if (json?.code && json.code !== '20000') {
    throw new SkillError('API_BUSINESS_ERROR', json?.message || `api error ${json.code}`, json);
  }

  return (json?.data ?? (json as unknown as T));
}

export async function apiPost<TReq extends object, TRes>(
  path: string,
  payload: TReq,
  options?: { auth?: boolean },
): Promise<TRes> {
  const config = getConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.auth) {
    const token = await getAccessToken();
    headers.Authorization = `${token.tokenType} ${token.accessToken}`;
  }

  const url = joinUrl(`${config.apiBase}/api/app`, path);
  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new SkillError('API_HTTP_ERROR', `${resp.status} ${path}`, text);
  }

  const json = (await resp.json()) as ApiResponse<TRes>;
  if (json?.code && json.code !== '20000') {
    throw new SkillError('API_BUSINESS_ERROR', json?.message || `api error ${json.code}`, json);
  }

  return (json?.data ?? (json as unknown as TRes));
}
