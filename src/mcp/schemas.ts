import { z } from 'zod';

export const chainIdSchema = z
  .enum(['AELF', 'tDVV', 'tDVW'])
  .optional()
  .describe('Chain id. Use AELF for network governance/BP/resource, tDVV/tDVW for DAO operations.');

export const modeSchema = z
  .enum(['simulate', 'send'])
  .default('simulate')
  .describe('Execution mode. simulate: dry-run without broadcast; send: broadcast transaction.');

export const skipCountSchema = z.number().int().min(0).optional().describe('Pagination offset, default 0.');
export const maxResultCountSchema = z.number().int().min(1).max(200).optional().describe('Pagination size, default 20.');

export const addressSchema = z.string().min(1).describe('AElf address string.');

export function contractArgsSchema(example: string): z.ZodTypeAny {
  return z
    .record(z.any())
    .describe(`Contract method args JSON object. Example: ${example}`);
}

export const daoFileSchema = z.object({
  cid: z.string().min(1).describe('IPFS/OSS content id.'),
  name: z.string().min(1).describe('Display name of file.'),
  url: z.string().min(1).describe('Public download URL.'),
});

export const networkProposalTypeSchema = z
  .enum(['Parliament', 'Association', 'Referendum'])
  .describe('Network governance proposal contract type.');

export const networkProposalActionSchema = z
  .enum(['Approve', 'Reject', 'Abstain', 'Release'])
  .describe('Proposal action: Approve/Reject/Abstain/Release.');

export const daoVoteArgsSchema = z
  .object({
    proposalId: z.string().min(1).describe('DAO proposal id to vote on.'),
    voteOption: z.number().int().describe('Vote option enum value from DAO vote contract.'),
    voteAmount: z.number().nonnegative().describe('Vote amount in minimal token unit.'),
  })
  .passthrough()
  .describe('DAO Vote contract args.');

export const daoWithdrawArgsSchema = z
  .object({
    proposalId: z.string().min(1).describe('DAO proposal id to withdraw vote from.'),
    voteRecordId: z.string().min(1).describe('Vote record id returned by vote query.'),
  })
  .passthrough()
  .describe('DAO Withdraw contract args.');

export const bpVoteArgsSchema = z
  .object({
    candidatePubkey: z.string().min(1).describe('BP candidate public key.'),
    amount: z.number().positive().describe('Voting amount in minimal ELF unit.'),
  })
  .passthrough()
  .describe('BP Vote contract args.');

export const bpChangeVoteArgsSchema = z
  .object({
    voteId: z.string().min(1).describe('Existing vote id to update.'),
    candidatePubkey: z.string().min(1).describe('New candidate public key.'),
  })
  .passthrough()
  .describe('BP ChangeVotingOption contract args.');

export const bpWithdrawArgsSchema = z
  .object({
    voteId: z.string().min(1).describe('Vote id to withdraw.'),
  })
  .passthrough()
  .describe('BP Withdraw contract args.');
