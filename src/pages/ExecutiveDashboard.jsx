import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wheat,
  Tractor,
  Droplets,
  ShieldCheck,
  Package,
  Clock,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  RefreshCw,
  Filter,
  Eye,
  DollarSign,
  Truck,
  Building2,
  Sparkles,
  Layers,
  Leaf,
  Landmark,
  Coins,
  Sliders,
  ChevronRight,
  Activity,
  X,
  ShieldAlert,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';
import { NAVIGATION_GROUPS, ALL_MODULES_MAP } from '../lib/navigationConfig';

// Mock Mandi Commodity Price Stream
const MANDI_TICKER_ITEMS = [
  { crop: 'Soybean (JS-335)', mandi: 'Latur APMC (MH)', price: 4680, change: 2.4, msp: 4892, arrivals: '12,400 Qtl', trend: 'up' },
  { crop: 'Sharbati Wheat', mandi: 'Sehore APMC (MP)', price: 2340, change: 1.1, msp: 2275, arrivals: '18,900 Qtl', trend: 'up' },
  { crop: 'Cotton (Shankar-6)', mandi: 'Rajkot APMC (GJ)', price: 7150, change: -0.8, msp: 7020, arrivals: '8,200 Bales', trend: 'down' },
  { crop: 'Gram / Chana Desi', mandi: 'Akola APMC (MH)', price: 5820, change: 3.2, msp: 5440, arrivals: '9,150 Qtl', trend: 'up' },
  { crop: 'Mustard (Pusa Bold)', mandi: 'Bharatpur APMC (RJ)', price: 5410, change: 0.9, msp: 5650, arrivals: '11,200 Qtl', trend: 'up' },
  { crop: 'Basmati Rice (1121)', mandi: 'Karnal APMC (HR)', price: 4120, change: -1.2, msp: 3800, arrivals: '14,800 Qtl', trend: 'down' },
];

// Mock Live Produce Lots for B2B Escrow Clearance
const INITIAL_PRODUCE_LOTS = [
  {
    id: 'LOT-MH-2026-891',
    farmer: 'Rajesh Patil (FPO Kolhapur)',
    district: 'Kolhapur, Maharashtra',
    crop: 'Soybean',
    variety: 'JS-335 Grade A',
    quantity: '220 Qtl',
    escrowAmount: '₹10,29,600',
    moisture: '10.8%',
    assayStatus: 'Assay Passed',
    escrowStatus: 'Pending Release',
    qualityScore: 94,
    buyer: 'Godrej Agrovet Ltd.',
    timestamp: '14 mins ago'
  },
  {
    id: 'LOT-MP-2026-442',
    farmer: 'Devendra Meena',
    district: 'Sehore, Madhya Pradesh',
    crop: 'Wheat',
    variety: 'Sharbati Certified',
    quantity: '340 Qtl',
    escrowAmount: '₹7,95,600',
    moisture: '9.4%',
    assayStatus: 'Assay Passed',
    escrowStatus: 'Pending Release',
    qualityScore: 98,
    buyer: 'ITC Choupal Fresh',
    timestamp: '32 mins ago'
  },
  {
    id: 'LOT-GJ-2026-109',
    farmer: 'Kishore Patel (Sardar FPC)',
    district: 'Rajkot, Gujarat',
    crop: 'Cotton',
    variety: 'Shankar-6 Long Staple',
    quantity: '180 Bales',
    escrowAmount: '₹12,87,000',
    moisture: '8.2%',
    assayStatus: 'Moisture Re-check',
    escrowStatus: 'Verification Hold',
    qualityScore: 82,
    buyer: 'Vardhman Textiles',
    timestamp: '1 hour ago'
  },
  {
    id: 'LOT-PB-2026-723',
    farmer: 'Harinder Singh',
    district: 'Ludhiana, Punjab',
    crop: 'Basmati',
    variety: 'Pusa 1121 Export',
    quantity: '410 Qtl',
    escrowAmount: '₹16,89,200',
    moisture: '11.1%',
    assayStatus: 'Assay Passed',
    escrowStatus: 'Escrow Released',
    qualityScore: 96,
    buyer: 'KRBL Basmati Export',
    timestamp: '2 hours ago'
  },
  {
    id: 'LOT-MH-2026-512',
    farmer: 'Ananda Shinde (Mahila SHG)',
    district: 'Nagpur, Maharashtra',
    crop: 'Oranges',
    variety: 'Nagpur Mandarin Grade A',
    quantity: '120 Crates',
    escrowAmount: '₹4,32,000',
    moisture: 'N/A (Brix 12.4)',
    assayStatus: 'Assay Passed',
    escrowStatus: 'Pending Release',
    qualityScore: 92,
    buyer: 'Reliance Fresh Retail',
    timestamp: '3 hours ago'
  }
];

