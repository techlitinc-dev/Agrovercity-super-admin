import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

/**
 * Core Generic Glassmorphic Filter Dropdown
 */
export function AgroFilterDropdown({
  label = 'Filter',
  value,
  onChange,
  options = [],
  icon: Icon = Filter,
  placeholder = 'Select option...',
  showSearch = false,
  searchPlaceholder = 'Search options...',
  clearable = true,
  className = '',
  popoverWidth = 'w-64 sm:w-72',
  align = 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isFiltered = value && value !== 'all' && value !== '';

  // Filter options if search is enabled
  const filteredOptions = showSearch && searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.subtext && opt.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {/* Trigger Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'group flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer select-none',
          isFiltered
            ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
            : 'bg-white/95 hover:bg-emerald-50/50 border-emerald-200/90 text-slate-700 hover:text-slate-900',
          isOpen && 'ring-2 ring-emerald-500/25 border-emerald-600 bg-emerald-50/80 shadow-sm'
        )}
      >
        <Icon
          className={cn(
            'w-3.5 h-3.5 shrink-0 transition-colors',
            isFiltered ? 'text-emerald-700' : 'text-emerald-600/90 group-hover:text-emerald-700'
          )}
        />
        <span className="text-slate-500 font-medium text-[11px]">{label}:</span>
        <span className="font-semibold text-slate-900 truncate max-w-[130px]">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-500 shrink-0 ml-0.5 transition-transform duration-200',
            isOpen ? 'rotate-180 text-emerald-700' : 'group-hover:text-slate-800'
          )}
        />
      </button>

      {/* Floating Glassmorphic Popover */}
      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 rounded-2xl bg-white/98 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_20px_rgba(16,185,129,0.08)] p-2.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150',
            popoverWidth,
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          )}
        >
          {/* Header Row */}
          <div className="px-2 py-1 mb-1.5 flex items-center justify-between border-b border-emerald-100/80 pb-2">
            <div className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-sans">
                {label}
              </span>
            </div>
            {isFiltered && clearable && (
              <button
                type="button"
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200/70 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search Bar inside popover (Optional) */}
          {showSearch && (
            <div className="px-1 mb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Option List Items */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value) || (!value && option.value === 'all');
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 cursor-pointer border',
                      isSelected
                        ? 'bg-emerald-50/90 text-emerald-950 border-emerald-300 shadow-2xs font-semibold'
                        : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Optional Option Indicator / Color Dot / Icon */}
                      {option.dotColor ? (
                        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', option.dotColor)} />
                      ) : option.icon ? (
                        <option.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : null}

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <span className="truncate">{option.label}</span>
                          {option.badge && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-md font-mono border border-emerald-200/80">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        {option.subtext && (
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5 truncate">
                            {option.subtext}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 1. Specialized Status Dropdown Component
 */
export function AgroStatusDropdown({
  value = 'all',
  onChange,
  options,
  label = 'Status',
  className = '',
  align = 'left'
}) {
  const defaultStatusOptions = [
    { value: 'all', label: 'All Statuses', dotColor: 'bg-slate-400' },
    { value: 'active', label: 'Active / Verified', dotColor: 'bg-emerald-500', badge: 'Live' },
    { value: 'pending', label: 'Pending Review', dotColor: 'bg-amber-500', badge: 'Queue' },
    { value: 'flagged', label: 'Flagged Anomaly', dotColor: 'bg-rose-500', badge: 'Alert' },
    { value: 'settled', label: 'Settled / Completed', dotColor: 'bg-teal-500' }
  ];

  return (
    <AgroFilterDropdown
      label={label}
      value={value}
      onChange={onChange}
      options={options || defaultStatusOptions}
      icon={ShieldCheck}
      popoverWidth="w-64 sm:w-72"
      className={className}
      align={align}
    />
  );
}

/**
 * 2. Specialized District / Region Dropdown Component
 */
export function AgroDistrictDropdown({
  value = 'all',
  onChange,
  districts,
  label = 'District',
  className = '',
  align = 'left'
}) {
  const defaultDistricts = [
    { value: 'all', label: 'All Districts (Pan-India)', subtext: 'Aggregate national view' },
    { value: 'Pune', label: 'Pune', subtext: 'Maharashtra · Western Command', badge: 'MH' },
    { value: 'Nashik', label: 'Nashik', subtext: 'Maharashtra · Onion & Grape Hub', badge: 'MH' },
    { value: 'Nagpur', label: 'Nagpur', subtext: 'Maharashtra · Vidarbha Zone', badge: 'MH' },
    { value: 'Indore', label: 'Indore', subtext: 'Madhya Pradesh · Malwa Basin', badge: 'MP' },
    { value: 'Sehore', label: 'Sehore', subtext: 'Madhya Pradesh · Sharbati Wheat', badge: 'MP' },
    { value: 'Ahmedabad', label: 'Ahmedabad', subtext: 'Gujarat · North Command', badge: 'GJ' },
    { value: 'Rajkot', label: 'Rajkot', subtext: 'Gujarat · Saurashtra Cotton Belt', badge: 'GJ' },
    { value: 'Belagavi', label: 'Belagavi', subtext: 'Karnataka · Sugar & Dairy', badge: 'KA' },
    { value: 'Karnal', label: 'Karnal', subtext: 'Haryana · Basmati Rice Belt', badge: 'HR' }
  ];

  return (
    <AgroFilterDropdown
      label={label}
      value={value}
      onChange={onChange}
      options={districts || defaultDistricts}
      icon={MapPin}
      showSearch={true}
      searchPlaceholder="Search state or district..."
      popoverWidth="w-72 sm:w-80"
      className={className}
      align={align}
    />
  );
}

/**
 * 3. Specialized Date / Timeframe Dropdown Component
 */
export function AgroDateDropdown({
  value = 'all',
  onChange,
  options,
  label = 'Date Range',
  className = '',
  align = 'left'
}) {
  const defaultDateOptions = [
    { value: 'all', label: 'All Time Records', subtext: 'Cumulative historical ledger' },
    { value: 'today', label: 'Today (Live Intimations)', subtext: 'Past 24 hours realtime activity' },
    { value: '7d', label: 'Last 7 Days', subtext: 'Current operational cycle' },
    { value: '30d', label: 'Last 30 Days', subtext: 'Monthly billing & SLA cycle' },
    { value: 'rabi_2025_26', label: 'Rabi 2025–26 (Active Season)', badge: 'SOP-HQ', subtext: 'Current crop sowing & harvest period' },
    { value: 'kharif_2025', label: 'Kharif 2025 Season', subtext: 'Archived monsoon harvest ledger' },
    { value: 'q1_2026', label: 'Q1 FY2026', subtext: 'Statutory fiscal quarter' }
  ];

  return (
    <AgroFilterDropdown
      label={label}
      value={value}
      onChange={onChange}
      options={options || defaultDateOptions}
      icon={Calendar}
      popoverWidth="w-72 sm:w-80"
      className={className}
      align={align}
    />
  );
}

/**
 * 4. Specialized Persona / Role Filter Dropdown Component
 */
export function AgroPersonaDropdown({
  value = 'all',
  onChange,
  options,
  label = 'Persona',
  className = '',
  align = 'left'
}) {
  const defaultPersonaOptions = [
    { value: 'all', label: 'All Ecosystem Personas', subtext: 'Entire stakeholder registry' },
    { value: 'farmer', label: 'Farmers & Cultivators', badge: 'KYC Validated', subtext: 'Small & marginal landholders' },
    { value: 'fpo', label: 'FPO / SHG Federations', badge: 'Tier-1', subtext: 'Producer collectives & aggregators' },
    { value: 'trader', label: 'APMC Traders & Buyers', badge: 'e-NAM', subtext: 'Licensed commission agents' },
    { value: 'surveyor', label: 'Crop Loss Surveyors', badge: 'PMFBY', subtext: 'Field inspection & geotag panel' },
    { value: 'transporter', label: 'Logistics & Fleet Owners', subtext: 'Agri-freight & bulk hauliers' },
    { value: 'admin', label: 'Institutional Admins', badge: 'RBAC', subtext: 'Superusers & DEO operators' }
  ];

  return (
    <AgroFilterDropdown
      label={label}
      value={value}
      onChange={onChange}
      options={options || defaultPersonaOptions}
      icon={Users}
      popoverWidth="w-72 sm:w-80"
      className={className}
      align={align}
    />
  );
}

export default AgroFilterDropdown;
