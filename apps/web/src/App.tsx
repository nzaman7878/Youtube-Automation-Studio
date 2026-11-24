import React from 'react';
import { QuotaConstants } from '@yt-studio/shared';

export const App: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-slate-100">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          YT Automation Studio
        </h1>
        <p className="text-slate-400 text-lg">
          Production-grade YouTube automation platform powered by MERN, n8n, and LangGraph AI.
        </p>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-left text-sm space-y-2">
          <p className="font-semibold text-slate-300">System Parameters:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Standard Daily API Quota Limit: {QuotaConstants.DEFAULT_DAILY_QUOTA_LIMIT} units</li>
            <li>Circuit Breaker Safe Threshold: {QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT}%</li>
            <li>Video Upload Quota Cost: {QuotaConstants.COST_VIDEO_UPLOAD} units</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default App;
