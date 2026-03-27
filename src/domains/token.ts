import { getConfig, getTokenContractAddress } from '../core/config.js';
import { fail, ok, requireField } from '../core/errors.js';
import { callView } from '../core/chain-client.js';
import type { ChainId, JsonObject, ToolResult } from '../core/types.js';

export interface TokenAllowanceViewInput {
  chainId?: ChainId;
  symbol: string;
  owner: string;
  spender: string;
}

export interface TokenBalanceViewInput {
  chainId?: ChainId;
  symbol: string;
  owner: string;
}

function tokenChain(chainId?: ChainId): ChainId {
  return chainId || getConfig().defaultDaoChain;
}

export async function tokenAllowanceView(
  params: TokenAllowanceViewInput,
): Promise<ToolResult<JsonObject>> {
  try {
    requireField(params.symbol, 'symbol');
    requireField(params.owner, 'owner');
    requireField(params.spender, 'spender');
    const chainId = tokenChain(params.chainId);
    const data = await callView({
      chainId,
      contractAddress: getTokenContractAddress(chainId),
      methodName: 'GetAllowance',
      args: {
        symbol: params.symbol,
        owner: params.owner,
        spender: params.spender,
      },
    });
    return ok((data || {}) as JsonObject);
  } catch (err) {
    return fail(err);
  }
}

export async function tokenBalanceView(
  params: TokenBalanceViewInput,
): Promise<ToolResult<JsonObject>> {
  try {
    requireField(params.symbol, 'symbol');
    requireField(params.owner, 'owner');
    const chainId = tokenChain(params.chainId);
    const data = await callView({
      chainId,
      contractAddress: getTokenContractAddress(chainId),
      methodName: 'GetBalance',
      args: {
        symbol: params.symbol,
        owner: params.owner,
      },
    });
    return ok((data || {}) as JsonObject);
  } catch (err) {
    return fail(err);
  }
}
