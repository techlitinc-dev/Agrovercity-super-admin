import React from 'react'

export default function MetricBar({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/25 p-4 shadow-[0_8px_30px_rgb(16,185,129,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_12px_36px_rgb(16,185,129,0.12)] group"
        >
          {/* Agricultural Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900/80">{m.label}</span>
            {m.icon && (
              <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-300/60 text-emerald-800 shadow-2xs group-hover:scale-110 transition-transform">
                <m.icon className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-emerald-950 tracking-tight">{m.value}</p>
          {m.sub && <p className="mt-1 text-xs text-emerald-800/80 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {m.sub}
          </p>}
        </div>
      ))}
    </div>
  )
}