// Mock Recent Institutional Audit Stream
const AUDIT_EVENTS = [
  {
    id: 'AUD-9021',
    time: '12:44 PM',
    actor: 'Dr. V. Sharma (Lead Agronomist)',
    action: 'Approved Mandi Anomaly Correction for Akola Mandi',
    module: 'SOP-04',
    badge: 'Dual Sign-off',
    status: 'Verified'
  },
  {
    id: 'AUD-9020',
    time: '12:15 PM',
    actor: 'System Automation Engine',
    action: 'Left Bank Canal Scheduled Shift Triggered (Zone 4)',
    module: 'SOP-17',
    badge: 'Automated SLA',
    status: 'Executed'
  },
  {
    id: 'AUD-9019',
    time: '11:50 AM',
    actor: 'Priya Deshmukh (Finance Superadmin)',
    action: 'Released Escrow Payout of ₹16.89 Lakhs (LOT-PB-2026-723)',
    module: 'SOP-25',
    badge: 'T+1 Settlement',
    status: 'Approved'
  },
  {
    id: 'AUD-9018',
    time: '11:05 AM',
    actor: 'M. K. Verma (Govt Land Inspector)',
    action: 'Digitized & Verified 14 7/12 RoR records in Satara',
    module: 'SOP-16',
    badge: 'Land Registry',
    status: 'Enforced'
  }
];

