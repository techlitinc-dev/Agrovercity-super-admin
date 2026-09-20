import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  Smartphone,
  KeyRound,
  LogOut,
  Clock,
  MapPin,
  FileCode,
  History,
  Check,
  Copy,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  UserCheck,
  UserX,
  ExternalLink,
  Laptop,
  Fingerprint
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminAuthService } from '../../services/adminAuthService';

export function ActionDrawer({
  user,
  isOpen,
  onClose,
  onOpenResetMpin,
  onOpenRevokeSessions,
  onOpenStatusChange,
  onUserDataUpdated
}) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState('overview'); // overview, sessions, tokens, guardrails, audit, json
  const [copiedJson, setCopiedJson] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [togglingFlag, setTogglingFlag] = useState(false);

  useEffect(() => {
    if (user && isOpen && activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [user, isOpen, activeTab]);

  const loadAuditLogs = async () => {
    if (!user) return;
    setLoadingAudit(true);
    try {
      const logs = await adminAuthService.getAuditLogs(user.uid);
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(user, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    addToast({
      title: 'JSON Copied',
      message: 'User document payload copied to clipboard',
      type: 'info'
    });
  };

  const handleTerminateSession = async (sessionId, deviceName) => {
    if (!hasPermission('canRevokeSessions')) {
      addToast({
        title: 'Permission Denied',
        message: 'Your current role lacks permission to terminate user sessions.',
        type: 'error'
      });
      return;
    }

    try {
      const res = await adminAuthService.terminateSingleSession({
        uid: user.uid,
        sessionId,
        adminUid: currentAdmin.email,
        reason: 'Individual device session terminated via Admin Drawer'
      });

      addToast({
        title: 'Session Terminated',
        message: `Active session on ${deviceName} has been closed.`,
        type: 'success'
      });

      if (onUserDataUpdated) onUserDataUpdated(res.user);
    } catch (err) {
      addToast({
        title: 'Action Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleToggleSecurityFlag = async (field, currentValue) => {
    if (!hasPermission('canToggleFlags')) {
      addToast({
        title: 'Permission Denied',
        message: 'Requires Super Admin privilege to change security enforcement flags.',
        type: 'error'
      });
      return;
    }

    setTogglingFlag(true);
    try {
      const res = await adminAuthService.toggleSecurityFlag({
        uid: user.uid,
        field,
        value: !currentValue,
        adminUid: currentAdmin.email,
        reason: `Admin changed ${field} to ${!currentValue}`
      });

      addToast({
        title: 'Security Flag Updated',
        message: res.message,
        type: 'success'
      });

      if (onUserDataUpdated) onUserDataUpdated(res.user);
    } catch (err) {
      addToast({
        title: 'Flag Toggle Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setTogglingFlag(false);
    }
  };

  const activeSessions = user.sessions?.filter((s) => s.active) || [];

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-500/40 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">{user.name}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {user.id}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{user.mobile}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400">{user.persona}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons Row inside Header */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenResetMpin(user)}
                disabled={!hasPermission('canResetMpin')}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Force MPIN Reset</span>
              </button>

              <button
                onClick={() => onOpenRevokeSessions(user)}
                disabled={!hasPermission('canRevokeSessions') || activeSessions.length === 0}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Revoke All Sessions ({activeSessions.length})</span>
              </button>

              <button
                onClick={() => onOpenStatusChange(user)}
                disabled={!hasPermission('canUpdateStatus')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mt-4 overflow-x-auto text-xs font-semibold border-b border-slate-800 pb-1">
              {[
                { id: 'overview', label: 'Identity & Auth' },
                { id: 'sessions', label: `Sessions (${activeSessions.length})` },
                { id: 'tokens', label: `Tokens (${user.authTokens?.length || 0})` },
                { id: 'guardrails', label: 'Guardrails & 2FA' },
                { id: 'audit', label: 'Audit Trail' },
                { id: 'json', label: 'Raw JSON' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Callout */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Account Authorization State</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold capitalize text-white">{user.status}</span>
                      {user.failedLoginAttempts > 0 && (
                        <span className="text-xs text-rose-400 font-mono">
                          ({user.failedLoginAttempts} failed login attempts)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenStatusChange(user)}
                    disabled={!hasPermission('canUpdateStatus')}
                    className="text-xs font-medium text-emerald-400 hover:underline disabled:opacity-40"
                  >
                    Change Status
                  </button>
                </div>

                {/* Primary Document Details from `users` collection */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 divide-y divide-slate-800 text-xs">
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Firebase UID</span>
                    <span className="font-mono text-slate-200">{user.uid}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Primary Mobile</span>
                    <span className="font-mono text-slate-200 font-medium">{user.mobile}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Email Address</span>
                    <span className="font-mono text-slate-200">{user.email}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">DPDP Masked Aadhaar</span>
                    <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
                      {user.aadhaarMasked || 'Not Submitted'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">MPIN Status</span>
                    <span className={`font-mono px-2 py-0.5 rounded border ${user.mpinSet ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800' : 'bg-rose-950/50 text-rose-400 border-rose-800'}`}>
                      {user.mpinSet ? 'Configured & Active' : 'Not Configured'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">2-Factor Authentication</span>
                    <span className={`font-mono px-2 py-0.5 rounded border ${user.twoFactorEnabled ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {user.twoFactorEnabled ? 'Mandatory (Enforced)' : 'Optional (Disabled)'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Biometric Credentials</span>
                    <span className="font-mono text-slate-300">
                      {user.biometricEnabled ? 'Biometrics Bound (FIDO2)' : 'Disabled'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Registered On</span>
                    <span className="font-mono text-slate-300">{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Last Authentication</span>
                    <span className="font-mono text-slate-300">{new Date(user.lastLoginAt).toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-400">Last Known IP & Location</span>
                    <span className="font-mono text-slate-300">{user.lastLoginIp} ({user.geoCity})</span>
                  </div>
                </div>

                {/* Emergency Intervention Notice */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200/90 leading-relaxed">
                  <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    SOP-01 Intervention Protocol
                  </div>
                  Superadmins can force an emergency MPIN reset or revoke all refresh tokens in case of suspected phone loss, SIM-swap attacks, or compromised credentials.
                </div>
              </div>
            )}

            {/* TAB 2: SESSIONS & DEVICES */}
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Multi-Device Sessions (`sessions` collection)
                  </h3>
                  {activeSessions.length > 0 && (
                    <button
                      onClick={() => onOpenRevokeSessions(user)}
                      disabled={!hasPermission('canRevokeSessions')}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline disabled:opacity-40"
                    >
                      Revoke All Active
                    </button>
                  )}
                </div>

                {user.sessions && user.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {user.sessions.map((sess) => (
                      <div
                        key={sess.id}
                        className={`p-4 rounded-xl border ${
                          sess.active
                            ? 'bg-slate-900/90 border-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800 opacity-60'
                        } space-y-2`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {sess.deviceName.toLowerCase().includes('chrome') || sess.deviceName.toLowerCase().includes('mac') ? (
                              <Laptop className="w-4 h-4 text-slate-400" />
                            ) : (
                              <Smartphone className="w-4 h-4 text-slate-400" />
                            )}
                            <div>
                              <div className="font-semibold text-sm text-white flex items-center gap-2">
                                {sess.deviceName}
                                {sess.active ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active Now
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    Revoked / Expired
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                Session ID: {sess.id} · Device Ref: {sess.deviceId}
                              </div>
                            </div>
                          </div>

                          {sess.active && (
                            <button
                              onClick={() => handleTerminateSession(sess.id, sess.deviceName)}
                              disabled={!hasPermission('canRevokeSessions')}
                              className="px-2.5 py-1 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 rounded-lg transition-colors disabled:opacity-40"
                            >
                              Terminate
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80 text-slate-300 font-mono">
                          <div>
                            <span className="text-slate-500">IP Address: </span>
                            <span>{sess.ipAddress}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Location: </span>
                            <span>{sess.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Started: </span>
                            <span>{new Date(sess.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Last Seen: </span>
                            <span>{new Date(sess.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 truncate" title={sess.userAgent}>
                          UA: {sess.userAgent}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No active sessions found for this user.
                  </div>
                )}

                {/* Registered Devices sub-section */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4">
                  Registered Hardware Fingerprints (`devices` collection)
                </h3>
                <div className="space-y-2">
                  {user.devices?.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{dev.deviceName}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {dev.platform} ({dev.osVersion}) · App: {dev.appVersion}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${dev.status === 'trusted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {dev.status}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {dev.biometricEnabled ? 'Biometrics: Yes' : 'Biometrics: No'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: AUTH TOKENS */}
            {activeTab === 'tokens' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    JWT Access & Refresh Tokens (`auth_tokens` collection)
                  </h3>
                </div>

                {user.authTokens && user.authTokens.length > 0 ? (
                  <div className="space-y-3">
                    {user.authTokens.map((tok) => (
                      <div
                        key={tok.id}
                        className={`p-3.5 rounded-xl border ${
                          tok.status === 'active'
                            ? 'bg-slate-900/80 border-slate-700'
                            : 'bg-slate-950/50 border-slate-800 opacity-50'
                        } text-xs space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                              {tok.tokenType} Token
                            </span>
                            <span className="font-mono text-slate-400">{tok.id}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              tok.status === 'active'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {tok.status}
                          </span>
                        </div>

                        <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-slate-400 truncate">
                          Hash: {tok.tokenHash}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                          <div>Issued: {new Date(tok.issuedAt).toLocaleString()}</div>
                          <div>Expires: {new Date(tok.expiresAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No authentication tokens registered.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GUARDRAILS & 2FA */}
            {activeTab === 'guardrails' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Administrative Guardrails & Security Policies
                </h3>

                {/* 2FA Enforcement Switch */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Mandates SMS / WhatsApp OTP verification on each new device login.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('twoFactorEnabled', user.twoFactorEnabled)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        user.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* MPIN Requirement Switch */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">4-Digit MPIN Enforcement</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Current status: {user.mpinSet ? 'Configured & Required' : 'Not Set (OTP Login only)'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('mpinSet', user.mpinSet)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.mpinSet ? 'bg-emerald-600' : 'bg-slate-800'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        user.mpinSet ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Biometric Credentials */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">Biometric Login Binding (FIDO2)</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Permits fingerprint / face biometric auth on trusted mobile devices.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('biometricEnabled', user.biometricEnabled)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.biometricEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        user.biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Force MPIN Reset Banner */}
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Force MPIN Reset with Temporary OTP (SOP-01 Section 3)
                  </div>
                  <p className="text-xs text-amber-200/80">
                    Generates an enveloped administrative MPIN reset request. The user's current MPIN will be invalidated immediately, and a 6-digit emergency OTP dispatched to {user.mobile}.
                  </p>
                  <button
                    onClick={() => onOpenResetMpin(user)}
                    disabled={!hasPermission('canResetMpin')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-40"
                  >
                    Trigger Emergency MPIN Reset
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Immutable Audit Log History (`audit_logs` collection)
                  </h3>
                  <button
                    onClick={loadAuditLogs}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Refresh Logs
                  </button>
                </div>

                {loadingAudit ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Fetching audit trail...
                  </div>
                ) : auditLogs.length > 0 ? (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5 font-mono"
                      >
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-bold text-emerald-400">{log.action}</span>
                          <span className="text-[10px] text-slate-500">{log.id}</span>
                        </div>
                        <div className="text-slate-200 font-sans text-xs">
                          {log.reason}
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                          <span>Admin: {log.adminUid}</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          State Diff: {log.previousState} &rarr; {log.newState}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No recorded administrative audit interventions for this account yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: RAW JSON INSPECTOR */}
            {activeTab === 'json' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Enveloped Document JSON Schema</span>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition-colors border border-slate-700"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[500px]">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
            <span>SOP-01 Superadmin Intervention Interface</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
