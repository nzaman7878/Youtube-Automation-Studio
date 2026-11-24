import { VideoPipelineStatus } from '@yt-studio/shared';

export interface AgentRunMetadata {
  runId: string;
  agentName: string;
  prompt: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  durationMs: number;
  createdAt: Date;
}

export interface AgentContext {
  workspaceId: string;
  channelId: string;
  stage: VideoPipelineStatus;
}
