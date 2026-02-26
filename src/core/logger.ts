import { randomUUID } from 'node:crypto';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function activeLevel(): LogLevel {
  const raw = (process.env.TMRW_LOG_LEVEL || 'error').toLowerCase();
  if (raw === 'debug' || raw === 'info' || raw === 'warn' || raw === 'error') {
    return raw;
  }
  return 'error';
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_WEIGHT[level] <= LEVEL_WEIGHT[activeLevel()];
}

function sanitize(payload: Record<string, unknown>): Record<string, unknown> {
  const banned = ['privateKey', 'accessToken', 'authorization', 'token'];
  const out: Record<string, unknown> = {};
  Object.entries(payload).forEach(([k, v]) => {
    if (banned.some((x) => k.toLowerCase().includes(x.toLowerCase()))) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = v;
    }
  });
  return out;
}

export function log(level: LogLevel, event: string, payload: Record<string, unknown> = {}): void {
  if (!shouldLog(level)) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...sanitize(payload),
  };
  process.stderr.write(`${JSON.stringify(entry)}\n`);
}

export function logError(event: string, payload: Record<string, unknown> = {}): void {
  log('error', event, payload);
}

export function newTraceId(): string {
  return randomUUID();
}
