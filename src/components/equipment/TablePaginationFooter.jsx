import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TablePaginationFooter({ records, label, pagination, onPageChange }) {
  return (
    <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div className="font-mono text-[11px]">
        Showing {records.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} {label}
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
                  ? 'bg-emerald-600 text-white font-bold'
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
  );
}
