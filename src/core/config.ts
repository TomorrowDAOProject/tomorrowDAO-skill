import type { ChainId, EnvConfig } from './types.js';
import { SkillError } from './errors.js';

const DEFAULTS = {
  apiBase: 'https://api.tmrwdao.com',
  authBase: 'https://api.tmrwdao.com',
  daoChain: 'tDVV' as ChainId,
  networkChain: 'AELF' as ChainId,
  authChain: 'AELF' as ChainId,
  source: 'nightElf',
  rpcAELF: 'https://aelf-public-node.aelf.io',
  rpcTDVV: 'https://tdvv-public-node.aelf.io',
  httpTimeoutMs: 10_000,
  httpRetryMax: 1,
  httpRetryBaseMs: 200,
  httpRetryPost: false,
  aelfCacheMax: 8,
};

let cached: EnvConfig | null = null;

function mustChain(value: string, field: string): ChainId {
  if (value === 'AELF' || value === 'tDVV') {
    return value;
  }
  throw new SkillError('INVALID_CONFIG', `${field} must be one of AELF/tDVV`);
}

function trimSlash(url: string): string {
  return url.replace(/\/$/, '');
}

function readInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return value === '1' || value.toLowerCase() === 'true';
}

export function getConfig(): EnvConfig {
  if (cached) return cached;

  const apiBase = trimSlash(process.env.TMRW_API_BASE || DEFAULTS.apiBase);
  const authBase = trimSlash(process.env.TMRW_AUTH_BASE || DEFAULTS.authBase);

  const config: EnvConfig = {
    apiBase,
    authBase,
    defaultDaoChain: mustChain(process.env.TMRW_CHAIN_DEFAULT_DAO || DEFAULTS.daoChain, 'TMRW_CHAIN_DEFAULT_DAO'),
    defaultNetworkChain: mustChain(
      process.env.TMRW_CHAIN_DEFAULT_NETWORK || DEFAULTS.networkChain,
      'TMRW_CHAIN_DEFAULT_NETWORK',
    ),
    authChainId: mustChain(process.env.TMRW_AUTH_CHAIN_ID || DEFAULTS.authChain, 'TMRW_AUTH_CHAIN_ID'),
    source: process.env.TMRW_SOURCE || DEFAULTS.source,
    caHash: process.env.TMRW_CA_HASH,
    privateKey: process.env.TMRW_PRIVATE_KEY,
    httpTimeoutMs: readInt(process.env.TMRW_HTTP_TIMEOUT_MS, DEFAULTS.httpTimeoutMs),
    httpRetryMax: readInt(process.env.TMRW_HTTP_RETRY_MAX, DEFAULTS.httpRetryMax),
    httpRetryBaseMs: readInt(process.env.TMRW_HTTP_RETRY_BASE_MS, DEFAULTS.httpRetryBaseMs),
    httpRetryPost: readBool(process.env.TMRW_HTTP_RETRY_POST, DEFAULTS.httpRetryPost),
    aelfCacheMax: readInt(process.env.TMRW_AELF_CACHE_MAX, DEFAULTS.aelfCacheMax),
    rpc: {
      AELF: process.env.TMRW_RPC_AELF || DEFAULTS.rpcAELF,
      tDVV: process.env.TMRW_RPC_TDVV || DEFAULTS.rpcTDVV,
    },
  };

  cached = config;
  return config;
}

export function resetConfigCache(): void {
  cached = null;
}

export const CONTRACTS = {
  dao: {
    daoAddress: '2izSidAeMiZ6tmD7FKmnoWbygjFSmH5nko3cGJ9EtbfC44BycC',
    proposalAddress: '2tCM3oV6dTCmwFxSiFGPEVhGngdMwBV741wi156vj8kmqfp6da',
    voteAddress: '2A8h4hLynLt86RxqvpNY43x6Js8CYhgyuAzj7sDGQ2ecP77Zgp',
  },
  network: {
    AELF: {
      parliament: '2JT8xzjR5zJ8xnBvdgBZdSjfbokFSbF5hDdpUCbXeWaJfPDmsK',
      association: 'XyRN9VNabpBiVUFeX2t7ZUR2b3tWV7U31exufJ2AUepVb5t56',
      referendum: 'NxSBGHE3zs85tpnX1Ns4awQUtFL8Dnr6Hux4C4E18WZsW4zzJ',
      election: 'NrVf8B7XUduXn1oGHZeF1YANFXEXAhvCymz2WPyKZt4DE2zSg',
      tokenConverter: 'SietKh9cArYub9ox6E4rU94LrzPad6TB72rCwe3X1jQ5m1C34',
      profit: '2ZUgaDqWSh4aJ5s5Ker2tRczhJSNep4bVVfrRBRJTRQdMTbA5W',
      token: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      genesis: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
    },
    tDVV: {
      token: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
    },
  },
  explorer: {
    AELF: 'https://aelfscan.io/AELF',
    tDVV: 'https://aelfscan.io/tDVV',
  },
} as const;

export type ProposalContractType = 'Parliament' | 'Association' | 'Referendum';

export function getProposalContractAddress(chainId: ChainId, proposalType: ProposalContractType): string {
  const chainContracts = CONTRACTS.network.AELF;
  if (chainId !== 'AELF') {
    throw new SkillError('UNSUPPORTED_CHAIN', `network governance currently supports AELF only, got ${chainId}`);
  }
  if (proposalType === 'Parliament') return chainContracts.parliament;
  if (proposalType === 'Association') return chainContracts.association;
  return chainContracts.referendum;
}

export function getTokenContractAddress(chainId: ChainId): string {
  if (chainId === 'AELF') return CONTRACTS.network.AELF.token;
  if (chainId === 'tDVV') return CONTRACTS.network.tDVV.token;
  throw new SkillError('UNSUPPORTED_CHAIN', `token contract not configured for ${chainId}`);
}
