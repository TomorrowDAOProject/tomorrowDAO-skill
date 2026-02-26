import { describe, expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..', '..');
const MCP_SERVER_PATH = path.join(ROOT, 'src', 'mcp', 'server.ts');
const MCP_SCHEMA_PATH = path.join(ROOT, 'src', 'mcp', 'schemas.ts');

describe('mcp schema quality', () => {
  test('high-frequency vote tools use explicit schema objects', () => {
    const source = fs.readFileSync(MCP_SERVER_PATH, 'utf-8');
    expect(source.includes('args: daoVoteArgsSchema')).toBeTrue();
    expect(source.includes('args: daoWithdrawArgsSchema')).toBeTrue();
    expect(source.includes('args: bpVoteArgsSchema')).toBeTrue();
    expect(source.includes('args: bpChangeVoteArgsSchema')).toBeTrue();
    expect(source.includes('args: bpWithdrawArgsSchema')).toBeTrue();
    expect(source.includes('proposalType: networkProposalTypeSchema')).toBeTrue();
    expect(source.includes('action: networkProposalActionSchema')).toBeTrue();
  });

  test('explicit schemas expose key fields for AI parameter construction', () => {
    const schemaSource = fs.readFileSync(MCP_SCHEMA_PATH, 'utf-8');
    expect(schemaSource.includes('export const daoVoteArgsSchema')).toBeTrue();
    expect(schemaSource.includes('proposalId: z.string().min(1)')).toBeTrue();
    expect(schemaSource.includes('voteOption: z.number().int()')).toBeTrue();
    expect(schemaSource.includes('voteAmount: z.number().nonnegative()')).toBeTrue();
    expect(schemaSource.includes('export const bpVoteArgsSchema')).toBeTrue();
    expect(schemaSource.includes('candidatePubkey: z.string().min(1)')).toBeTrue();
    expect(schemaSource.includes('amount: z.number().positive()')).toBeTrue();
  });
});
