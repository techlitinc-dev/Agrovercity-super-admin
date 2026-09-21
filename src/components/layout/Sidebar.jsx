import React from 'react';
import {
  ShieldCheck,
  Users,
  FileCheck,
  TrendingUp,
  Package,
  ShoppingCart,
  FileText,
  Truck,
  Tractor,
  MapPin,
  Cpu,
  MessageSquare,
  BookOpen,
  Landmark,
  Shield,
  Layers,
  Droplets,
  Network,
  HeartPulse,
  Video,
  Trees,
  Award,
  CloudSun,
  HandHeart,
  Coins,
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MODULES = [
  { id: '01', title: 'Auth & RBAC Sessions', icon: ShieldCheck, path: '/admin/auth', badge: 'SOP-01' },
  { id: '02', title: 'User Management', icon: Users, path: '/admin/users', badge: 'SOP-02' },
  { id: '03', title: 'KYC & Vault', icon: FileCheck, path: '/admin/kyc', badge: 'SOP-03' },
  { id: '04', title: 'Mandi Rates', icon: TrendingUp, path: '/admin/mandi', badge: 'SOP-04' },
  { id: '05', title: 'Produce Lots & B2B', icon: Package, path: '/admin/lots', badge: 'SOP-05' },
  { id: '06', title: 'Marketplace & Orders', icon: ShoppingCart, path: '/admin/marketplace', badge: 'SOP-06' },
  { id: '07', title: 'Buyer Contracts & Escrow', icon: FileText, path: '/admin/contracts', badge: 'SOP-07' },
  { id: '08', title: 'Transport & Fleet', icon: Truck, path: '/admin/transport', badge: 'SOP-08' },
  { id: '09', title: 'Equipment & Rental', icon: Tractor, path: '/admin/equipment', badge: 'SOP-09' },
  { id: '10', title: 'Land Leasing & Disputes', icon: MapPin, path: '/admin/land', badge: 'SOP-10' },
  { id: '11', title: 'AI Advisory Models', icon: Cpu, path: '/admin/ai-advisory', badge: 'SOP-11' },
  { id: '12', title: 'Chatbot & Handoff', icon: MessageSquare, path: '/admin/chatbot', badge: 'SOP-12' },
  { id: '13', title: 'Farm Diary & PnL', icon: BookOpen, path: '/admin/diary', badge: 'SOP-13' },
  { id: '14', title: 'Banking & Underwriting', icon: Landmark, path: '/admin/finance', badge: 'SOP-14' },
  { id: '15', title: 'Insurance & Claims', icon: Shield, path: '/admin/insurance', badge: 'SOP-15' },
  { id: '16', title: 'Land Registry (7/12)', icon: Layers, path: '/admin/land-records', badge: 'SOP-16' },
  { id: '17', title: 'Water & Irrigation', icon: Droplets, path: '/admin/water', badge: 'SOP-17' },
  { id: '18', title: 'FPO & Pool Mgmt', icon: Network, path: '/admin/fpo', badge: 'SOP-18' },
  { id: '19', title: 'Livestock & Dairy', icon: HeartPulse, path: '/admin/livestock', badge: 'SOP-19' },
  { id: '20', title: 'Content CMS & Gyan', icon: Video, path: '/admin/content', badge: 'SOP-20' },
  { id: '21', title: 'Agroforestry & Trees', icon: Trees, path: '/admin/tree', badge: 'SOP-21' },
  { id: '22', title: 'Gamification Economy', icon: Award, path: '/admin/ratings', badge: 'SOP-22' },
  { id: '23', title: 'Climate & Cold Storage', icon: CloudSun, path: '/admin/cold-storage', badge: 'SOP-23' },
  { id: '24', title: 'Women SHG Programs', icon: HandHeart, path: '/admin/women-shg', badge: 'SOP-24' },
  { id: '25', title: 'Financial Settlements', icon: Coins, path: '/admin/settlements', badge: 'SOP-25' },
  { id: '26', title: 'System Config & Moderation', icon: Sliders, path: '/admin/config', badge: 'SOP-26' },
];

export function Sidebar({ collapsed, setCollapsed, activeModuleId = '05', onSelectModule }) {
  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar header toggle */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Platform Modules (26)
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {MODULES.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeModuleId;
          const isImplemented = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'].includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => {
                if (onSelectModule) {
                  onSelectModule(item.id);
                }
              }}
              className={`group flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
              title={`${item.id}. ${item.title}${!isImplemented ? ' (Planned in upcoming SOP)' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">
                    <span className="font-mono text-[10px] text-slate-500 mr-1.5">{item.id}</span>
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar footer with system info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>FastAPI Gateway:</span>
            <span className="text-emerald-400 font-mono text-[10px]">Online :8000</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Multi-Persona Engine:</span>
            <span className="text-slate-300 font-mono text-[10px]">6 Personas Ready</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>DPDP Compliance:</span>
            <span className="text-emerald-400 font-mono">Enforced (Masked)</span>
          </div>
        </div>
      )}
    </aside>
  );
}
