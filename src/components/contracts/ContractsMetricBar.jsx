import React from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Lock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';

export function ContractsMetricBar({ kpis = {}, loading = false }) {
  const cards = [
    {
      label: 'Active Price-Lock Contracts',
      value: kpis.activeContractsCount ?? 0,
      sub: `${kpis.totalContracts ?? 0} total institutional drafts`,
      icon: FileText,
      tone: 'emerald'
    },
    {
      label: 'Total Escrow Capital',
      value: fmtRupees(kpis.totalEscrowLocked ?? 0),
      sub: `${fmtRupees(kpis.totalEscrowReleased ?? 0)} released to farmers`,
      icon: Lock,
      tone: 'teal'
    },
    {
      label: 'Pending Review Queue',
      value: kpis.pendingReviewCount ?? 0,
      sub: 'Pre-publish approval checks',
      icon: ShieldCheck,
      tone: 'amber'
    },
    {
      label: 'Disputed / In Arbitration',
      value: kpis.disputedCount ?? 0,
      sub: 'Quality & delivery default cases',
      icon: AlertTriangle,
      tone: 'rose'
    },
    {
      label: 'Verified Corporate Buyers',
      value: kpis.verifiedBuyersCount ?? 0,
      sub: 'ITC, Reliance, Adani, Cargill',
      icon: Building2,
      tone: 'sky'
    },
    {
      label: 'Signed Farmer Agreements',
      value: kpis.totalSignedAcceptances ?? 0,
      sub: 'MPIN cryptographically sealed',
      icon: Users,
      tone: 'emerald'
    }
  ];

  const toneStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    sky: 'bg-sky-50 text-sky-800 border-sky-200'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-lg border shrink-0 ${toneStyles[c.tone]}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {loading ? '—' : c.value}
              </div>
              <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                {c.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
