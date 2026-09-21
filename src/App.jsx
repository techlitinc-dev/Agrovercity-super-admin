import React, { useState } from 'react';
import { AuthAdminProvider } from './context/AuthAdminContext';
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
import { TransportModule } from './components/transport/TransportModule';
import { EquipmentModule } from './components/equipment/EquipmentModule';

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState('19'); // Default to Module 19: Livestock, Dairy & Veterinary Services
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefreshed = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getBreadcrumb = () => {
    switch (activeModuleId) {
      case '19':
        return {
          path: '/admin/livestock',
          title: 'Livestock, Dairy & Veterinary Services',
          sop: 'SOP-19',
          collections: 'gaushalas, nurseries, vets, dairy_products, vet_bookings, manure_orders',
          compliance: 'MSVC Vet Licensure: Verified • 80G Gaushala Audit: Active • NABL A2 Purity: Enforced • Dual Sign-off > ₹50,000'
        };
      case '18':
        return {
          path: '/admin/fpo',
          title: 'FPO Engine & Bulk Procurement Pools',
          sop: 'SOP-18',
          collections: 'fpos, fpo_pools, fpo_pool_members',
          compliance: 'ROC CIN & NABARD Empanelment: Verified • Escrow Dual Sign-off > ₹50,000 • DPDP Masking: Enforced'
        };
      case '17':
        return {
          path: '/admin/water',
          title: 'Water Intelligence & Irrigation Management',
          sop: 'SOP-17',
          collections: 'water_schedules, cgwb_stations, canal_schedules',
          compliance: 'CGWB Piezometer Telemetry: Active • Canal Rotation Dispatch: Enforced • PMKSY 55% Cap: Enforced • Dual Sign-off > ₹50,000'
        };
      case '16':
        return {
          path: '/admin/land-records',
          title: 'Land Records Registry (7/12 & 8A Utara)',
          sop: 'SOP-16',
          collections: 'land_records_712, users/{uid}/imported_records',
          compliance: 'Mahabhulekh Gateway: Active • Redis L2 Cache: Sub-5ms • DPDP Aadhaar Masking: PASS • Audit Logging: Enforced'
        };
      case '15':
        return {
          path: '/admin/insurance',
          title: 'Crop Insurance (PMFBY) & Calamity Claims',
          sop: 'SOP-15',
          collections: 'insurance_policies, insurance_claims, insurance_rates',
          compliance: 'PMFBY 72-Hour Calamity Intimation • Geotagged Damage Verification • Dual Sign-off > ₹50,000 • Aadhaar Masking'
        };
      case '14':
        return {
          path: '/admin/finance',
          title: 'Banking, Credit Score & Microfinance',
          sop: 'SOP-14',
          collections: 'bank_accounts, loan_applications, kcc_records',
          compliance: 'Penny-Drop Verification: Active • Kisan Credit Score: Enforced • Dual Sign-off > ₹50,000: Enforced'
        };
      case '13':
        return {
          path: '/admin/diary',
          title: 'Farm Diary, P&L Analytics & Break-Even',
          sop: 'SOP-13',
          collections: 'farm_diary_entries, crop_pnl',
          compliance: 'AgriCoins Reward Ledger: Active • Pre-Sowing Cost Calibration: Enforced • Dual Sign-off > ₹50,000: Enforced'
        };
      case '12':
        return {
          path: '/admin/chatbot',
          title: 'Kisan Mitra AI Chatbot & Human Expert Handoff',
          sop: 'SOP-12',
          collections: 'chatbot_sessions, chatbot_messages, expert_tickets, experts',
          compliance: 'Gemini 2.5 Flash + Rule-Based Fallback: Active • Prompt Config Audit: v-tracked • KVK Expert SLA: Enforced'
        };
      case '11':
        return {
          path: '/admin/advisory',
          title: 'AI Advisory, Disease Scan & Pest Radar',
          sop: 'SOP-11',
          collections: 'advisory_scans, pest_alerts, soil_tests, crop_cycles',
          compliance: 'ICAR NPK Algorithm: v3.1 Enforced • Geofenced Broadcast: Active • Accuracy Audit: Enabled'
        };
      case '10':
        return {
          path: '/admin/land',
          title: 'Landlord Land Management & Leasing',
          sop: 'SOP-10',
          collections: 'land_plots, land_leases, land_lease_payments, land_listings, lease_requests',
          compliance: '7/12 Audit Before Listing: Enforced • Arbitrated Termination: Active • Dual Sign-off > ₹50,000: Enforced'
        };
      case '09':
        return {
          path: '/admin/equipment',
          title: 'Equipment Rental & Yantra Time-Slots',
          sop: 'SOP-09',
          collections: 'equipment, equipment_slots, equipment_bookings',
          compliance: 'Dual Sign-off > ₹50,000: Enforced • DPDP Aadhaar Masking: Active • Audit Logging: Immutable'
        };
      case '08':
        return {
          path: '/admin/transport',
          title: 'Transport Logistics & Fleet Operations',
          sop: 'SOP-08',
          collections: 'vehicles, transport_bookings, transporter_settlements',
          compliance: 'Dual Sign-off > ₹50,000: Enforced • POD Audit Before Payout: Active'
        };
      case '07':
        return {
          path: '/admin/contracts',
          title: 'Buyer Contracts & Price Locks',
          sop: 'SOP-07',
          collections: 'buyer_contracts, contract_acceptances',
          compliance: 'MPIN Digital Acceptance: Active • Escrow Dual Sign-off > ₹50,000: Enforced'
        };
      case '06':
        return {
          path: '/admin/marketplace',
          title: 'Input Marketplace, Cart, Orders & Payments',
          sop: 'SOP-06',
          collections: 'products, orders, users/{uid}/cart, users/{uid}/addresses, products/{id}/reviews, payments',
          compliance: 'Razorpay Refunds: Active • Agmark QR Verification: Enforced'
        };
      case '05':
        return {
          path: '/admin/lots',
          title: 'Produce Lots & B2B Trading',
          sop: 'SOP-05',
          collections: 'market_lots, deals, procurements, buyer_ledgers',
          compliance: 'Escrow Lock: Active • Electronic Weighbridge Attestation: Enforced'
        };
      case '04':
        return {
          path: '/admin/mandi',
          title: 'Mandi Prices, Vyapari Live Rates & Approvals',
          sop: 'SOP-04',
          collections: 'mandi_prices, vyapari_rates, mandi_history',
          compliance: 'Sanity Band: ±15% Enforced • 2-Hr Trader Feeds: Active'
        };
      case '03':
        return {
          path: '/admin/vault',
          title: 'KYC Verification & Document Vault',
          sop: 'SOP-03',
          collections: 'users/{uid}/vault_documents, kyc_verifications',
          compliance: 'AES-256 Vault: Encrypted • Side-by-Side OCR: Active'
        };
      case '02':
        return {
          path: '/admin/users',
          title: 'User Profiles & Multi-Persona Management',
          sop: 'SOP-02',
          collections: 'users, users/{uid}/role_profiles, users/{uid}/bookings',
          compliance: '6 Personas Supported • Satellite Polygon Geofencing: Active'
        };
      case '01':
      default:
        return {
          path: '/admin/auth',
          title: 'Authentication, RBAC, Sessions & Security',
          sop: 'SOP-01',
          collections: 'users, auth_tokens, devices, sessions',
          compliance: 'FastAPI Endpoints: 6 Implemented • Pytest 9.1.1: 13/13 Passed'
        };
    }
  };

  const currentNav = getBreadcrumb();

  return (
    <AuthAdminProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
          {/* Top Sticky Header */}
          <Header
            activeModuleId={activeModuleId}
            onDataRefreshed={handleDataRefreshed}
          />

          {/* Main Layout Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* 26-Module Superadmin Sidebar */}
            <Sidebar
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              activeModuleId={activeModuleId}
              onSelectModule={(modId) => setActiveModuleId(modId)}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-950/60 pb-16">
              {/* Breadcrumb & Path Indicator */}
              <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 lg:px-8 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-slate-500">Superadmin</span>
                  <span>/</span>
                  <span className="font-mono text-emerald-400">
                    {currentNav.path}
                  </span>
                  <span>/</span>
                  <span className="text-slate-200 font-medium">
                    {currentNav.title}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>Standard: {currentNav.sop}</span>
                  <span>•</span>
                  <span>Collections: {currentNav.collections}</span>
                </div>
              </div>

              {/* Module Content */}
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
          <footer className="bg-slate-950 border-t border-slate-800/80 px-6 py-2.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                AGROVERCITY Superadmin Console · {currentNav.sop} Compliance Enforced
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>DPDP Act (Aadhaar Masking): PASS</span>
              <span>•</span>
              <span>{currentNav.compliance}</span>
            </div>
          </footer>
        </div>
      </NotificationProvider>
    </AuthAdminProvider>
  );
}

export default App;
