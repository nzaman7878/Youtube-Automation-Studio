export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const REGISTERED_MCP_TOOLS: readonly string[] = [
  'list_videos',
  'get_channel_analytics',
  'draft_video_script',
  'update_video_metadata',
  'schedule_publish',
] as const;
