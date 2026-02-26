import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { getConfig, resetConfigCache } from '../../src/core/config.js';

const OLD_ENV = { ...process.env };

describe('config', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV };
    resetConfigCache();
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
    resetConfigCache();
  });

  test('loads defaults', () => {
    const cfg = getConfig();
    expect(cfg.apiBase).toBe('https://api.tmrwdao.com');
    expect(cfg.defaultDaoChain).toBe('tDVV');
    expect(cfg.defaultNetworkChain).toBe('AELF');
    expect(cfg.httpTimeoutMs).toBe(10000);
    expect(cfg.httpRetryMax).toBe(1);
    expect(cfg.httpRetryPost).toBeFalse();
  });

  test('loads env overrides', () => {
    process.env.TMRW_API_BASE = 'https://custom.tmrwdao.com/';
    process.env.TMRW_CHAIN_DEFAULT_DAO = 'AELF';
    process.env.TMRW_HTTP_TIMEOUT_MS = '5000';
    process.env.TMRW_HTTP_RETRY_POST = '1';
    resetConfigCache();
    const cfg = getConfig();
    expect(cfg.apiBase).toBe('https://custom.tmrwdao.com');
    expect(cfg.defaultDaoChain).toBe('AELF');
    expect(cfg.httpTimeoutMs).toBe(5000);
    expect(cfg.httpRetryPost).toBeTrue();
  });
});
