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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-emerald-200/90 shadow-2xl flex flex-col text-slate-800 backdrop-blur-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-emerald-100/90 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 backdrop-blur">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/30 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-emerald-700/20">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{user.name}</h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100/70 border border-emerald-300 text-emerald-900">
                      {user.id}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{user.mobile}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-800 font-bold">{user.persona}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons Row inside Header */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenResetMpin(user)}
                disabled={!hasPermission('canResetMpin')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Force MPIN Reset</span>
              </button>

              <button
                onClick={() => onOpenRevokeSessions(user)}
                disabled={!hasPermission('canRevokeSessions') || activeSessions.length === 0}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-700" />
                <span>Revoke All Sessions ({activeSessions.length})</span>
              </button>

              <button
                onClick={() => onOpenStatusChange(user)}
                disabled={!hasPermission('canUpdateStatus')}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-700 hover:text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ml-auto shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span>Update Status</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mt-4 overflow-x-auto text-xs font-semibold border-b border-emerald-100 pb-1">
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
                      ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50 border border-transparent'
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
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Authorization State</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold capitalize text-slate-900">{user.status}</span>
                      {user.failedLoginAttempts > 0 && (
                        <span className="text-xs text-rose-600 font-mono font-bold">
                          ({user.failedLoginAttempts} failed login attempts)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenStatusChange(user)}
                    disabled={!hasPermission('canUpdateStatus')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline disabled:opacity-40"
                  >
                    Change Status
                  </button>
                </div>

                {/* Primary Document Details from `users` collection */}
                <div className="rounded-xl border border-emerald-100 bg-white divide-y divide-emerald-50 text-xs shadow-2xs">
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Firebase UID</span>
                    <span className="font-mono text-slate-900 font-semibold">{user.uid}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Primary Mobile</span>
                    <span className="font-mono text-slate-900 font-bold">{user.mobile}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Email Address</span>
                    <span className="font-mono text-slate-900">{user.email}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">DPDP Masked Aadhaar</span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      {user.aadhaarMasked || 'Not Submitted'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">MPIN Status</span>
                    <span className={`font-mono px-2 py-0.5 rounded border font-semibold ${user.mpinSet ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                      {user.mpinSet ? 'Configured & Active' : 'Not Configured'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">2-Factor Authentication</span>
                    <span className={`font-mono px-2 py-0.5 rounded border font-semibold ${user.twoFactorEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {user.twoFactorEnabled ? 'Mandatory (Enforced)' : 'Optional (Disabled)'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Biometric Credentials</span>
                    <span className="font-mono text-slate-700 font-medium">
                      {user.biometricEnabled ? 'Biometrics Bound (FIDO2)' : 'Disabled'}
                    </span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Registered On</span>
                    <span className="font-mono text-slate-700">{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Last Authentication</span>
                    <span className="font-mono text-slate-700">{new Date(user.lastLoginAt).toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Last Known IP & Location</span>
                    <span className="font-mono text-slate-700">{user.lastLoginIp} ({user.geoCity})</span>
                  </div>
                </div>

                {/* Emergency Intervention Notice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-600" />
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Multi-Device Sessions (`sessions` collection)
                  </h3>
                  {activeSessions.length > 0 && (
                    <button
                      onClick={() => onOpenRevokeSessions(user)}
                      disabled={!hasPermission('canRevokeSessions')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 underline disabled:opacity-40"
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
                            ? 'bg-white border-emerald-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-70'
                        } space-y-2`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {sess.deviceName.toLowerCase().includes('chrome') || sess.deviceName.toLowerCase().includes('mac') ? (
                              <Laptop className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Smartphone className="w-4 h-4 text-slate-500" />
                            )}
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                {sess.deviceName}
                                {sess.active ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Now
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    Revoked / Expired
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                Session ID: {sess.id} · Device Ref: {sess.deviceId}
                              </div>
                            </div>
                          </div>

                          {sess.active && (
                            <button
                              onClick={() => handleTerminateSession(sess.id, sess.deviceName)}
                              disabled={!hasPermission('canRevokeSessions')}
                              className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg transition-colors disabled:opacity-40 shadow-2xs"
                            >
                              Terminate
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-700 font-mono">
                          <div>
                            <span className="text-slate-400">IP Address: </span>
                            <span className="font-semibold">{sess.ipAddress}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Location: </span>
                            <span className="font-semibold">{sess.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Started: </span>
                            <span>{new Date(sess.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Seen: </span>
                            <span>{new Date(sess.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 truncate" title={sess.userAgent}>
                          UA: {sess.userAgent}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No active sessions found for this user.
                  </div>
                )}

                {/* Registered Devices sub-section */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4">
                  Registered Hardware Fingerprints (`devices` collection)
                </h3>
                <div className="space-y-2">
                  {user.devices?.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-3 bg-white border border-emerald-100 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{dev.deviceName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {dev.platform} ({dev.osVersion}) · App: {dev.appVersion}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${dev.status === 'trusted' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                          {dev.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
                            ? 'bg-white border-emerald-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        } text-xs space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-900 uppercase text-[11px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              {tok.tokenType} Token
                            </span>
                            <span className="font-mono text-slate-500">{tok.id}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              tok.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {tok.status}
                          </span>
                        </div>

                        <div className="bg-emerald-50/40 p-2 rounded-lg font-mono text-[11px] text-slate-600 truncate border border-emerald-100">
                          Hash: {tok.tokenHash}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono">
                          <div>Issued: {new Date(tok.issuedAt).toLocaleString()}</div>
                          <div>Expires: {new Date(tok.expiresAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No authentication tokens registered.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GUARDRAILS & 2FA */}
            {activeTab === 'guardrails' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Administrative Guardrails & Security Policies
                </h3>

                {/* 2FA Enforcement Switch */}
                <div className="p-4 rounded-xl bg-white border border-emerald-100 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Mandates SMS / WhatsApp OTP verification on each new device login.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('twoFactorEnabled', user.twoFactorEnabled)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                        user.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* MPIN Requirement Switch */}
                <div className="p-4 rounded-xl bg-white border border-emerald-100 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-sm text-slate-900">4-Digit MPIN Enforcement</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Current status: {user.mpinSet ? 'Configured & Required' : 'Not Set (OTP Login only)'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('mpinSet', user.mpinSet)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.mpinSet ? 'bg-emerald-600' : 'bg-slate-200'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                        user.mpinSet ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Biometric Credentials */}
                <div className="p-4 rounded-xl bg-white border border-emerald-100 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Biometric Login Binding (FIDO2)</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Permits fingerprint / face biometric auth on trusted mobile devices.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSecurityFlag('biometricEnabled', user.biometricEnabled)}
                    disabled={!hasPermission('canToggleFlags') || togglingFlag}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      user.biometricEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                    } disabled:opacity-40`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                        user.biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Force MPIN Reset Banner */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    Force MPIN Reset with Temporary OTP (SOP-01 Section 3)
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Generates an enveloped administrative MPIN reset request. The user's current MPIN will be invalidated immediately, and a 6-digit emergency OTP dispatched to {user.mobile}.
                  </p>
                  <button
                    onClick={() => onOpenResetMpin(user)}
                    disabled={!hasPermission('canResetMpin')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-40"
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Immutable Audit Log History (`audit_logs` collection)
                  </h3>
                  <button
                    onClick={loadAuditLogs}
                    className="text-xs font-bold text-emerald-700 hover:underline"
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
                        className="p-3.5 rounded-xl bg-white border border-emerald-100 text-xs space-y-1.5 font-mono shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-slate-800">
                          <span className="font-bold text-emerald-800">{log.action}</span>
                          <span className="text-[10px] text-slate-400">{log.id}</span>
                        </div>
                        <div className="text-slate-700 font-sans text-xs">
                          {log.reason}
                        </div>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
                          <span>Admin: <strong className="text-slate-700">{log.adminUid}</strong></span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          State Diff: {log.previousState} &rarr; {log.newState}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No recorded administrative audit interventions for this account yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: RAW JSON INSPECTOR */}
            {activeTab === 'json' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 font-semibold">Enveloped Document JSON Schema</span>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-50 text-xs font-semibold text-slate-700 rounded-lg transition-colors border border-emerald-200 shadow-2xs"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-emerald-950 text-[11px] font-mono text-emerald-200 overflow-x-auto max-h-[500px] border border-emerald-800">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-emerald-100 bg-emerald-50/30 flex items-center justify-between text-xs text-slate-500">
            <span>SOP-01 Superadmin Intervention Interface</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
