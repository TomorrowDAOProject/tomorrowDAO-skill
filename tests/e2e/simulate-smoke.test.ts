import { describe, expect, test } from 'bun:test';
import { bpApply } from '../../src/domains/bp.js';
import { daoCreate } from '../../src/domains/dao.js';
import { networkProposalCreate } from '../../src/domains/network.js';
import { resourceBuy } from '../../src/domains/resource.js';

describe('e2e simulate smoke', () => {
  test('dao create simulate', async () => {
    const res = await daoCreate({
      chainId: 'tDVV',
      args: { metadata: { name: 'simulate dao' } },
      mode: 'simulate',
    });

    expect(res.success).toBeTrue();
    expect((res.data as any).methodName).toBe('CreateDAO');
  });

  test('network proposal simulate', async () => {
    const res = await networkProposalCreate({
      chainId: 'AELF',
      proposalType: 'Parliament',
      args: {
        title: 'simulate',
        description: 'simulate',
        contractMethodName: 'Dummy',
        toAddress: '2JT8xzjR5zJ8xnBvdgBZdSjfbokFSbF5hDdpUCbXeWaJfPDmsK',
        params: '',
        expiredTime: { seconds: 0, nanos: 0 },
        organizationAddress: '2JT8xzjR5zJ8xnBvdgBZdSjfbokFSbF5hDdpUCbXeWaJfPDmsK',
      },
      mode: 'simulate',
    });

    expect(res.success).toBeTrue();
  });

  test('bp apply simulate', async () => {
    const res = await bpApply({
      chainId: 'AELF',
      args: { value: 1 },
      mode: 'simulate',
    });

    expect(res.success).toBeTrue();
  });

  test('resource buy simulate', async () => {
    const res = await resourceBuy({
      chainId: 'AELF',
      symbol: 'CPU',
      amount: 1,
      mode: 'simulate',
    });

    expect(res.success).toBeTrue();
  });
});
