import React from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Flag
} from 'lucide-react';

export function ReviewsModerationTable({
  reviews = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onModerateReview,
  loading = false
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Approved
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Flagged
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700">
            <XCircle className="w-3 h-3 text-rose-400" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Customer Feedback & Star Ratings Moderation (reviews)</span>
          <span className="text-xs bg-amber-950 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded font-mono">
            {reviews.length} Reviews
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Spam Defense · Verified Farmer Feedback Attestation
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Review ID</th>
              <th className="py-3 px-4 min-w-[200px]">Product</th>
              <th className="py-3 px-4 min-w-[160px]">Reviewer</th>
              <th className="py-3 px-3 min-w-[120px]">Rating</th>
              <th className="py-3 px-4 min-w-[280px]">Review Content</th>
              <th className="py-3 px-3 min-w-[120px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading reviews...</span>
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No customer reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-800/50 transition-colors">
                  {/* Review ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    {rev.id}
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block text-xs truncate max-w-[190px]">
                      {rev.productName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Ref: {rev.productId}
                    </span>
                  </td>

                  {/* Reviewer */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200">{rev.userName}</div>
                    {rev.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800/60">
                        <ShieldCheck className="w-3 h-3" /> Verified Buyer
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                      {rev.rating} / 5 Stars
                    </span>
                  </td>

                  {/* Review Comments */}
                  <td className="py-3 px-4">
                    <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                      "{rev.reviewText}"
                    </p>
                    {rev.moderationReason && (
                      <div className="text-[10px] text-rose-400 font-mono mt-1">
                        Flag: {rev.moderationReason}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(rev.moderationStatus)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {rev.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'approved')}
                          className="p-1 text-xs text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-600/40 rounded-md transition-colors"
                          title="Approve Review"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {rev.moderationStatus !== 'flagged' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'flagged', 'Flagged for content verification')}
                          className="p-1 text-xs text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 border border-amber-600/40 rounded-md transition-colors"
                          title="Flag Review"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {rev.moderationStatus !== 'rejected' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'rejected', 'Violates marketplace review guidelines')}
                          className="p-1 text-xs text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40 rounded-md transition-colors"
                          title="Reject / Hide Review"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {reviews.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
