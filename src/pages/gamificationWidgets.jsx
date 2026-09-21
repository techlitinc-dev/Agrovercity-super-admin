import React from 'react'
import {
  Award,
  Coins,
  Gift,
  Share2,
  Star,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Ban,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sliders,
  CheckCircle2,
  Clock
} from 'lucide-react'

export function fmtINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}

export function formatDate(isoStr) {
  if (!isoStr) return '—'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoStr
  }
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    suspended_fraud: { label: 'Suspended (Fraud)', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    paused: { label: 'Paused / Sold Out', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
    expired: { label: 'Expired', bg: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/30' },

    rewarded: { label: 'Rewarded (+100)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    flagged_fraud: { label: 'Fraud Syndicate Flag', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse' },
    pending: { label: 'Verification Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },

    approved: { label: 'Approved', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    flagged: { label: 'Flagged Abusive', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40' },
    removed: { label: 'Pruned / Removed', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-800 text-slate-400 border-slate-700' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function TierBadge({ tier, name }) {
  const tierColors = {
    1: 'bg-slate-800 text-slate-300 border-slate-700',
    2: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    3: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    4: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    5: 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
  }
  const color = tierColors[tier] || tierColors[1]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${color}`}>
      <Award className="w-3 h-3" />
      <span>{name || `Tier ${tier}`}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function GamificationMetricBar({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="AgriCoins in Circulation"
        value={(summary.totalCirculatingCoins || 0).toLocaleString()}
        subtitle="Platform Virtual Currency Float"
        icon={Coins}
        badge="Active Float"
        color="emerald"
      />
      <MetricCard
        title="Daily Mint / Burn"
        value={`+${(summary.dailyMintCoins || 0).toLocaleString()} / -${(summary.dailyBurnCoins || 0).toLocaleString()}`}
        subtitle="Healthy Net Float Expansion"
        icon={Flame}
        badge="Economy Balanced"
        color="blue"
      />
      <MetricCard
        title="Rewards Store Vouchers"
        value={`${summary.activeCouponsCount || 0} Active SKUs`}
        subtitle={`${summary.couponsRedeemedMonth || 0} claimed this month`}
        icon={Gift}
        badge="Co-Funded Partner Stores"
        color="purple"
      />
      <MetricCard
        title="Fraud & Abusive Alerts"
        value={summary.flaggedReferralFraudAlerts || 0}
        subtitle={`${summary.flaggedAbusiveRatings || 0} ratings flagged for moderation`}
        icon={AlertTriangle}
        badge="Action Required"
        color="rose"
      />
    </div>
  )
}

export function GamificationTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'tiers', label: 'Krishi Ratna Progression', icon: Award, count: counts.tiers },
    { id: 'ledger', label: 'AgriCoins Ledger', icon: Coins, count: counts.ledger },
    { id: 'rewards', label: 'Rewards Store', icon: Gift, count: counts.rewards },
    { id: 'referrals', label: 'Referrals & Fraud', icon: Share2, count: counts.referrals },
    { id: 'ratings', label: 'Service Ratings', icon: Star, count: counts.ratings },
    { id: 'audit', label: 'Audit Trails', icon: ShieldCheck, count: counts.audit }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function GamificationFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  extraFilter,
  onExtraFilterChange,
  activeTab,
  onRefresh,
  onExportCsv,
  onCreateNew
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {activeTab === 'tiers' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Tiers (1-5)</option>
            <option value="5">Tier 5: Krishi Ratna</option>
            <option value="4">Tier 4: Krishi Shiromani</option>
            <option value="3">Tier 3: Krishi Veera</option>
            <option value="2">Tier 2: Krishi Sevak</option>
            <option value="1">Tier 1: Krishi Mitra</option>
          </select>
        )}

        {activeTab === 'ledger' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Transactions</option>
            <option value="CREDIT">Credits (+ Mint)</option>
            <option value="DEBIT">Debits (- Burn)</option>
          </select>
        )}

        {activeTab === 'ratings' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Target Entities</option>
            <option value="transporter">Transporters</option>
            <option value="equipment">Equipment Owners</option>
            <option value="vyapari">Mandi Vyaparis</option>
            <option value="agronomist">Agronomists</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>

        {activeTab === 'rewards' && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Voucher</span>
          </button>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// TABLES
// -------------------------------------------------------------
export function GamificationTiersTable({ data, onView, onAdjustCoins }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No Krishi Ratna users found matching criteria.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Farmer User & District</th>
              <th className="py-3 px-3">Krishi Ratna Tier</th>
              <th className="py-3 px-3">XP Points</th>
              <th className="py-3 px-3">Current Coins Balance</th>
              <th className="py-3 px-3">Streak & Badges</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(item)}>
                    {item.userName}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">{item.userPhone} ({item.district})</div>
                  <div className="font-mono text-[10px] text-slate-500">{item.userId}</div>
                </td>
                <td className="py-3 px-3">
                  <TierBadge tier={item.tier} name={item.currentTierName} />
                </td>
                <td className="py-3 px-3 font-mono text-slate-200">
                  {item.xpPoints?.toLocaleString()} XP
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-emerald-400 font-bold">
                    {item.currentCoinsBalance?.toLocaleString()} Coins
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Lifetime: {item.lifetimeEarned?.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold">
                      🔥 {item.streakDays}d Streak
                    </span>
                    <span className="text-slate-400 text-[11px]">{item.unlockedBadges?.length || 0} badges</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onAdjustCoins(item)}
                      className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded text-[11px]"
                    >
                      Adjust Coins
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AgriCoinsLedgerTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No AgriCoins transactions recorded.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Tx ID & Timestamp</th>
              <th className="py-3 px-3">Farmer User</th>
              <th className="py-3 px-3">Source Activity</th>
              <th className="py-3 px-3 text-right">Coin Amount</th>
              <th className="py-3 px-3 text-right">Balance After</th>
              <th className="py-3 px-4">Reference & Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-slate-200">{formatDate(tx.timestamp)}</div>
                  <div className="font-mono text-[10px] text-slate-500">{tx.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-200">{tx.userName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{tx.userId}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tx.sourceActivity}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  {tx.type === 'CREDIT' ? (
                    <span className="text-emerald-400">+{tx.amount}</span>
                  ) : (
                    <span className="text-rose-400">{tx.amount}</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300 font-semibold">
                  {tx.balanceAfter?.toLocaleString()}
                </td>
                <td className="py-3 px-4 max-w-xs text-slate-400 text-[11px] leading-relaxed">
                  <div className="font-mono text-slate-500 text-[10px]">{tx.referenceId}</div>
                  <div>{tx.notes}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function RewardCouponsTable({ data, onView, onEdit, onToggleStatus }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Voucher Title & Code</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Coin Price & Value</th>
              <th className="py-3 px-3">Inventory Claimed</th>
              <th className="py-3 px-3">Partner Merchant</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(c)}>
                    {c.title}
                  </div>
                  <div className="font-mono text-[11px] text-amber-400 mt-0.5">{c.code}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                    {c.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-emerald-400 font-bold">{c.coinPrice} Coins</div>
                  <div className="font-mono text-slate-400 text-[10px]">Discount: {fmtINR(c.faceValueDiscountINR)}</div>
                </td>
                <td className="py-3 px-3 min-w-[120px]">
                  <div className="font-mono text-slate-200">
                    {c.claimedCount} / {c.totalStock} claimed
                  </div>
                  <div className="text-[10px] text-emerald-400">{c.stockAvailable} available</div>
                </td>
                <td className="py-3 px-3 text-slate-300">{c.partnerMerchant}</td>
                <td className="py-3 px-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(c)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(c)}
                      className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded text-[11px]"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ReferralsTable({ data, onView, onBanFraudUser }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Referrer Farmer</th>
              <th className="py-3 px-3">Referee Contact (Masked)</th>
              <th className="py-3 px-3">Referral Code & Coins</th>
              <th className="py-3 px-3">Device & IP Fingerprint</th>
              <th className="py-3 px-3">Fraud Signals & Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-100">{r.referrerName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{r.referrerId}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200">{r.refereeName}</div>
                  <div className="font-mono text-[10px] text-slate-400">{r.refereePhone}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-amber-400 font-semibold">{r.referralCode}</div>
                  <div className="font-mono text-[10px] text-emerald-400">+{r.coinsAwarded} Coins</div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                  <div>{r.deviceFingerprint}</div>
                  <div className="text-[10px] text-slate-500">IP: {r.ipAddress}</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={r.status} />
                  {(r.fraudSignals || []).length > 0 && (
                    <div className="text-[10px] text-rose-400 mt-1 font-medium">
                      ⚠️ {r.fraudSignals[0]}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(r)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                    >
                      View
                    </button>
                    {r.status === 'flagged_fraud' && (
                      <button
                        onClick={() => onBanFraudUser(r.referrerId, r.referrerName)}
                        className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded text-[11px]"
                      >
                        Ban Ring
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function RatingsTable({ data, onView, onRemoveRating }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Target Provider / Entity</th>
              <th className="py-3 px-3">Star Rating</th>
              <th className="py-3 px-3">Farmer Review & Sentiment</th>
              <th className="py-3 px-3">Reviewer Contact</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((rat) => (
              <tr key={rat.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-100">{rat.targetName}</div>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                    {rat.targetType}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center text-amber-400 font-bold font-mono">
                    {'★'.repeat(rat.rating)}{'☆'.repeat(5 - rat.rating)}
                    <span className="ml-1 text-slate-300 text-xs">({rat.rating}/5)</span>
                  </div>
                </td>
                <td className="py-3 px-3 max-w-sm">
                  <p className={`text-[11px] line-clamp-2 ${rat.status === 'removed' ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {rat.reviewText}
                  </p>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">Booking: {rat.bookingId}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200">{rat.farmerName}</div>
                  <div className="font-mono text-[10px] text-slate-400">{rat.farmerPhone}</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={rat.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(rat)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                    >
                      View
                    </button>
                    {rat.status !== 'removed' && (
                      <button
                        onClick={() => onRemoveRating(rat)}
                        className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/20 rounded text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function GamificationAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No audit log records found for Gamification & Economy.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Audit ID & Timestamp</th>
              <th className="py-3 px-3">Admin Operator</th>
              <th className="py-3 px-3">Action Type</th>
              <th className="py-3 px-3">Target Entity</th>
              <th className="py-3 px-3">State Transition</th>
              <th className="py-3 px-4">Reason & Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-slate-200">{formatDate(log.timestamp)}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200 font-medium">{log.adminName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.ipAddress}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {log.actionType}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-300 font-medium">{log.entityName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.entityId} ({log.collection})</div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="text-slate-400 line-through text-[10px]">{log.previousState}</div>
                  <div className="text-emerald-400 font-semibold">{log.newState}</div>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                  {log.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ContentPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mt-4 px-1">
      <div>
        Showing <span className="font-mono text-slate-200">{total === 0 ? 0 : start}</span> -{' '}
        <span className="font-mono text-slate-200">{end}</span> of{' '}
        <span className="font-mono text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>
        <span className="font-mono text-slate-300 px-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
