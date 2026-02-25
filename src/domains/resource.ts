import { CONTRACTS, getConfig } from '../core/config.js';
import { callSend } from '../core/chain-client.js';
import { fail, ok } from '../core/errors.js';
import { apiGet } from '../core/http.js';
import type { ChainId, ExecutionMode, ToolResult } from '../core/types.js';

function resourceChain(chainId?: ChainId): ChainId {
  return chainId || getConfig().defaultNetworkChain;
}

function ensureAelf(chainId: ChainId): ChainId {
  if (chainId !== 'AELF') throw new Error(`resource domain only supports AELF, got ${chainId}`);
  return chainId;
}

export async function resourceBuy(input: {
  chainId?: ChainId;
  symbol: string;
  amount: number;
  mode?: ExecutionMode;
}): Promise<ToolResult<unknown>> {
  try {
    const chainId = ensureAelf(resourceChain(input.chainId));
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.network.AELF.tokenConverter,
        methodName: 'Buy',
        args: {
          symbol: input.symbol,
          amount: input.amount,
        },
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function resourceSell(input: {
  chainId?: ChainId;
  symbol: string;
  amount: number;
  mode?: ExecutionMode;
}): Promise<ToolResult<unknown>> {
  try {
    const chainId = ensureAelf(resourceChain(input.chainId));
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.network.AELF.tokenConverter,
        methodName: 'Sell',
        args: {
          symbol: input.symbol,
          amount: input.amount,
        },
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function resourceRealtimeRecords(input: {
  chainId?: ChainId;
  maxResultCount?: number;
  skipCount?: number;
}): Promise<ToolResult<unknown>> {
  try {
    const data = await apiGet('/resource/realtime-records', {
      chainId: resourceChain(input.chainId),
      skipCount: input.skipCount || 0,
      maxResultCount: input.maxResultCount || 20,
    });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function resourceTurnover(input: {
  chainId?: ChainId;
  symbol?: string;
}): Promise<ToolResult<unknown>> {
  try {
    const data = await apiGet('/resource/turnover', {
      chainId: resourceChain(input.chainId),
      symbol: input.symbol,
    });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function resourceRecords(input: {
  chainId?: ChainId;
  maxResultCount?: number;
  skipCount?: number;
  symbol?: string;
}): Promise<ToolResult<unknown>> {
  try {
    const data = await apiGet('/resource/records', {
      chainId: resourceChain(input.chainId),
      skipCount: input.skipCount || 0,
      maxResultCount: input.maxResultCount || 20,
      symbol: input.symbol,
    });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}
