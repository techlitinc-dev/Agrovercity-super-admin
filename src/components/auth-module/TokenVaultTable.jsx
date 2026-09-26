import React, { useState, useEffect, useCallback } from 'react';
import {
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  RefreshCw,
  Copy,
  Check,
  Clock,
  Ban,
  AlertTriangle,
  User,
  Smartphone,
  Laptop,
  CheckCircle2,
  XCircle,
  FileKey
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function TokenVaultTable({ onOpenUserDrawer }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [revokingId, setRevokingId] = useState(null);
  const [copiedTokenId, setCopiedTokenId] = useState(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAuthService.listAllTokens({
        query: searchQuery,
        type: typeFilter,
        status: statusFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setTokens(res.data.tokens);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter, page, addToast]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 1500);
    addToast({
      title: 'Token Hash Copied',
      message: 'DPDP-masked token signature copied to clipboard.',
      type: 'info'
    });
  };

  const handleRevokeToken = async (tok) => {
    if (!hasPermission('canRevokeSessions')) {
      addToast({
        title: 'Permission Denied',
        message: 'Your role lacks permission to revoke authentication tokens.',
        type: 'error'
      });
      return;
    }

    const reason = window.prompt(
      `Enter administrative reason for revoking Token ${tok.id} (${tok.tokenType.toUpperCase()}) for User ${tok.userName}:`,
      'Manual security token invalidation via JWT Vault'
    );
    if (!reason) return;

    setRevokingId(tok.id);
    try {
      const res = await adminAuthService.revokeSingleToken({
        uid: tok.userId,
        tokenId: tok.id,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({
        title: 'Token Revoked',
        message: res.message,
        type: 'success'
      });
      fetchTokens();
    } catch (err) {
      addToast({ title: 'Revocation Failed', message: err.message, type: 'error' });
    } finally {
      setRevokingId(null);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'refresh':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <RefreshCw className="w-2.5 h-2.5" /> Refresh Token
          </span>
        );
      case 'access':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Key className="w-2.5 h-2.5" /> Access JWT
          </span>
        );
      case 'id_token':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-2.5 h-2.5" /> Firebase ID
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <FileKey className="w-2.5 h-2.5" /> {type}
          </span>
        );
    }
  };

  const getStatusBadge = (tok) => {
    if (tok.status === 'revoked') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-500" /> Revoked
        </span>
      );
    }
    const isExpired = new Date(tok.expiresAt) < new Date();
    if (tok.status === 'expired' || isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-400" /> Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Valid & Active
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              JWT & Token Vault (Collection: <span className="font-mono text-indigo-300 text-xs">auth_tokens</span>)
            </h3>
            <p className="text-xs text-slate-400">
              Cryptographic tokens issued per SOP-01 §2. Real-time revocation & DPDP Act compliance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-white/10 rounded-lg font-mono text-slate-300 border border-white/10">
            Total In Vault: <strong className="text-white">{pagination.total}</strong>
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 rounded-lg font-mono text-emerald-300 border border-emerald-500/30">
            Active: <strong className="text-white">{tokens.filter((t) => t.status === 'active').length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by token ID, user name, mobile, or hash..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Token Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="refresh">Refresh Token</option>
              <option value="access">Access Token</option>
              <option value="id_token">Firebase ID Token</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <button
            onClick={fetchTokens}
            title="Refresh Token Vault"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tokens Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Token ID & Type</th>
                <th className="py-3.5 px-4">User Account</th>
                <th className="py-3.5 px-4">DPDP Masked Signature</th>
                <th className="py-3.5 px-4">Device Bound</th>
                <th className="py-3.5 px-4">Validity Lifecycle</th>
                <th className="py-3.5 px-4">Client IP</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Key className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No tokens found in vault matching current search & filters.
                  </td>
                </tr>
              ) : (
                tokens.map((tok) => (
                  <tr key={tok.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Token ID & Type */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        {tok.id}
                      </div>
                      <div className="mt-1">{getTypeBadge(tok.tokenType)}</div>
                    </td>

                    {/* User Account */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(tok.userId)}
                        className={`font-bold text-slate-900 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        {tok.userName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{tok.userMobile}</div>
                    </td>

                    {/* Masked Signature */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg w-fit">
                        <span className="font-mono text-[10px] text-slate-700">
                          {tok.tokenHash || 'eyJhbGciOi...XXXX'}
                        </span>
                        <button
                          onClick={() => handleCopyHash(tok.tokenHash, tok.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Copy Masked Hash"
                        >
                          {copiedTokenId === tok.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">DPDP §4(1) Compliant</span>
                    </td>

                    {/* Bound Device */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 font-semibold">{tok.deviceId || 'DEV-101'}</div>
                      <div className="text-[10px] text-slate-400">Hardware Bound</div>
                    </td>

                    {/* Validity Lifecycle */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Issued: {new Date(tok.issuedAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Expires: {new Date(tok.expiresAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* IP */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-800">{tok.ipAddress || '14.139.122.9'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(tok)}
                      {tok.revocationReason && (
                        <div className="text-[9px] text-rose-500 font-mono mt-0.5 max-w-[120px] truncate" title={tok.revocationReason}>
                          {tok.revocationReason}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {tok.status === 'active' && (
                        <button
                          onClick={() => handleRevokeToken(tok)}
                          disabled={revokingId === tok.id}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{revokingId === tok.id ? 'Revoking...' : 'Revoke'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{tokens.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> tokens in vault
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-slate-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
