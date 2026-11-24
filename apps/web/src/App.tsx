import React from 'react';
import { QuotaConstants } from '@yt-studio/shared';
import {
  Activity,
  Cpu,
  Database,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
  Youtube,
} from 'lucide-react';

export const App: React.FC = () => {
  const currentQuotaUsed = 1600; // Simulated upload usage
  const quotaLimit = QuotaConstants.DEFAULT_DAILY_QUOTA_LIMIT;
  const circuitBreakerThreshold = (quotaLimit * QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT) / 100;
  const quotaPercent = Math.round((currentQuotaUsed / quotaLimit) * 100);

  return (
    <div className="min-h-screen bg-studio-base text-studio-text-primary antialiased selection:bg-studio-accent-red selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-studio-border-subtle bg-studio-surface-glass backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-studio-accent-red to-[#B30006] flex items-center justify-center shadow-glow-red">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">YT Automation Studio</span>
              <span className="ml-2 text-xs font-mono uppercase px-2 py-0.5 rounded bg-studio-surface-2 text-studio-accent-cyan border border-studio-border-subtle">
                v1.0 Pro
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-studio-surface-1 border border-studio-border-subtle text-xs">
              <span className="w-2 h-2 rounded-full bg-studio-accent-emerald animate-pulse-subtle"></span>
              <span className="text-studio-text-secondary">Channel:</span>
              <span className="font-semibold text-studio-text-primary">Aura Media Tech</span>
            </div>

            <button className="px-4 py-2 rounded-lg bg-studio-accent-red hover:bg-studio-accent-red-hover text-white text-sm font-semibold tracking-wide transition-all shadow-glow-red hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2">
              <Play className="w-4 h-4 fill-white" />
              <span>New Pipeline</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Center Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <section className="glass-panel-elevated rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-studio-accent-red/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-studio-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-studio-accent-red/10 border border-studio-accent-red/30 text-studio-accent-red text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Obsidian Architecture Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
              AI YouTube Operations Command Center
            </h1>
            <p className="text-studio-text-secondary text-sm sm:text-base leading-relaxed">
              MERN stack engine paired with self-hosted n8n workflows and LangGraph multi-agent teams.
              Engineered with strict YouTube API quota safety, AES-256-GCM token encryption, and human-in-the-loop engagement.
            </p>
          </div>
        </section>

        {/* Telemetry & System Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* YouTube API Quota Budget Meter */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-studio-text-secondary text-xs uppercase tracking-wider font-semibold">
                <Activity className="w-4 h-4 text-studio-accent-amber" />
                <span>YouTube API Daily Quota</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-studio-surface-2 text-studio-text-muted">
                PST Reset 00:00
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold font-mono tabular-nums text-studio-text-primary">
                  {currentQuotaUsed.toLocaleString()}
                  <span className="text-sm font-normal text-studio-text-muted font-sans ml-1">
                    / {quotaLimit.toLocaleString()} units
                  </span>
                </span>
                <span className="text-xs font-semibold text-studio-accent-amber font-mono">
                  {quotaPercent}% Used
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 rounded-full bg-studio-surface-2 overflow-hidden border border-studio-border-subtle relative">
                <div
                  className="h-full bg-gradient-to-r from-studio-accent-emerald via-studio-accent-amber to-studio-accent-red transition-all duration-500 rounded-full"
                  style={{ width: `${quotaPercent}%` }}
                ></div>
                {/* Circuit Breaker Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 opacity-75"
                  style={{ left: `${QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT}%` }}
                  title="Circuit Breaker Threshold (85%)"
                ></div>
              </div>

              <div className="flex justify-between text-xs text-studio-text-muted">
                <span>Safe Buffer</span>
                <span>Circuit Breaker: {circuitBreakerThreshold.toLocaleString()} units (85%)</span>
              </div>
            </div>
          </div>

          {/* LangGraph Multi-Agent Telemetry */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-studio-text-secondary text-xs uppercase tracking-wider font-semibold">
                <Cpu className="w-4 h-4 text-studio-accent-cyan" />
                <span>AI Agent Pipeline</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-studio-accent-cyan animate-pulse"></span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-studio-border-subtle">
                <span className="text-studio-text-secondary">Active Agents:</span>
                <span className="font-semibold text-studio-text-primary">7 Autonomous Nodes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-studio-border-subtle">
                <span className="text-studio-text-secondary">Default LLM Provider:</span>
                <span className="font-semibold text-studio-text-primary font-mono">Gemini 2.0 Flash</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-studio-text-secondary">Audit Trail:</span>
                <span className="text-studio-accent-emerald font-semibold">100% Captured</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-studio-text-secondary text-xs uppercase tracking-wider font-semibold">
                <Database className="w-4 h-4 text-studio-accent-emerald" />
                <span>Infrastructure Cluster</span>
              </div>
              <span className="text-xs font-semibold text-studio-accent-emerald">Operational</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-studio-surface-1 border border-studio-border-subtle space-y-1">
                <div className="flex items-center space-x-1.5 text-studio-text-secondary">
                  <Database className="w-3 h-3 text-studio-accent-emerald" />
                  <span>MongoDB</span>
                </div>
                <p className="font-mono text-[11px] text-studio-text-primary font-semibold">ReplicaSet rs0</p>
              </div>

              <div className="p-2.5 rounded-lg bg-studio-surface-1 border border-studio-border-subtle space-y-1">
                <div className="flex items-center space-x-1.5 text-studio-text-secondary">
                  <Layers className="w-3 h-3 text-studio-accent-amber" />
                  <span>Redis Queue</span>
                </div>
                <p className="font-mono text-[11px] text-studio-text-primary font-semibold">BullMQ noevict</p>
              </div>

              <div className="p-2.5 rounded-lg bg-studio-surface-1 border border-studio-border-subtle space-y-1">
                <div className="flex items-center space-x-1.5 text-studio-text-secondary">
                  <Workflow className="w-3 h-3 text-studio-accent-purple" />
                  <span>n8n Engine</span>
                </div>
                <p className="font-mono text-[11px] text-studio-text-primary font-semibold">Port 5678</p>
              </div>

              <div className="p-2.5 rounded-lg bg-studio-surface-1 border border-studio-border-subtle space-y-1">
                <div className="flex items-center space-x-1.5 text-studio-text-secondary">
                  <ShieldCheck className="w-3 h-3 text-studio-accent-cyan" />
                  <span>OAuth Vault</span>
                </div>
                <p className="font-mono text-[11px] text-studio-text-primary font-semibold">AES-256-GCM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
