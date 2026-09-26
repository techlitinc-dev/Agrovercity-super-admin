import React, { useState, useEffect } from 'react';
import { AuthAdminProvider, useAuthAdmin } from './context/AuthAdminContext';
import { NotificationProvider } from './context/NotificationContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AuthSecurityModule } from './components/auth-module/AuthSecurityModule';
import { UserManagementModule } from './components/user-management/UserManagementModule';
import { KycVaultModule } from './components/kyc-vault/KycVaultModule';
import { MandiRatesModule } from './components/mandi-rates/MandiRatesModule';
import { ProduceLotsModule } from './components/produce-lots/ProduceLotsModule';
import { MarketplaceModule } from './components/marketplace/MarketplaceModule';
import ContractsPage from './pages/ContractsPage';
import LandPage from './pages/LandPage';
import AdvisoryPage from './pages/AdvisoryPage';
import ChatbotPage from './pages/ChatbotPage';
import DiaryPage from './pages/DiaryPage';
import BankingPage from './pages/BankingPage';
import InsurancePage from './pages/InsurancePage';
import LandRecordsPage from './pages/LandRecordsPage';
import WaterPage from './pages/WaterPage';
import FpoPage from './pages/FpoPage';
import LivestockPage from './pages/LivestockPage';
import ContentPage from './pages/ContentPage';
import AgroforestryPage from './pages/AgroforestryPage';
import GamificationPage from './pages/GamificationPage';
import ClimatePage from './pages/ClimatePage';
import WomenShgPage from './pages/WomenShgPage';
import SettlementsPage from './pages/SettlementsPage';
import SystemConfigPage from './pages/SystemConfigPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { TransportModule } from './components/transport/TransportModule';
import { EquipmentModule } from './components/equipment/EquipmentModule';
import { getModuleById, getGroupById } from './lib/navigationConfig';

