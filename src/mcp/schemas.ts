import { z } from 'zod';

export const chainIdSchema = z
  .enum(['AELF', 'tDVV'])
  .optional()
  .describe('Chain id. Use AELF for network governance/BP/resource, tDVV for most DAO operations.');

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
