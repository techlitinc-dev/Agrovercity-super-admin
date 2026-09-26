import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  Layers,
  CheckSquare,
  Square,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  Check,
  AlertTriangle
} from 'lucide-react';
import { NAVIGATION_GROUPS, ALL_MODULES_MAP } from '../../lib/navigationConfig';

export function AddModuleAdminModal({
  isOpen,
  onClose,
  onAddStaff,
  allowedModuleIds = null,
  initialRole = 'Admin'
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState(initialRole);
  const [selectedModules, setSelectedModules] = useState(['14', '15', '24', '25']);
  const [justification, setJustification] = useState('');
  const [permissions, setPermissions] = useState({
    canApprove: initialRole !== 'DEO',
    canEdit: true,
    canDelete: false,
    canExport: initialRole !== 'DEO'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset or initialize when modal opens or initialRole/allowedModuleIds changes
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      if (allowedModuleIds && allowedModuleIds.length > 0) {
        setSelectedModules(allowedModuleIds);
      } else if (initialRole === 'DEO') {
        setSelectedModules(['04']);
      } else {
        setSelectedModules(['14', '15', '24', '25']);
      }

      if (initialRole === 'DEO') {
        setPermissions({
          canApprove: false,
          canEdit: true,
          canDelete: false,
          canExport: false
        });
      } else {
        setPermissions({
          canApprove: true,
          canEdit: true,
          canDelete: false,
          canExport: true
        });
      }
      setError('');
    }
  }, [isOpen, initialRole, allowedModuleIds]);

  // Synchronize permissions and modules when role changes manually
  useEffect(() => {
    if (role === 'Superadmin') {
      setSelectedModules(Object.keys(ALL_MODULES_MAP));
      setPermissions({
        canApprove: true,
        canEdit: true,
        canDelete: true,
        canExport: true
      });
    } else if (role === 'DEO') {
      setPermissions({
        canApprove: false,
        canEdit: true,
        canDelete: false,
        canExport: false
      });
    }
  }, [role]);

  // Filter groups if restricted by allowedModuleIds
  const displayedGroups = useMemo(() => {
    if (!allowedModuleIds) return NAVIGATION_GROUPS;
    return NAVIGATION_GROUPS.map((grp) => {
      const allowedInGroup = grp.modules.filter((m) => allowedModuleIds.includes(m));
      if (allowedInGroup.length === 0) return null;
      return {
        ...grp,
        modules: allowedInGroup
      };
    }).filter(Boolean);
  }, [allowedModuleIds]);

  const maxAvailableModuleCount = allowedModuleIds
    ? allowedModuleIds.length
    : Object.keys(ALL_MODULES_MAP).length;

  if (!isOpen) return null;

  const handleToggleModule = (modId) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
  };

  const handleToggleGroup = (groupId) => {
    const group = displayedGroups.find((g) => g.id === groupId);
    if (!group) return;
    const groupMods = group.modules;
    const allSelected = groupMods.every((m) => selectedModules.includes(m));

    if (allSelected) {
      setSelectedModules((prev) => prev.filter((m) => !groupMods.includes(m)));
    } else {
      setSelectedModules((prev) => Array.from(new Set([...prev, ...groupMods])));
    }
  };

  const handleSelectAll = () => {
    if (allowedModuleIds) {
      setSelectedModules(allowedModuleIds);
    } else {
      setSelectedModules(Object.keys(ALL_MODULES_MAP));
    }
  };

  const handleDeselectAll = () => {
    setSelectedModules([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide the full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid official work email address.');
      return;
    }
    if (selectedModules.length === 0) {
      setError('Please select at least one module under Module Access Delegation.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddStaff({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim() || '+91 98765 43210',
        role,
        department: department.trim() || (role === 'DEO' ? 'Data Entry Desk' : 'Agri-Finance & Banking Division'),
        zone: 'State Jurisdiction',
        delegatedModules: selectedModules,
        permissions,
        justification: justification.trim(),
        status: 'active'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const isDeoMode = initialRole === 'DEO' || !!allowedModuleIds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-emerald-100 overflow-hidden">
        {/* Top Header */}
        <div className={`px-6 py-4 text-white flex items-center justify-between shadow-xs shrink-0 ${
          isDeoMode
            ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800'
            : 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              {isDeoMode ? <UserCheck className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-wider uppercase text-emerald-100 font-semibold">
                {isDeoMode ? 'Delegated Hierarchy: Admin ➔ DEO' : 'Superadmin ➔ Admins ➔ DEOs'}
              </div>
              <h2 className="text-lg font-bold">
                {isDeoMode ? 'Add Data Entry Operator (DEO)' : 'Add Module Admin & Delegation'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          {allowedModuleIds && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Boundary Enforced:</strong> As a Module Admin, you can only delegate permissions from your granted modules ({allowedModuleIds.length} modules available).
              </span>
            </div>
          )}

          {/* Section 1: Admin Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>1. {isDeoMode ? 'Operator Account Details' : 'Admin Account Details'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={isDeoMode ? "e.g., Mahesh Shinde" : "e.g., Suresh Patel"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Official Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={isDeoMode ? "e.g., mahesh.deo@agrovercity.in" : "e.g., suresh.finance@agrovercity.in"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Phone / Mobile (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / Mobile <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., +91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Department / Desk (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Desk <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isDeoMode ? "e.g., Field Entry Desk / APMC Cell" : "e.g., Agri-Finance & Banking Division"}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Role Tier Selection */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role Tier{' '}
                <span className="text-blue-600 font-semibold">
                  {isDeoMode
                    ? '(Data Entry Operator Scope)'
                    : '(Ensure "Module Admin" is selected)'}
                </span>
              </label>

              {isDeoMode ? (
                <div className="p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      Data Entry Operator (DEO)
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Restricted to operational data entry within your delegated module boundaries.
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Module Admin (Default) */}
                  <div
                    onClick={() => setRole('Admin')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'Admin'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        Module Admin
                      </span>
                      {role === 'Admin' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Authorized to govern delegated modules, approvals, and data records.
                    </p>
                  </div>

                  {/* Superadmin */}
                  <div
                    onClick={() => setRole('Superadmin')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'Superadmin'
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        Superadmin
                      </span>
                      {role === 'Superadmin' && <Check className="w-4 h-4 text-purple-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Master access to all 26 platform modules and staff delegation.
                    </p>
                  </div>

                  {/* DEO */}
                  <div
                    onClick={() => setRole('DEO')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'DEO'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        DEO (Data Entry)
                      </span>
                      {role === 'DEO' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Operational data entry and initial intake verification.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 2: Step 6 - Module Access Delegation */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Module Access Delegation</span>
              </h3>
              {/* Counter on top right */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                  {selectedModules.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-slate-600 hover:text-blue-700 hover:underline px-1 cursor-pointer"
                >
                  Select All ({maxAvailableModuleCount})
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:underline px-1 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              {isDeoMode
                ? 'Select which of your authorized modules this Data Entry Operator may access:'
                : 'Pick which modules this Admin is authorized to govern using Category Batch or Granular Pick:'}
            </p>

            <div className="space-y-3.5">
              {displayedGroups.map((grp) => {
                const groupMods = grp.modules;
                const groupSelectedCount = groupMods.filter((m) => selectedModules.includes(m)).length;
                const isGroupAllSelected = groupSelectedCount === groupMods.length;

                return (
                  <div
                    key={grp.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5 hover:border-slate-300 transition-colors"
                  >
                    {/* Category Header with Option A (Category Batch: "Select All in Group") */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{grp.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({groupSelectedCount}/{groupMods.length} selected)
                        </span>
                      </div>

                      {/* Option A: Click "Select All in Group" */}
                      <button
                        type="button"
                        onClick={() => handleToggleGroup(grp.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isGroupAllSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                            : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{isGroupAllSelected ? 'Deselect Group' : 'Select All in Group'}</span>
                      </button>
                    </div>

                    {/* Option B: Granular Pick - Individual Module Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {groupMods.map((modId) => {
                        const m = ALL_MODULES_MAP[modId];
                        if (!m) return null;
                        const isSelected = selectedModules.includes(modId);

                        return (
                          <div
                            key={modId}
                            onClick={() => handleToggleModule(modId)}
                            className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer border transition-all select-none ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-400 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-400/30'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className="truncate">
                                <span className="font-mono text-slate-400 mr-1.5">{m.id} -</span>
                                {m.shortTitle}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">
                              {m.sop}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 3: Step 7 - Justification or Operational Notes (Optional) */}
          {/* ========================================================================= */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Justification or Operational Notes <span className="text-slate-400 font-normal">(Optional)</span></span>
            </label>
            <textarea
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Add justification or operational notes (e.g., Authorized for FY26-27 Agri-Finance & PMFBY underwriting oversight desk)..."
              className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none"
            />
          </div>
        </form>

        {/* ========================================================================= */}
        {/* Footer: Step 7 - Green Button: "Create Module Admin" (or DEO) */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Selected: <span className="font-bold text-blue-700">{selectedModules.length}</span> / {maxAvailableModuleCount} modules
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {/* Green button: "Create Module Admin" */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{submitting ? 'Creating...' : isDeoMode ? 'Create Data Entry Operator' : 'Create Module Admin'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
