/**
 * Agent Turn Handler Proxy / Module
 * Exposes handleAgentTurn and executeAgentTurn for autonomous conversational interactions.
 */

export {
  handleAgentTurn,
  type AgentTurnRequest,
  type AgentTurnResponse,
} from '../tools/agentTurnHandler.js';

import { handleAgentTurn, AgentTurnRequest, AgentTurnResponse } from '../tools/agentTurnHandler.js';

export const executeAgentTurn = (request: AgentTurnRequest): Promise<AgentTurnResponse> => {
  return handleAgentTurn(request);
};
