import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { clearTokenCache } from '../../src/core/auth.js';
import { resetConfigCache } from '../../src/core/config.js';
import {
  daoCreate,
  daoExecute,
  daoProposalCreate,
  daoProposalMyInfo,
  daoRemoveFiles,
  daoTokenAllowanceView,
  daoUpdateMetadata,
  daoUploadFiles,
  daoVote,
  daoWithdraw,
  discussionComment,
  discussionList,
} from '../../src/domains/dao.js';
import { restoreTestEnv, resetTestEnv } from '../helpers/env.js';
import { installFetchMock, jsonResponse } from '../helpers/mock-fetch.js';

describe('dao domain', () => {
  let restoreFetch: (() => void) | undefined;

  beforeEach(() => {
    resetTestEnv({
      TMRW_PRIVATE_KEY: '1'.repeat(64),
      TMRW_API_BASE: 'https://api.tmrwdao.com',
      TMRW_AUTH_BASE: 'https://api.tmrwdao.com',
      TMRW_CHAIN_DEFAULT_DAO: 'tDVV',
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

  test('supports simulate chain operations', async () => {
    const create = await daoCreate({
      chainId: 'tDVV',
      args: { metadata: { name: 'DAO A' } },
      mode: 'simulate',
    });
    const update = await daoUpdateMetadata({
      chainId: 'tDVV',
      daoId: 'dao-1',
      metadata: { intro: 'updated' },
      mode: 'simulate',
    });
    const upload = await daoUploadFiles({
      chainId: 'tDVV',
      daoId: 'dao-1',
      files: [{ cid: 'cid-1', name: 'doc', url: 'https://x.test/doc' }],
      mode: 'simulate',
    });
    const remove = await daoRemoveFiles({
      chainId: 'tDVV',
      daoId: 'dao-1',
      fileCids: ['cid-1'],
      mode: 'simulate',
    });
    const proposal = await daoProposalCreate({
      chainId: 'tDVV',
      methodName: 'CreateProposal',
      args: { proposalBasicInfo: { proposalTitle: 'P1' } },
      mode: 'simulate',
    });
    const vote = await daoVote({
      chainId: 'tDVV',
      args: { proposalId: 'p-1', voteOption: 1, voteAmount: 0 },
      mode: 'simulate',
    });
    const withdraw = await daoWithdraw({
      chainId: 'tDVV',
      args: { proposalId: 'p-1', voteRecordId: 'vr-1' },
      mode: 'simulate',
    });
    const execute = await daoExecute({
      chainId: 'tDVV',
      proposalId: 'p-1',
      mode: 'simulate',
    });

    expect(create.success).toBeTrue();
    expect((create.data as any).methodName).toBe('CreateDAO');
    expect(update.success).toBeTrue();
    expect(upload.success).toBeTrue();
    expect(remove.success).toBeTrue();
    expect(proposal.success).toBeTrue();
    expect(vote.success).toBeTrue();
    expect(withdraw.success).toBeTrue();
    expect(execute.success).toBeTrue();
  });

  test('supports discussion and my-info APIs', async () => {
    const mocked = installFetchMock((url) => {
      if (url.endsWith('/connect/token')) {
        return jsonResponse({
          access_token: 'dao-token',
          token_type: 'Bearer',
          expires_in: 120,
        });
      }
      if (url.includes('/discussion/comment-list')) {
        return jsonResponse({ code: '20000', data: { items: [{ id: 'c-1' }] } });
      }
      if (url.includes('/discussion/new-comment')) {
        return jsonResponse({ code: '20000', data: { id: 'new-comment' } });
      }
      if (url.includes('/proposal/my-info')) {
        return jsonResponse({ code: '20000', data: { voteAmount: '1000' } });
      }
      return jsonResponse({ code: '20000', data: {} });
    });
    restoreFetch = mocked.restore;

    const list = await discussionList({ chainId: 'tDVV', proposalId: 'p-1', maxResultCount: 5 });
    const comment = await discussionComment({ chainId: 'tDVV', proposalId: 'p-1', comment: 'hello' });
    const myInfo = await daoProposalMyInfo({
      chainId: 'tDVV',
      proposalId: 'p-1',
      address: 'address-1',
      daoId: 'dao-1',
    });

    expect(list.success).toBeTrue();
    expect(comment.success).toBeTrue();
    expect(myInfo.success).toBeTrue();
    expect(mocked.calls.filter((x) => x.url.endsWith('/connect/token')).length).toBe(1);
  });

  test('returns fail result when send mode has no private key', async () => {
    resetTestEnv({
      TMRW_PRIVATE_KEY: undefined,
      TMRW_CHAIN_DEFAULT_DAO: 'tDVV',
    });
    clearTokenCache();
    resetConfigCache();

    const result = await daoVote({
      chainId: 'tDVV',
      args: { proposalId: 'p-1', voteOption: 1, voteAmount: 0 },
      mode: 'send',
    });

    expect(result.success).toBeFalse();
    expect(result.error?.code).toBe('SEND_PRIVATE_KEY_REQUIRED');
  });

  test('returns fail result for token allowance on unsupported chain', async () => {
    const result = await daoTokenAllowanceView({
      chainId: 'UNKNOWN' as any,
      symbol: 'ELF',
      owner: 'owner',
      spender: 'spender',
    });

    expect(result.success).toBeFalse();
    expect(result.error?.code).toBe('UNSUPPORTED_CHAIN');
  });
});
