import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Sprout,
  X,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Sparkles,
  Command,
  Database,
  CheckCircle2,
  Lock
} from 'lucide-react';
import {
  NAVIGATION_GROUPS,
  ALL_MODULES_MAP,
  getModuleById
} from '../../lib/navigationConfig';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function Sidebar({ collapsed, setCollapsed, activeModuleId = 'overview', onSelectModule }) {
  const { isModuleAllowed, actingStaff } = useAuthAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Track expanded groups. Auto-expand the group of the active module.
  const activeModule = getModuleById(activeModuleId);
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initial = {};
    NAVIGATION_GROUPS.forEach((g) => {
      initial[g.id] = true; // All expanded by default for easy discovery
    });
    return initial;
  });

  // Ensure active module's group is expanded when activeModuleId changes
  useEffect(() => {
    if (activeModule?.groupId) {
      setExpandedGroups((prev) => ({
        ...prev,
        [activeModule.groupId]: true,
      }));
    }
  }, [activeModule?.groupId]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Filter groups and modules based on search and category filter
  const filteredGroups = useMemo(() => {
    return NAVIGATION_GROUPS.map((group) => {
      // Category filter check
      if (selectedCategory !== 'all' && group.id !== selectedCategory) {
        return null;
      }

      // Filter modules within this group
      const matchingModules = group.modules
        .map((modId) => ALL_MODULES_MAP[modId])
        .filter((mod) => {
          if (!mod) return false;
          // Hide unauthorized modules for delegated admin
          if (!isModuleAllowed(mod.id)) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            mod.id.includes(q) ||
            mod.title.toLowerCase().includes(q) ||
            mod.shortTitle.toLowerCase().includes(q) ||
            mod.sop.toLowerCase().includes(q)
          );
        });

      if (matchingModules.length === 0) return null;

      return {
        ...group,
        modulesList: matchingModules,
      };
    }).filter(Boolean);
  }, [searchQuery, selectedCategory, isModuleAllowed]);

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.modulesList.length, 0);
  }, [filteredGroups]);

  return (
    <aside
      className={`hidden md:flex flex-col bg-gradient-to-b from-white/95 via-[#f5fbf7]/90 to-white/95 backdrop-blur-2xl border-r border-emerald-200/70 transition-all duration-300 ease-in-out shrink-0 z-20 shadow-[4px_0_30px_rgba(6,95,70,0.03)] ${
        collapsed ? 'w-[68px]' : 'w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-emerald-200/70 flex items-center justify-between bg-white/70 backdrop-blur-md">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white border border-emerald-300/90 shadow-2xs flex items-center justify-center p-1">
                <img
                  src="/logo.png"
                  alt="Agrovercity"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 block truncate">
                Agrovercity
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  26 SOPs Active
                </span>
                <span className="text-[9px] font-mono bg-emerald-100/80 text-emerald-800 px-1 py-0.2 rounded font-semibold">
                  v2.4
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-white border border-emerald-300/90 shadow-2xs flex items-center justify-center p-1">
                <img
                  src="/logo.png"
                  alt="Agrovercity"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-xl text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/80 bg-emerald-50/70 transition-all shadow-2xs border border-emerald-200/80 cursor-pointer active:scale-95 ${
            collapsed ? 'mt-2 mx-auto' : 'ml-auto'
          }`}
          title={collapsed ? 'Expand Navigation Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Executive Command Center Button (Superadmin Only) */}
      {(!actingStaff || actingStaff.role === 'Superadmin') && (
        !collapsed ? (
          <div className="p-2.5 border-b border-emerald-200/60 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50">
            <button
              onClick={() => {
                if (onSelectModule) onSelectModule('overview');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs transition-all duration-200 cursor-pointer ${
                activeModuleId === 'overview'
                  ? 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 text-white font-bold shadow-md shadow-emerald-800/25 ring-2 ring-emerald-400/40 border border-emerald-600'
                  : 'bg-white hover:bg-emerald-50/90 text-slate-800 hover:text-emerald-950 border border-emerald-200/90 font-semibold shadow-xs hover:shadow-sm'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  activeModuleId === 'overview'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
              </div>
              <div className="flex-1 flex items-center justify-between truncate text-left">
                <div className="truncate">
                  <span className="block font-bold text-xs truncate">Executive Command</span>
                  <span
                    className={`block text-[10px] font-mono truncate ${
                      activeModuleId === 'overview' ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    HQ Live Insights & KPIs
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1 shrink-0 ${
                    activeModuleId === 'overview'
                      ? 'bg-white/25 text-white border border-white/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300/70'
                  }`}
                >
                  Live
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-2 border-b border-emerald-200/60 flex justify-center bg-emerald-50/30">
            <button
              onClick={() => onSelectModule && onSelectModule('overview')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeModuleId === 'overview'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 ring-2 ring-emerald-400/50'
                  : 'text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60 bg-white'
              }`}
              title="Executive Command Center & Overview"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>
        )
      )}

      {/* Module Search & Category Filter Pills (When Expanded) */}
      {!collapsed && (
        <div className="p-3 border-b border-emerald-100/80 bg-white/60 backdrop-blur-sm space-y-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 26 modules (e.g. Mandi, 7/12)..."
              className="w-full bg-emerald-50/40 border border-emerald-200/80 rounded-full pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all font-sans shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-0.5 rounded-full whitespace-nowrap font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
              }`}
            >
              All (26)
            </button>
            {NAVIGATION_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedCategory(g.id)}
                className={`px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  selectedCategory === g.id
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                    : 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
                }`}
              >
                {g.shortTitle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3 scrollbar-thin">
        {filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 space-y-1">
            <p>No matching modules found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-emerald-700 font-semibold underline text-[11px] cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expandedGroups[group.id] || searchQuery.trim().length > 0;
            const hasActiveModule = group.modulesList.some((m) => m.id === activeModuleId);

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Section Header */}
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      hasActiveModule
                        ? 'bg-emerald-100/70 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`p-1 rounded-lg transition-colors ${
                          hasActiveModule
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        <GroupIcon className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span className="text-[11px] uppercase tracking-wider truncate">
                        {group.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 font-bold shadow-2xs">
                        {group.modulesList.length}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>
                ) : (
                  <div
                    className="py-1 flex justify-center border-b border-emerald-100/60 group relative cursor-pointer"
                    title={group.title}
                  >
                    <div className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors">
                      <GroupIcon className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Modules in this Group */}
                {(isExpanded || collapsed) && (
                  <div className={`space-y-1 ${!collapsed ? 'pl-2' : ''}`}>
                    {group.modulesList.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === activeModuleId;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (onSelectModule) {
                              onSelectModule(item.id);
                            }
                          }}
                          className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-100 via-emerald-50/80 to-white text-emerald-950 border-l-4 border-l-emerald-600 border-y border-r border-emerald-300/80 font-bold shadow-xs'
                              : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60 border border-transparent font-medium'
                          }`}
                          title={`${item.id}. ${item.title}`}
                        >
                          <div className="relative shrink-0">
                            <Icon
                              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-700'
                              }`}
                            />
                            {isActive && (
                              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white" />
                            )}
                          </div>

                          {!collapsed && (
                            <div className="flex-1 flex items-center justify-between truncate">
                              <span className="truncate">
                                <span
                                  className={`font-mono text-[10px] mr-1.5 ${
                                    isActive ? 'text-emerald-800 font-bold' : 'text-slate-400'
                                  }`}
                                >
                                  {item.id}
                                </span>
                                {item.shortTitle || item.title}
                              </span>
                              {item.sop && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ml-1 shrink-0 ${
                                    isActive
                                      ? 'bg-emerald-200/90 text-emerald-900 border-emerald-400 font-bold shadow-2xs'
                                      : 'bg-slate-900 text-emerald-300 border-slate-800 font-semibold'
                                  }`}
                                >
                                  {item.sop}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer with Live Telemetry */}
      {!collapsed && (
        <div className="p-3 border-t border-emerald-200/70 bg-gradient-to-b from-white/70 to-emerald-50/50 text-[11px] text-slate-600 space-y-1.5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              FastAPI Engine:
            </span>
            <span className="text-emerald-900 font-mono text-[10px] font-bold flex items-center gap-1.5 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active :8000
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Security / DPDP:</span>
            <span className="text-emerald-800 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Enforced Masking
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Active Framework:</span>
            <span className="text-slate-700 font-mono font-medium">SOP-01 ~ SOP-26</span>
          </div>
        </div>
      )}
    </aside>
  );
}
