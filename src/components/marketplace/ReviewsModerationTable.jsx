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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Flagged
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Customer Feedback & Star Ratings Moderation (reviews)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {reviews.length} Reviews
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          Spam Defense · Verified Farmer Feedback Attestation
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Review ID</th>
              <th className="py-3.5 px-4 min-w-[200px]">Product</th>
              <th className="py-3.5 px-4 min-w-[160px]">Reviewer</th>
              <th className="py-3.5 px-3 min-w-[120px]">Rating</th>
              <th className="py-3.5 px-4 min-w-[280px]">Review Content</th>
              <th className="py-3.5 px-3 min-w-[120px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading reviews...</span>
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No customer reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-emerald-50/60 transition-colors">
                  {/* Review ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-950">
                    {rev.id}
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block text-xs truncate max-w-[190px]">
                      {rev.productName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-medium">
                      Ref: {rev.productId}
                    </span>
                  </td>

                  {/* Reviewer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{rev.userName}</div>
                    {rev.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300/80 shadow-2xs">
                        <ShieldCheck className="w-3 h-3 text-teal-700" /> Verified Buyer
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 block font-medium">
                      {rev.rating} / 5 Stars
                    </span>
                  </td>

                  {/* Review Comments */}
                  <td className="py-3.5 px-4">
                    <p className="text-slate-700 text-xs leading-relaxed max-w-sm">
                      "{rev.reviewText}"
                    </p>
                    {rev.moderationReason && (
                      <div className="text-[10px] text-rose-700 font-mono mt-1 font-semibold">
                        Flag: {rev.moderationReason}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(rev.moderationStatus)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {rev.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'approved')}
                          className="p-1.5 text-xs text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Approve Review"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {rev.moderationStatus !== 'flagged' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'flagged', 'Flagged for content verification')}
                          className="p-1.5 text-xs text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Flag Review"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {rev.moderationStatus !== 'rejected' && (
                        <button
                          onClick={() => onModerateReview(rev.id, 'rejected', 'Violates marketplace review guidelines')}
                          className="p-1.5 text-xs text-rose-800 hover:text-rose-950 bg-rose-100 hover:bg-rose-200 border border-rose-300/80 rounded-xl transition-all active:scale-95 shadow-2xs"
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
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {reviews.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
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
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
