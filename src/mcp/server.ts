#!/usr/bin/env bun
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as dao from '../domains/dao.js';
import * as network from '../domains/network.js';
import * as bp from '../domains/bp.js';
import * as resource from '../domains/resource.js';

const server = new McpServer({
  name: 'tomorrowdao-agent-skills',
  version: '0.1.0',
});

function format(result: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

server.registerTool(
  'tomorrowdao_dao_create',
  {
    description: 'Create DAO on chain',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoCreate(input)),
);

server.registerTool(
  'tomorrowdao_dao_update_metadata',
  {
    description: 'Update DAO metadata',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      daoId: z.string(),
      metadata: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoUpdateMetadata(input)),
);

server.registerTool(
  'tomorrowdao_dao_proposal_create',
  {
    description: 'Create DAO proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      methodName: z.enum(['CreateTransferProposal', 'CreateProposal', 'CreateVetoProposal']),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoProposalCreate(input)),
);

server.registerTool(
  'tomorrowdao_dao_vote',
  {
    description: 'Vote in DAO proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoVote(input)),
);

server.registerTool(
  'tomorrowdao_dao_withdraw',
  {
    description: 'Withdraw DAO vote',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoWithdraw(input)),
);

server.registerTool(
  'tomorrowdao_dao_execute',
  {
    description: 'Execute DAO proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalId: z.string(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await dao.daoExecute(input)),
);

server.registerTool(
  'tomorrowdao_discussion_list',
  {
    description: 'Get discussion comments list',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalId: z.string().optional(),
      alias: z.string().optional(),
      skipCount: z.number().optional(),
      maxResultCount: z.number().optional(),
    },
  },
  async (input) => format(await dao.discussionList(input)),
);

server.registerTool(
  'tomorrowdao_discussion_comment',
  {
    description: 'Create discussion comment (auth required)',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      comment: z.string(),
      proposalId: z.string().optional(),
      alias: z.string().optional(),
      parentId: z.string().optional(),
    },
  },
  async (input) => format(await dao.discussionComment(input)),
);

server.registerTool(
  'tomorrowdao_network_proposal_create',
  {
    description: 'Create network proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalType: z.enum(['Parliament', 'Association', 'Referendum']),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkProposalCreate(input)),
);

server.registerTool(
  'tomorrowdao_network_proposal_vote',
  {
    description: 'Vote/release network proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalType: z.enum(['Parliament', 'Association', 'Referendum']),
      proposalId: z.string(),
      action: z.enum(['Approve', 'Reject', 'Abstain', 'Release']),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkProposalVote(input)),
);

server.registerTool(
  'tomorrowdao_network_proposal_release',
  {
    description: 'Release network proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalType: z.enum(['Parliament', 'Association', 'Referendum']),
      proposalId: z.string(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkProposalRelease(input)),
);

server.registerTool(
  'tomorrowdao_network_org_create',
  {
    description: 'Create organization',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalType: z.enum(['Parliament', 'Association', 'Referendum']),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkOrganizationCreate(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_name_check',
  {
    description: 'Check network contract name availability',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      contractName: z.string(),
    },
  },
  async (input) => format(await network.networkContractNameCheck(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_name_add',
  {
    description: 'Add network contract name (auth required)',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      operateChainId: z.enum(['AELF', 'tDVV']),
      contractName: z.string(),
      txId: z.string(),
      action: z.number(),
      address: z.string(),
      proposalId: z.string().optional(),
      createAt: z.string().optional(),
    },
  },
  async (input) => format(await network.networkContractNameAdd(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_name_update',
  {
    description: 'Update network contract name (auth required)',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      operateChainId: z.enum(['AELF', 'tDVV']).optional(),
      contractName: z.string(),
      address: z.string(),
      contractAddress: z.string(),
      caHash: z.string().optional(),
    },
  },
  async (input) => format(await network.networkContractNameUpdate(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_flow_start',
  {
    description: 'Start network contract proposal flow',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      action: z.enum(['ProposeNewContract', 'ProposeUpdateContract', 'DeployUserSmartContract', 'UpdateUserSmartContract']),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkContractFlowStart(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_flow_release',
  {
    description: 'Release approved/code-checked contract proposal',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      methodName: z.enum(['ReleaseApprovedContract', 'ReleaseCodeCheckedContract']),
      proposalId: z.string(),
      proposedContractInputHash: z.string(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await network.networkContractFlowRelease(input)),
);

server.registerTool(
  'tomorrowdao_network_contract_flow_status',
  {
    description: 'Query contract proposal flow status',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      proposalId: z.string().optional(),
      codeHash: z.string().optional(),
    },
  },
  async (input) => format(await network.networkContractFlowStatus(input)),
);

server.registerTool(
  'tomorrowdao_bp_apply',
  {
    description: 'Apply to become BP candidate',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpApply(input)),
);

server.registerTool(
  'tomorrowdao_bp_quit',
  {
    description: 'Quit BP election',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpQuit(input)),
);

server.registerTool(
  'tomorrowdao_bp_vote',
  {
    description: 'Vote for BP candidate',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpVote(input)),
);

server.registerTool(
  'tomorrowdao_bp_withdraw',
  {
    description: 'Withdraw BP votes',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.any(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpWithdraw(input)),
);

server.registerTool(
  'tomorrowdao_bp_change_vote',
  {
    description: 'Change BP voting option',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpChangeVote(input)),
);

server.registerTool(
  'tomorrowdao_bp_claim_profits',
  {
    description: 'Claim BP profits',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      args: z.record(z.any()),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await bp.bpClaimProfits(input)),
);

server.registerTool(
  'tomorrowdao_bp_team_desc_add',
  {
    description: 'Add BP team description (auth required)',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      publicKey: z.string(),
      address: z.string(),
      name: z.string(),
      avatar: z.string().optional(),
      intro: z.string().optional(),
      txId: z.string().optional(),
      isActive: z.boolean().optional(),
      socials: z.array(z.string()).optional(),
      officialWebsite: z.string().optional(),
      location: z.string().optional(),
      mail: z.string().optional(),
      updateTime: z.string().optional(),
    },
  },
  async (input) => format(await bp.bpTeamDescAdd(input)),
);

server.registerTool(
  'tomorrowdao_bp_vote_reclaim',
  {
    description: 'Update BP vote reclaim status (auth required)',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      voteId: z.string(),
      proposalId: z.string().optional(),
    },
  },
  async (input) => format(await bp.bpVoteReclaim(input)),
);

server.registerTool(
  'tomorrowdao_resource_buy',
  {
    description: 'Buy resource token',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      symbol: z.string(),
      amount: z.number(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await resource.resourceBuy(input)),
);

server.registerTool(
  'tomorrowdao_resource_sell',
  {
    description: 'Sell resource token',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      symbol: z.string(),
      amount: z.number(),
      mode: z.enum(['simulate', 'send']).default('simulate'),
    },
  },
  async (input) => format(await resource.resourceSell(input)),
);

server.registerTool(
  'tomorrowdao_resource_realtime_records',
  {
    description: 'Get resource realtime records',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      skipCount: z.number().optional(),
      maxResultCount: z.number().optional(),
    },
  },
  async (input) => format(await resource.resourceRealtimeRecords(input)),
);

server.registerTool(
  'tomorrowdao_resource_turnover',
  {
    description: 'Get resource turnover',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      symbol: z.string().optional(),
    },
  },
  async (input) => format(await resource.resourceTurnover(input)),
);

server.registerTool(
  'tomorrowdao_resource_records',
  {
    description: 'Get resource trading records',
    inputSchema: {
      chainId: z.enum(['AELF', 'tDVV']).optional(),
      skipCount: z.number().optional(),
      maxResultCount: z.number().optional(),
      symbol: z.string().optional(),
    },
  },
  async (input) => format(await resource.resourceRecords(input)),
);

const transport = new StdioServerTransport();
await server.connect(transport);