export function ExecutiveDashboard({ onNavigate }) {
  const [selectedSeason, setSelectedSeason] = useState('rabi_2026');
  const [selectedState, setSelectedState] = useState('all');
  const [produceLots, setProduceLots] = useState(INITIAL_PRODUCE_LOTS);
  const [lotSearchQuery, setLotSearchQuery] = useState('');
  const [lotFilterCrop, setLotFilterCrop] = useState('all');
  const [selectedLotModal, setSelectedLotModal] = useState(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  // Trigger brief visual toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setLastRefreshed('Just now');
    triggerToast('All 412 APMC Mandi feeds & telemetry sensors synchronized successfully.');
  };

  // Filter produce lots
  const filteredLots = useMemo(() => {
    return produceLots.filter((lot) => {
      const matchesSearch =
        lot.id.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
        lot.farmer.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
        lot.district.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
        lot.buyer.toLowerCase().includes(lotSearchQuery.toLowerCase());
      const matchesCrop = lotFilterCrop === 'all' || lot.crop.toLowerCase() === lotFilterCrop.toLowerCase();
      return matchesSearch && matchesCrop;
    });
  }, [produceLots, lotSearchQuery, lotFilterCrop]);

  // Release Escrow action
  const handleReleaseEscrow = (lotId) => {
    setIsReleasing(true);
    setTimeout(() => {
      setProduceLots((prev) =>
        prev.map((l) => (l.id === lotId ? { ...l, escrowStatus: 'Escrow Released' } : l))
      );
      if (selectedLotModal && selectedLotModal.id === lotId) {
        setSelectedLotModal((prev) => ({ ...prev, escrowStatus: 'Escrow Released' }));
      }
      setIsReleasing(false);
      triggerToast(`Escrow successfully released for ${lotId} via SOP-25 T+1 dual sign-off!`);
    }, 600);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:text-emerald-300 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. EXECUTIVE HEADER: Glassmorphic Agronomic Command Header    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl shadow-emerald-950/15 border border-emerald-700/50 p-6 lg:p-8">
        {/* Subtle Decorative Farm Motifs in Background */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Command Center
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-100 border border-white/15 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                Rabi Season 2025–26 (Day 84 of 120)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-600/30">
                SOP-HQ-00
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              National AgriTech Executive Overview
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              Consolidated command radar orchestrating 26 institutional standard operating procedures across farm-gate commerce, groundwater telemetry, mandi commodity rates, and farmer KYC governance.
            </p>
          </div>

          {/* Quick Filters & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Season Selector */}
            <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-600/50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent text-emerald-100 font-medium focus:outline-none cursor-pointer"
              >
                <option value="rabi_2026" className="bg-slate-900 text-white">Rabi 2025–26 (Active)</option>
                <option value="kharif_2025" className="bg-slate-900 text-white">Kharif 2025 (Settlement)</option>
                <option value="all_seasons" className="bg-slate-900 text-white">All Crop Cycles</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-600/50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent text-emerald-100 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">Pan-India (National)</option>
                <option value="MH" className="bg-slate-900 text-white">Maharashtra</option>
                <option value="MP" className="bg-slate-900 text-white">Madhya Pradesh</option>
                <option value="PB" className="bg-slate-900 text-white">Punjab & Haryana</option>
                <option value="GJ" className="bg-slate-900 text-white">Gujarat</option>
                <option value="KA" className="bg-slate-900 text-white">Karnataka</option>
              </select>
            </div>

            {/* Sync / Refresh Button */}
            <button
              onClick={handleRefresh}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95"
              title="Synchronize all telemetry & mandi rates"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Feeds</span>
            </button>
          </div>
        </div>

        {/* Agronomic Weather & Advisory Alert Strip */}
        <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-amber-200">Agro-Climatic Intelligence:</span>
            <span className="text-emerald-100/90">
              Western disturbance active over Northern Plains. Scattered showers predicted — optimal for tillering wheat in Punjab & MP. Soil moisture elevated +4.2%.
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-200 shrink-0">
            <span>FastAPI Core: :8000 (Active)</span>
            <span>•</span>
            <span>Refreshed: {lastRefreshed}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. FOUR HIGH-IMPACT HERO INSIGHT CARDS (FARMING GLASSMORPHISM) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {/* Card 1: Agri-Commodity GMV */}
        <div className="relative group rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:border-emerald-300/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Agri-Commodity GMV
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹48.62 Cr
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-600/25">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span className="text-slate-500 font-medium">MoM vs ₹41.05 Cr</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Escrow Locked:</span>
              <span className="font-mono font-bold text-slate-800">₹12.45 Cr (100% Secure)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">T+1 Settled:</span>
              <span className="font-mono font-bold text-emerald-700">₹36.17 Cr (Zero Disputes)</span>
            </div>
            <div className="w-full bg-emerald-100/80 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '81%' }} />
            </div>
            <div className="text-[10px] text-right text-slate-400 font-mono">
              81% of Q1 Institutional Target (₹60 Cr)
            </div>
          </div>
        </div>

        {/* Card 2: Registered Agricultural Base */}
        <div className="relative group rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:border-emerald-300/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Verified Producer Base
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                284,950
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-600 to-emerald-800 text-white shadow-md shadow-green-700/25">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" /> +3,820 today
            </span>
            <span className="text-slate-500 font-medium">99.4% KYC Verified</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Small/Marginal Farmers:</span>
              <span className="font-mono font-bold text-slate-800">142.3k (50%)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">FPOs & SHG Federations:</span>
              <span className="font-mono font-bold text-emerald-700">74.6k members</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Agronomists & Vets:</span>
              <span className="font-mono font-bold text-teal-700">3,420 active</span>
            </div>
          </div>
        </div>

        {/* Card 3: Mandi Rate Indices */}
        <div className="relative group rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:border-emerald-300/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                APMC Mandi Gateway
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                412 Mandis
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-md shadow-teal-600/25">
              <Wheat className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              <Activity className="w-3.5 h-3.5" /> 68,420 Qtl
            </span>
            <span className="text-slate-500 font-medium">Daily Arrivals</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">AGMARKNET Sync:</span>
              <span className="font-mono font-bold text-emerald-700">Real-Time (5 min)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">e-NAM Bid Gateway:</span>
              <span className="font-mono font-bold text-slate-800">Connected</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Rate Discrepancies:</span>
              <span className="font-mono font-bold text-emerald-700">0 Anomaly Alerts</span>
            </div>
          </div>
        </div>

        {/* Card 4: Irrigation SLA & Telemetry */}
        <div className="relative group rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:border-emerald-300/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Canal & Soil Telemetry
              </span>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                99.98% SLA
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-700 text-white shadow-md shadow-cyan-600/25">
              <Droplets className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
            </span>
            <span className="text-slate-500 font-medium">1,840 Sensor Probes</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Automated Canal Gates:</span>
              <span className="font-mono font-bold text-slate-800">1,840 / 1,840 Online</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Groundwater Depth:</span>
              <span className="font-mono font-bold text-emerald-700">Median -14.2m (Safe)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Cold Chain Storage:</span>
              <span className="font-mono font-bold text-slate-800">74.2% Occupied</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. LIVE APMC MANDI RATES TICKER (AGRO-COMMERCE INTEGRATION)   */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              Live Mandi Commodity Price Stream
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300/50">
              SOP-04 Feed
            </span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('04')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Open Mandi Engine (SOP-04)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Commodity Cards Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {MANDI_TICKER_ITEMS.map((item, idx) => {
            const isUp = item.trend === 'up';
            return (
              <div
                key={idx}
                className="bg-emerald-50/30 hover:bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 transition-all space-y-1.5"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {item.crop}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(item.change)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    MSP: ₹{item.msp}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center justify-between">
                  <span className="truncate">{item.mandi}</span>
                  <span className="font-mono text-emerald-800 font-medium shrink-0 ml-1">
                    {item.arrivals}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. DUAL-COLUMN OPERATIONS RADAR: PRODUCE LOTS & AGRI TELEMETRY */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Live Produce Lots & Escrow Clearance (SOP-05) */}
        <div className="lg:col-span-7 rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    B2B Farm Produce Lots & Escrow Clearance
                  </h2>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300/60 font-semibold">
                    SOP-05 & SOP-25
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Institutional produce batch quality assay scores and escrow disbursement releases.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate && onNavigate('05')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200/80 transition-colors border border-emerald-300/60"
                >
                  Manage Lots (SOP-05)
                </button>
              </div>
            </div>

            {/* Table Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 my-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={lotSearchQuery}
                  onChange={(e) => setLotSearchQuery(e.target.value)}
                  placeholder="Filter by Lot ID, farmer, or buyer..."
                  className="w-full bg-emerald-50/30 border border-emerald-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">Crop:</span>
                {['all', 'soybean', 'wheat', 'cotton', 'basmati', 'oranges'].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setLotFilterCrop(crop)}
                    className={`px-2 py-1 rounded-lg capitalize text-[11px] font-semibold transition-all ${
                      lotFilterCrop === crop
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Produce Lots Table */}
            <div className="overflow-x-auto rounded-xl border border-emerald-100/90 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-50/80 text-emerald-950 font-semibold border-b border-emerald-200/80">
                  <tr>
                    <th className="py-2.5 px-3">Lot ID & Crop</th>
                    <th className="py-2.5 px-3">Producer / FPO</th>
                    <th className="py-2.5 px-3">Qty & Escrow</th>
                    <th className="py-2.5 px-3">Quality Score</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100/60 bg-white/70">
                  {filteredLots.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No produce lots matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLots.map((lot) => {
                      const isReleased = lot.escrowStatus === 'Escrow Released';
                      const isHold = lot.escrowStatus === 'Verification Hold';

                      return (
                        <tr
                          key={lot.id}
                          className="hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedLotModal(lot)}
                        >
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-emerald-900 group-hover:text-emerald-700">
                              {lot.id}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {lot.crop} · <span className="text-slate-400">{lot.variety}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 truncate max-w-[160px]">
                              {lot.farmer}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {lot.district}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-slate-900">
                              {lot.escrowAmount}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {lot.quantity}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold flex items-center justify-center border border-emerald-300">
                                {lot.qualityScore}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Moisture: {lot.moisture}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isReleased
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : isHold
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-teal-100 text-teal-900 border-teal-300'
                              }`}
                            >
                              {lot.escrowStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedLotModal(lot)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredLots.length} verified produce lots</span>
            <button
              onClick={() => onNavigate && onNavigate('25')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Settlement Audit Log (SOP-25)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Farm Operations & Agronomic Telemetry Radar */}
        <div className="lg:col-span-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/80">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  Agronomic Telemetry Radar
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time canal gates, pest threat traps, and IoT soil moisture.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300/60 font-semibold">
                SOP-17 & SOP-23
              </span>
            </div>

            {/* Telemetry Feature 1: Canal Water Rotation */}
            <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Canal Water Rotation (SOP-17)
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Zone 4 Active
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Left Bank Canal discharging <strong className="text-slate-800 font-mono">450 cusecs</strong> to 42 tail-end distributaries. Next rotation shift in <strong className="text-emerald-800 font-mono">5h 28m</strong>.
              </p>
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Shift Progress: 68%</span>
                <button
                  onClick={() => onNavigate && onNavigate('17')}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Manage Gates →
                </button>
              </div>
            </div>

            {/* Telemetry Feature 2: Climate & Pest Early Warning */}
            <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-50/70 to-emerald-50/50 border border-amber-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Pest & Climate Early Warning (SOP-23)
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Advisory Active
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Fall Armyworm pheromone trap density elevated in 2 cluster zones. Automated Hindi/Marathi voice advisories dispatched to <strong className="text-slate-800 font-mono">14,200 farmers</strong>.
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-emerald-800 font-semibold">100% Crop Insurance Linked</span>
                <button
                  onClick={() => onNavigate && onNavigate('23')}
                  className="text-amber-800 font-bold hover:underline"
                >
                  View Radar →
                </button>
              </div>
            </div>

            {/* Telemetry Feature 3: Farm Fleet & Reefer Cold Chain */}
            <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-50/60 to-emerald-50/40 border border-cyan-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-700" />
                  Fleet & Reefer Cold Logistics (SOP-08)
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-800 bg-white px-2 py-0.5 rounded border border-cyan-200">
                  412 GPS Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Avg Pickup Time</span>
                  <span className="font-mono font-bold text-slate-900">24 mins</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Temp Compliance</span>
                  <span className="font-mono font-bold text-emerald-700">100% (4°C - 8°C)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs text-slate-500">
            <span>Soil Moisture Median: 24.8% (Optimal)</span>
            <button
              onClick={() => onNavigate && onNavigate('08')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Transport Fleet (SOP-08)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. CROSS-DOMAIN 6-PILLAR INSTITUTIONAL MATRIX                 */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              6-Domain AgriTech Infrastructure Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Institutional supervision matrix covering all 26 SOP modules categorized by functional domain.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300/70">
            26 Active Modules · DPDP Masked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAVIGATION_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div
                key={group.id}
                className="rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/90 hover:shadow-[0_12px_40px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs">
                        <GroupIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {group.title}
                        </h3>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          {group.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {group.description}
                  </p>

                  {/* Modules quick buttons in this domain */}
                  <div className="pt-2 border-t border-emerald-100/70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Standard Operating Procedures:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.modules.map((modId) => {
                        const mod = ALL_MODULES_MAP[modId];
                        if (!mod) return null;
                        return (
                          <button
                            key={modId}
                            onClick={() => onNavigate && onNavigate(modId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/70 transition-colors font-medium group"
                            title={`${mod.id}. ${mod.title}`}
                          >
                            <span className="font-mono text-[10px] text-emerald-700 font-bold">
                              {mod.sop || mod.id}
                            </span>
                            <span className="text-[11px] truncate max-w-[110px]">
                              {mod.shortTitle || mod.title}
                            </span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-700" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. INSTITUTIONAL AUDIT & DUAL SIGN-OFF COMPLIANCE STREAM      */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Institutional Audit & Dual Sign-off Stream
            </h2>
            <p className="text-xs text-slate-500">
              Immutable event log tracking administrative interventions exceeding ₹50,000 threshold or high-impact state changes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              DPDP Compliance: Pass
            </span>
            <button
              onClick={() => onNavigate && onNavigate('26')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View Full Audit Vault (SOP-26)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {AUDIT_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-100/80 hover:bg-emerald-50/60 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">{evt.time}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {evt.module}
                </span>
              </div>
              <p className="text-xs text-slate-800 font-semibold leading-snug">
                {evt.action}
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-emerald-100/60">
                <span className="text-slate-500 truncate max-w-[130px]">{evt.actor}</span>
                <span className="text-emerald-800 font-bold font-mono">{evt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUICK PRODUCE LOT INSPECTION & ESCROW CLEARANCE MODAL         */}
      {/* ------------------------------------------------------------- */}
      {selectedLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Produce Lot Inspection: {selectedLotModal.id}
                  </h3>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    SOP-05
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Verification & Escrow Clearance Terminal
                </p>
              </div>
              <button
                onClick={() => setSelectedLotModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Producer / FPO</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedLotModal.farmer}</span>
                  <span className="text-slate-500 text-[11px]">{selectedLotModal.district}</span>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Buyer Entity</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedLotModal.buyer}</span>
                  <span className="text-emerald-700 font-medium text-[11px]">e-NAM Verified Contract</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Produce Variety:</span>
                  <span className="font-bold text-slate-800">{selectedLotModal.crop} ({selectedLotModal.variety})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch Quantity:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLotModal.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Value:</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-sm">{selectedLotModal.escrowAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moisture & Assay:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLotModal.moisture} (Score: {selectedLotModal.qualityScore}/100)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Status:</span>
                  <span className="font-bold text-emerald-700">{selectedLotModal.escrowStatus}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedLotModal(null);
                  if (onNavigate) onNavigate('05');
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Open in SOP-05
              </button>

              <div className="flex items-center gap-2">
                {selectedLotModal.escrowStatus !== 'Escrow Released' ? (
                  <button
                    onClick={() => handleReleaseEscrow(selectedLotModal.id)}
                    disabled={isReleasing}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isReleasing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Dual Sign-off: Release Escrow</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                    ✓ Escrow Fully Settled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExecutiveDashboard;
