import { Card } from './ui.jsx'

export default function MetricBar({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.label}</span>
            {m.icon && <m.icon className={`h-4 w-4 ${m.tone || 'text-slate-500'}`} />}
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-100">{m.value}</p>
          {m.sub && <p className="mt-1 text-xs text-slate-500">{m.sub}</p>}
        </Card>
      ))}
    </div>
  )
}
