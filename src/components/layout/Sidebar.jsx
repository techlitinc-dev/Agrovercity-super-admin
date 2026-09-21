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
  LayoutDashboard
} from 'lucide-react';
import {
  NAVIGATION_GROUPS,
  ALL_MODULES_MAP,
  getModuleById
} from '../../lib/navigationConfig';

export function Sidebar({ collapsed, setCollapsed, activeModuleId = 'overview', onSelectModule }) {
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
  }, [searchQuery, selectedCategory]);

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.modulesList.length, 0);
  }, [filteredGroups]);

  return (
    <aside
      className={`hidden md:flex flex-col bg-gradient-to-b from-white/95 via-[#f6fbf7]/90 to-white/95 backdrop-blur-2xl border-r border-emerald-200/70 transition-all duration-300 ease-in-out shrink-0 z-20 shadow-[4px_0_24px_rgba(16,185,129,0.04)] ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-emerald-200/60 flex items-center justify-between bg-emerald-50/40">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shadow-emerald-600/30">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 block">
                Agro Modules
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-medium">
                6 Domains · 26 Standard SOPs
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/70 transition-colors ml-auto shadow-2xs border border-emerald-200/50"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Executive Command Center Button */}
      {!collapsed ? (
        <div className="p-2.5 border-b border-emerald-200/60 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50">
          <button
            onClick={() => {
              if (onSelectModule) onSelectModule('overview');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all shadow-xs ${
              activeModuleId === 'overview'
                ? 'bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white font-bold shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
                : 'bg-white hover:bg-emerald-50/90 text-slate-800 hover:text-emerald-950 border border-emerald-200/80 font-semibold'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeModuleId === 'overview' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
            </div>
            <div className="flex-1 flex items-center justify-between truncate text-left">
              <div className="truncate">
                <span className="block font-bold text-xs truncate">Executive Command</span>
                <span className={`block text-[10px] font-mono truncate ${activeModuleId === 'overview' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  HQ Overview & Insights
                </span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1 shrink-0 ${
                activeModuleId === 'overview' ? 'bg-emerald-500/40 text-emerald-100 border border-white/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
              }`}>
                Live
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div className="p-2 border-b border-emerald-200/60 flex justify-center bg-emerald-50/30">
          <button
            onClick={() => onSelectModule && onSelectModule('overview')}
            className={`p-2 rounded-xl transition-all ${
              activeModuleId === 'overview'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 ring-2 ring-emerald-400/50'
                : 'text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50'
            }`}
            title="Executive Command Center & Overview"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Module Search & Category Filter Pills (When Expanded) */}
      {!collapsed && (
        <div className="p-3 border-b border-emerald-100/80 bg-white/60 space-y-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 26 modules (e.g. Mandi, 7/12)..."
              className="w-full bg-emerald-50/40 border border-emerald-200/70 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                  : 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50'
              }`}
            >
              All (26)
            </button>
            {NAVIGATION_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedCategory(g.id)}
                className={`px-2 py-0.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === g.id
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                    : 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50'
                }`}
              >
                {g.shortTitle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
        {filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 space-y-1">
            <p>No modules found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-emerald-700 font-semibold underline text-[11px]"
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all ${
                      hasActiveModule
                        ? 'bg-emerald-100/60 text-emerald-950 font-bold'
                        : 'text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`p-1 rounded-lg ${hasActiveModule ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'}`}>
                        <GroupIcon className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span className="text-[11px] uppercase tracking-wider truncate">
                        {group.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-bold">
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
                  <div className="py-1 flex justify-center border-b border-emerald-100/60" title={group.title}>
                    <GroupIcon className="w-4 h-4 text-emerald-700" />
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
                          className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-100 via-emerald-50/80 to-white text-emerald-950 border-l-4 border-l-emerald-600 border-y border-r border-emerald-300/80 font-bold shadow-xs'
                              : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60 border border-transparent font-medium'
                          }`}
                          title={`${item.id}. ${item.title}`}
                        >
                          <div className="relative shrink-0">
                            <Icon
                              className={`w-4 h-4 transition-transform group-hover:scale-105 ${
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
                                <span className={`font-mono text-[10px] mr-1.5 ${isActive ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
                                  {item.id}
                                </span>
                                {item.shortTitle || item.title}
                              </span>
                              {item.sop && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ml-1 shrink-0 ${
                                    isActive
                                      ? 'bg-emerald-200/80 text-emerald-900 border-emerald-400 font-bold'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
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
        <div className="p-3 border-t border-emerald-200/70 bg-gradient-to-b from-white/60 to-emerald-50/40 text-[11px] text-slate-600 space-y-1.5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">FastAPI Engine:</span>
            <span className="text-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1.5 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active :8000
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Personas Engine:</span>
            <span className="text-slate-800 font-mono font-semibold">6 Personas Ready</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500">DPDP Compliance:</span>
            <span className="text-emerald-800 font-mono font-bold">Enforced (Masked)</span>
          </div>
        </div>
      )}
    </aside>
  );
}
