import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TablePaginationFooter({ records, label, pagination, onPageChange }) {
  return (
    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
      <div className="font-mono text-[11px]">
        Showing {records.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} {label}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
          disabled={pagination.page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
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
              className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-colors ${
                pageNum === pagination.page
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
          disabled={pagination.page >= pagination.totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