function AppContent() {
  const { actingStaff, isModuleAllowed } = useAuthAdmin();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState('overview'); // Default to Executive Command Center & Overview
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefreshed = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // If acting as a delegated admin, auto-redirect if current active module is unauthorized
  useEffect(() => {
    if (actingStaff && actingStaff.role !== 'Superadmin') {
      if (!isModuleAllowed(activeModuleId)) {
        const firstAllowed = actingStaff.delegatedModules?.[0] || '02';
        setActiveModuleId(firstAllowed);
      }
    }
  }, [actingStaff, activeModuleId, isModuleAllowed]);

  const currentNav = getModuleById(activeModuleId);
  const currentGroup = getGroupById(currentNav.groupId);

  return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fbf9] via-[#f0fdf4]/50 to-[#ecfdf5]/40 text-slate-900 flex flex-col antialiased relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
          {/* Subtle Ambient Agricultural Glassmorphic Glow Orbs */}
          <div className="pointer-events-none fixed -top-40 -right-40 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl z-0" />
          <div className="pointer-events-none fixed top-1/3 -left-32 w-80 h-80 bg-green-200/30 rounded-full blur-3xl z-0" />
          <div className="pointer-events-none fixed -bottom-32 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl z-0" />

          {/* Top Sticky Header */}
          <Header
            activeModuleId={activeModuleId}
            onDataRefreshed={handleDataRefreshed}
          />

          {/* Main Layout Body */}
          <div className="flex-1 flex overflow-hidden z-10">
            {/* 26-Module Superadmin Grouped Sidebar */}
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              activeModuleId={activeModuleId}
              onSelectModule={(modId) => setActiveModuleId(modId)}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-transparent pb-16">
              {/* Breadcrumb & Path Indicator */}
              <div className="bg-white/75 backdrop-blur-md border-b border-emerald-100/90 px-4 lg:px-8 py-2.5 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-slate-500 flex-wrap">
                  <span className="text-slate-400 font-medium">Superadmin</span>
                  <span className="text-emerald-300">/</span>
                  <span className="font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300/60">
                    {currentGroup?.title}
                  </span>
                  <span className="text-emerald-300">/</span>
                  <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                    {currentNav.path}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900 font-bold">
                    {currentNav.title}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-bold">
                    Standard: {currentNav.sop}
                  </span>
                  <span className="text-emerald-200">•</span>
                  <span>Collections: {currentNav.collections}</span>
                </div>
              </div>

              {/* Module Content */}
              {activeModuleId === 'overview' && (
                <ExecutiveDashboard
                  key={`mod-overview-${refreshKey}`}
                  onNavigate={(modId) => setActiveModuleId(modId)}
                />
              )}
              {activeModuleId === '26' && (
                <SystemConfigPage key={`mod-26-${refreshKey}`} />
              )}
              {activeModuleId === '25' && (
                <SettlementsPage key={`mod-25-${refreshKey}`} />
              )}
              {activeModuleId === '24' && (
                <WomenShgPage key={`mod-24-${refreshKey}`} />
              )}
              {activeModuleId === '23' && (
                <ClimatePage key={`mod-23-${refreshKey}`} />
              )}
              {activeModuleId === '22' && (
                <GamificationPage key={`mod-22-${refreshKey}`} />
              )}
              {activeModuleId === '21' && (
                <AgroforestryPage key={`mod-21-${refreshKey}`} />
              )}
              {activeModuleId === '20' && (
                <ContentPage key={`mod-20-${refreshKey}`} />
              )}
              {activeModuleId === '19' && (
                <LivestockPage key={`mod-19-${refreshKey}`} />
              )}
              {activeModuleId === '18' && (
                <FpoPage key={`mod-18-${refreshKey}`} />
              )}
              {activeModuleId === '17' && (
                <WaterPage key={`mod-17-${refreshKey}`} />
              )}
              {activeModuleId === '16' && (
                <LandRecordsPage key={`mod-16-${refreshKey}`} />
              )}
              {activeModuleId === '15' && (
                <InsurancePage key={`mod-15-${refreshKey}`} />
              )}
              {activeModuleId === '14' && (
                <BankingPage key={`mod-14-${refreshKey}`} />
              )}
              {activeModuleId === '13' && (
                <DiaryPage key={`mod-13-${refreshKey}`} />
              )}
              {activeModuleId === '12' && (
                <ChatbotPage key={`mod-12-${refreshKey}`} />
              )}
              {activeModuleId === '11' && (
                <AdvisoryPage key={`mod-11-${refreshKey}`} />
              )}
              {activeModuleId === '10' && (
                <LandPage key={`mod-10-${refreshKey}`} />
              )}
              {activeModuleId === '09' && (
                <EquipmentModule key={`mod-09-${refreshKey}`} />
              )}
              {activeModuleId === '08' && (
                <TransportModule key={`mod-08-${refreshKey}`} />
              )}
              {activeModuleId === '07' && (
                <ContractsPage key={`mod-07-${refreshKey}`} />
              )}
              {activeModuleId === '06' && (
                <MarketplaceModule key={`mod-06-${refreshKey}`} />
              )}
              {activeModuleId === '05' && (
                <ProduceLotsModule key={`mod-05-${refreshKey}`} />
              )}
              {activeModuleId === '04' && (
                <MandiRatesModule key={`mod-04-${refreshKey}`} />
              )}
              {activeModuleId === '03' && (
                <KycVaultModule key={`mod-03-${refreshKey}`} />
              )}
              {activeModuleId === '02' && (
                <UserManagementModule key={`mod-02-${refreshKey}`} />
              )}
              {activeModuleId === '01' && (
                <AuthSecurityModule key={`mod-01-${refreshKey}`} />
              )}
            </main>
          </div>

          {/* Institutional Compliance & Audit Footer */}
          <footer className="bg-white/85 backdrop-blur-xl border-t border-slate-200/80 px-6 py-2.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)] z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="font-medium text-slate-700">
                AGROVERCITY Superadmin Console · <span className="font-semibold text-emerald-700">{currentNav.sop}</span> Compliance Enforced
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">DPDP Act: PASS</span>
              <span className="text-slate-300">•</span>
              <span>{currentNav.compliance}</span>
            </div>
          </footer>
        </div>
  );
}

export function App() {
  return (
    <AuthAdminProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthAdminProvider>
  );
}

export default App;

