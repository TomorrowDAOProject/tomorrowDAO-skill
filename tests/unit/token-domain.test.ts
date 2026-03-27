import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { clearTokenCache } from '../../src/core/auth.js';
import { resetConfigCache } from '../../src/core/config.js';
import {
  daoTokenAllowanceView,
  daoTokenBalanceView,
} from '../../src/domains/dao.js';
import {
  tokenAllowanceView,
  tokenBalanceView,
} from '../../src/domains/token.js';
import { restoreTestEnv, resetTestEnv } from '../helpers/env.js';

describe('token domain', () => {
  beforeEach(() => {
    resetTestEnv({
      TMRW_PRIVATE_KEY: '1'.repeat(64),
      TMRW_CHAIN_DEFAULT_DAO: 'tDVV',
    });
    clearTokenCache();
    resetConfigCache();
  });

  afterEach(() => {
    clearTokenCache();
    resetConfigCache();
    restoreTestEnv();
  });

  test('returns fail result for generic token allowance on unsupported chain', async () => {
    const result = await tokenAllowanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
      spender: 'spender',
    });

    expect(result.success).toBeFalse();
    expect(result.error?.code).toBe('UNSUPPORTED_CHAIN');
  });

  test('returns fail result for generic token balance on unsupported chain', async () => {
    const result = await tokenBalanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
    });

    expect(result.success).toBeFalse();
    expect(result.error?.code).toBe('UNSUPPORTED_CHAIN');
  });

  test('dao token aliases keep generic token helper behavior', async () => {
    const genericBalance = await tokenBalanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
    });
    const daoBalance = await daoTokenBalanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
    });
    const genericAllowance = await tokenAllowanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
      spender: 'spender',
    });
    const daoAllowance = await daoTokenAllowanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
      spender: 'spender',
    });

    expect(daoBalance).toEqual(genericBalance);
    expect(daoAllowance).toEqual(genericAllowance);
  });
});
