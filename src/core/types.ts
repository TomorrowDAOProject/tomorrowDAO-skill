export type ChainId = 'AELF' | 'tDVV';

export type ExecutionMode = 'simulate' | 'send';

export interface EnvConfig {
  apiBase: string;
  authBase: string;
  defaultDaoChain: ChainId;
  defaultNetworkChain: ChainId;
  authChainId: ChainId;
  source: string;
  caHash?: string;
  privateKey?: string;
  rpc: Record<ChainId, string>;
}

export interface TxReceipt {
  txId: string;
  status: string;
  logs?: unknown[];
  explorerUrl?: string;
}

export interface ToolError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: ToolError;
  traceId?: string;
  tx?: TxReceipt;
}

export interface SendOptions {
  mode?: ExecutionMode;
  waitForMined?: boolean;
  traceId?: string;
}

export interface ChainCallInput {
  chainId: ChainId;
  contractAddress: string;
  methodName: string;
  args?: unknown;
}

export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
}

export interface ApiResponse<T> {
  code: string;
  message?: string;
  data: T;
}

export interface SignaturePayload {
  timestamp: number;
  address: string;
  publicKey: string;
  signature: string;
}

export interface WithAuth {
  auth?: boolean;
}
