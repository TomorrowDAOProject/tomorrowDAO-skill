import { CONTRACTS, getConfig, getTokenContractAddress } from '../core/config.js';
import { fail, ok, requireField, SkillError } from '../core/errors.js';
import { callSend, callView } from '../core/chain-client.js';
import { apiGet, apiPost } from '../core/http.js';
import type { ChainId, ExecutionMode, JsonObject, PagedResponse, ToolResult } from '../core/types.js';

export interface DaoCreateInput {
  chainId?: ChainId;
  args: Record<string, unknown>;
  mode?: ExecutionMode;
}

export interface DaoUpdateMetadataInput {
  chainId?: ChainId;
  daoId: string;
  metadata: Record<string, unknown>;
  mode?: ExecutionMode;
}

export interface DaoUploadFilesInput {
  chainId?: ChainId;
  daoId: string;
  files: Array<{ cid: string; name: string; url: string }>;
  mode?: ExecutionMode;
}

export interface DaoRemoveFilesInput {
  chainId?: ChainId;
  daoId: string;
  fileCids: string[];
  mode?: ExecutionMode;
}

export interface DaoProposalCreateInput {
  chainId?: ChainId;
  methodName: 'CreateTransferProposal' | 'CreateProposal' | 'CreateVetoProposal';
  args: Record<string, unknown>;
  mode?: ExecutionMode;
}

export interface DaoVoteInput {
  chainId?: ChainId;
  args: Record<string, unknown>;
  mode?: ExecutionMode;
}

export interface DaoExecuteInput {
  chainId?: ChainId;
  proposalId: string;
  mode?: ExecutionMode;
}

export interface DiscussionListInput {
  chainId?: ChainId;
  proposalId?: string;
  alias?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface DiscussionCommentInput {
  chainId?: ChainId;
  comment: string;
  proposalId?: string;
  alias?: string;
  parentId?: string;
}

function daoChain(chainId?: ChainId): ChainId {
  return chainId || getConfig().defaultDaoChain;
}

export async function daoCreate(input: DaoCreateInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.args, 'args');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.daoAddress,
        methodName: 'CreateDAO',
        args: input.args,
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoUpdateMetadata(input: DaoUpdateMetadataInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.daoId, 'daoId');
    requireField(input.metadata, 'metadata');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.daoAddress,
        methodName: 'UpdateMetadata',
        args: {
          daoId: input.daoId,
          metadata: input.metadata,
        },
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoUploadFiles(input: DaoUploadFilesInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.daoId, 'daoId');
    if (!Array.isArray(input.files) || input.files.length === 0) {
      throw new SkillError('INVALID_INPUT', 'files must be a non-empty array');
    }
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.daoAddress,
        methodName: 'UploadFileInfos',
        args: {
          daoId: input.daoId,
          files: input.files,
        },
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoRemoveFiles(input: DaoRemoveFilesInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.daoId, 'daoId');
    if (!Array.isArray(input.fileCids) || input.fileCids.length === 0) {
      throw new SkillError('INVALID_INPUT', 'fileCids must be a non-empty array');
    }
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.daoAddress,
        methodName: 'RemoveFileInfos',
        args: {
          daoId: input.daoId,
          fileCids: input.fileCids,
        },
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoProposalCreate(input: DaoProposalCreateInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.methodName, 'methodName');
    requireField(input.args, 'args');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.proposalAddress,
        methodName: input.methodName,
        args: input.args,
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoVote(input: DaoVoteInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.args, 'args');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.voteAddress,
        methodName: 'Vote',
        args: input.args,
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoWithdraw(input: DaoVoteInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.args, 'args');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.voteAddress,
        methodName: 'Withdraw',
        args: input.args,
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function daoExecute(input: DaoExecuteInput): Promise<ToolResult<unknown>> {
  try {
    requireField(input.proposalId, 'proposalId');
    const chainId = daoChain(input.chainId);
    const result = await callSend(
      {
        chainId,
        contractAddress: CONTRACTS.dao.proposalAddress,
        methodName: 'ExecuteProposal',
        args: input.proposalId,
      },
      { mode: input.mode || 'simulate' },
    );
    return ok(result.result, { tx: result.tx });
  } catch (err) {
    return fail(err);
  }
}

export async function discussionList(input: DiscussionListInput): Promise<ToolResult<PagedResponse>> {
  try {
    const data = await apiGet<PagedResponse>('/discussion/comment-list', {
      chainId: input.chainId || daoChain(),
      proposalId: input.proposalId,
      alias: input.alias,
      skipCount: input.skipCount || 0,
      maxResultCount: input.maxResultCount || 20,
    });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function discussionComment(input: DiscussionCommentInput): Promise<ToolResult<JsonObject>> {
  try {
    requireField(input.comment, 'comment');
    const data = await apiPost<Record<string, unknown>, JsonObject>('/discussion/new-comment', {
      chainId: input.chainId || daoChain(),
      proposalId: input.proposalId,
      alias: input.alias,
      comment: input.comment,
      parentId: input.parentId,
    }, { auth: true });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function daoProposalMyInfo(params: {
  chainId?: ChainId;
  proposalId: string;
  address: string;
  daoId: string;
}): Promise<ToolResult<JsonObject>> {
  try {
    requireField(params.proposalId, 'proposalId');
    requireField(params.address, 'address');
    requireField(params.daoId, 'daoId');
    const data = await apiGet<JsonObject>('/proposal/my-info', {
      chainId: params.chainId || daoChain(),
      proposalId: params.proposalId,
      address: params.address,
      daoId: params.daoId,
    }, { auth: true });
    return ok(data);
  } catch (err) {
    return fail(err);
  }
}

export async function daoTokenAllowanceView(params: {
  chainId?: ChainId;
  symbol: string;
  owner: string;
  spender: string;
}): Promise<ToolResult<JsonObject>> {
  try {
    requireField(params.symbol, 'symbol');
    requireField(params.owner, 'owner');
    requireField(params.spender, 'spender');
    const chainId = daoChain(params.chainId);
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
