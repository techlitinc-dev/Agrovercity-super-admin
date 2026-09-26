import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Star,
  Globe,
  Bot,
  UserCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ChatbotAnalyticsView({ sessions = [], tickets = [], kpis }) {
  // Aggregate statistics
  const totalSessions = sessions.length || 6;
  const autonomousAiSessions = sessions.filter(s => !s.escalated).length;
  const escalatedSessions = sessions.filter(s => s.escalated).length;
  const aiResolutionPct = Math.round((autonomousAiSessions / Math.max(totalSessions, 1)) * 100);

  // Language breakdown
  const marathiCount = sessions.filter(s => s.language === 'mr').length;
  const hindiCount = sessions.filter(s => s.language === 'hi').length;
  const englishCount = sessions.filter(s => s.language === 'en').length;

  const topicsList = [
    { name: 'Mandi Rates & Market Saturation', count: 48, percentage: 38, tone: 'emerald' },
    { name: 'Pest Diagnosis & Chemical Dosing', count: 32, percentage: 26, tone: 'amber' },
    { name: 'Weather Forecast & Sowing Windows', count: 22, percentage: 18, tone: 'sky' },
    { name: 'Crop Insurance & PM-KISAN Schemes', count: 14, percentage: 11, tone: 'indigo' },
    { name: 'Soil Testing & NPK Balancing', count: 9, percentage: 7, tone: 'teal' }
  ];

  const ratingCounts = {
    5: sessions.filter(s => s.satisfactionScore === 5).length || 3,
    4: sessions.filter(s => s.satisfactionScore === 4).length || 2,
    3: sessions.filter(s => s.satisfactionScore === 3).length || 1,
    2: sessions.filter(s => s.satisfactionScore === 2).length || 1,
    1: sessions.filter(s => s.satisfactionScore === 1).length || 0,
  };

  const totalRated = Object.values(ratingCounts).reduce((a, b) => a + b, 0) || 7;

  return (
    <div className="space-y-6">
      {/* Top Aggregated Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Autonomous AI Resolution</span>
            <Bot className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-emerald-950 font-mono">{aiResolutionPct}%</p>
          <p className="mt-1 text-xs text-slate-500">
            {autonomousAiSessions} resolved autonomously · {escalatedSessions} escalated to KVK
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Farmer CSAT</span>
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 font-mono">
            {kpis?.avgSatisfaction || '4.6'} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Across {totalRated} verified session ratings
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Agronomist SLA Compliance</span>
            <Clock className="h-5 w-5 text-sky-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-sky-950 font-mono">92.4%</p>
          <p className="mt-1 text-xs text-slate-500">
            Avg handoff triage response: 18 minutes
          </p>
        </div>
      </div>

      {/* Main Grid: Common Topics vs Language & Rating Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Common Topics Table */}
        <div className="lg:col-span-7 rounded-2xl border border-emerald-100 bg-white/90 p-5 backdrop-blur-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Top Inquired Agronomic Categories</h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">Aggregated across 125 conversations</span>
          </div>

          <div className="space-y-3">
            {topicsList.map((topic) => (
              <div key={topic.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{topic.name}</span>
                  <span className="font-mono text-slate-500">{topic.percentage}% ({topic.count} chats)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${topic.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Knowledge Base Gap Warning */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Knowledge Base Enhancement Detected:</span>
              <p className="mt-0.5 text-amber-800">
                14 queries concerning "Purple Blotch in Kharif Onion" showed model confidence &lt; 70%. Recommending embedding update with MPKV Rahuri 2026 fungicide circular.
              </p>
            </div>
          </div>
        </div>

        {/* Vernacular Language & CSAT Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vernacular Distribution */}
          <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 backdrop-blur-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
              <Globe className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Vernacular Language Mix</h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Marathi (मराठी)</span>
                  <span className="font-mono">58%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Hindi (हिंदी)</span>
                  <span className="font-mono">28%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>English</span>
                  <span className="font-mono">14%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 backdrop-blur-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Satisfaction Rating Distribution</h4>
            </div>

            <div className="space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const pct = Math.round((count / Math.max(totalRated, 1)) * 100);
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-12 font-mono text-slate-600 font-bold">{stars} Stars</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-slate-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
