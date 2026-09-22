import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Award,
  Coins,
  Gift,
  Share2,
  Star,
  ShieldCheck,
  Flame,
  AlertTriangle,
  UserCheck
} from 'lucide-react'
import { StatusBadge, TierBadge, fmtINR, formatDate } from '../../pages/gamificationWidgets'

export default function GamificationDetailDrawer({
  entity,
  type = 'tiers', // 'tiers', 'ledger', 'rewards', 'referrals', 'ratings'
  isOpen,
  onClose,
  onAdjustCoins,
  onBanFraudUser,
  onRemoveRating
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !entity) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getIcon = () => {
    switch (type) {
      case 'tiers':
        return Award
      case 'ledger':
        return Coins
      case 'rewards':
        return Gift
      case 'referrals':
        return Share2
      case 'ratings':
        return Star
      default:
        return Award
    }
  }

  const Icon = getIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-start justify-between bg-emerald-50/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 mt-1 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-500">{entity.id || entity.userId}</span>
                <StatusBadge status={entity.status} />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {entity.userName || entity.title || entity.targetName || entity.referrerName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {entity.currentTierName || entity.category || entity.referralCode || entity.targetType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 border-b border-emerald-100/80 bg-emerald-50/20 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Document JSON
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {type === 'tiers' && (
                <>
                  <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Krishi Ratna Progression & Virtual Wallet
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Progression Tier</span>
                        <TierBadge tier={entity.tier} name={entity.currentTierName} />
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Current AgriCoins Balance</span>
                        <span className="font-mono text-emerald-800 font-bold text-sm">
                          {entity.currentCoinsBalance?.toLocaleString()} Coins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Experience Points (XP)</span>
                        <span className="font-mono text-slate-900 font-bold">{entity.xpPoints?.toLocaleString()} XP</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Daily Check-in Streak</span>
                        <span className="font-mono text-amber-700 font-bold">🔥 {entity.streakDays} Days</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Lifetime Earned</span>
                        <span className="font-mono text-slate-800">{entity.lifetimeEarned?.toLocaleString()} Coins</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Lifetime Redeemed</span>
                        <span className="font-mono text-slate-800">{entity.lifetimeSpent?.toLocaleString()} Coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-2 shadow-xs">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Unlocked Krishi Badges ({entity.unlockedBadges?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(entity.unlockedBadges || []).map((badge) => (
                        <span key={badge} className="px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] flex items-center gap-1 font-bold">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {type === 'rewards' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rewards Store Voucher Economics
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Voucher Code</span>
                      <span className="font-mono text-amber-700 font-bold">{entity.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Coin Redemption Price</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.coinPrice} Coins</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Face Value Discount</span>
                      <span className="font-mono text-slate-900 font-bold">{fmtINR(entity.faceValueDiscountINR)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Merchant Partner</span>
                      <span className="text-slate-900 font-medium">{entity.partnerMerchant}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Inventory Claimed</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.claimedCount} / {entity.totalStock}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Remaining Available</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.stockAvailable} units</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Description & Terms</span>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                      {entity.description}
                    </p>
                  </div>
                </div>
              )}

              {type === 'referrals' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Referral Attribution & Fraud Telemetry
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Referrer User</span>
                      <span className="text-slate-900 font-bold">{entity.referrerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Referee Contact (Masked)</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.refereePhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Referral Code</span>
                      <span className="font-mono text-amber-700 font-bold">{entity.referralCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Device Fingerprint</span>
                      <span className="font-mono text-slate-700">{entity.deviceFingerprint}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">IP Address</span>
                      <span className="font-mono text-slate-700">{entity.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Timestamp</span>
                      <span className="font-mono text-slate-700">{formatDate(entity.signupTimestamp)}</span>
                    </div>
                  </div>

                  {(entity.fraudSignals || []).length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1">
                      <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Flagged Fraud Triggers</span>
                      </span>
                      <ul className="list-disc list-inside text-rose-700 text-[11px] space-y-0.5 font-medium">
                        {entity.fraudSignals.map((sig, i) => (
                          <li key={i}>{sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {type === 'ratings' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Review & Moderation Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Target Entity</span>
                      <span className="text-slate-900 font-bold">{entity.targetName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Service Category</span>
                      <span className="uppercase font-mono text-slate-700 font-bold">{entity.targetType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Star Rating</span>
                      <span className="text-amber-500 font-bold font-mono">
                        {'★'.repeat(entity.rating)}{'☆'.repeat(5 - entity.rating)} ({entity.rating}/5)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Reviewer Farmer</span>
                      <span className="text-slate-900 font-semibold">{entity.farmerName}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Review Text</span>
                    <p className="text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-medium">
                      "{entity.reviewText}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-100/80 bg-emerald-50/40 flex items-center justify-end gap-2">
          {type === 'tiers' && (
            <button
              onClick={() => onAdjustCoins && onAdjustCoins(entity)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Adjust AgriCoins Balance
            </button>
          )}

          {type === 'referrals' && entity.status === 'flagged_fraud' && (
            <button
              onClick={() => onBanFraudUser && onBanFraudUser(entity.referrerId, entity.referrerName)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Ban Fraud Ring
            </button>
          )}

          {type === 'ratings' && entity.status !== 'removed' && (
            <button
              onClick={() => onRemoveRating && onRemoveRating(entity)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Remove Abusive Rating
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
