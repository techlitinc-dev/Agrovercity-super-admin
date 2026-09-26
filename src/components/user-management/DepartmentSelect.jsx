import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  Search,
  Plus,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export const PRESET_DEPARTMENTS = [
  {
    category: 'Agri-Commerce & Markets',
    icon: '🌾',
    items: [
      { id: 'agri-commerce', name: 'Agri-Commerce & Market Operations', badge: 'Mandi' },
      { id: 'apmc-ticker', name: 'APMC Daily Ticker Operations', badge: 'Rates' },
      { id: 'produce-lots', name: 'Produce Quality & Lots Certification', badge: 'QC' },
      { id: 'logistics-pool', name: 'Farm Equipment & Logistics Pool', badge: 'Machinery' }
    ]
  },
  {
    category: 'Finance, Banking & Subsidies',
    icon: '🏦',
    items: [
      { id: 'finance-banking', name: 'Agri-Finance & Banking Division', badge: 'KCC / Loans' },
      { id: 'pmfby-claims', name: 'Kisan Finance & PMFBY Claims', badge: 'Insurance' },
      { id: 'settlements-escrow', name: 'Settlements & Escrow Audit Desk', badge: 'Payouts' }
    ]
  },
  {
    category: 'Land & Revenue Records',
    icon: '📜',
    items: [
      { id: 'land-records', name: 'Land Records & Revenue Liaison', badge: 'Revenue' },
      { id: 'digitization-cell', name: '7/12 & 8A Digitization Cell', badge: 'Records' },
      { id: 'bhulekh-cadastral', name: 'Bhulekh & Cadastral Verification Desk', badge: 'Survey' }
    ]
  },
  {
    category: 'FPO, Women SHG & Rural Enterprise',
    icon: '🤝',
    items: [
      { id: 'women-shg', name: 'Women SHG & Micro-Enterprise Cell', badge: 'SHG' },
      { id: 'fpo-contract', name: 'FPO Aggregation & Contract Farming Desk', badge: 'FPO' }
    ]
  },
  {
    category: 'Agronomy, Climate & Advisory',
    icon: '🔬',
    items: [
      { id: 'agronomy-advisory', name: 'Agronomy Advisory & Soil Testing Cell', badge: 'Soil / Lab' },
      { id: 'climate-weather', name: 'Climate Resilience & Weather Desk', badge: 'Weather' },
      { id: 'ai-helpline', name: 'AI Bot & Farmer Helplines Desk', badge: 'Support' }
    ]
  },
  {
    category: 'Platform & Operations Desk',
    icon: '🛡️',
    items: [
      { id: 'platform-gov', name: 'Executive & Platform Governance', badge: 'Core' },
      { id: 'kyc-compliance', name: 'User Identity & KYC Compliance Vault', badge: 'KYC' },
      { id: 'deo-desk', name: 'Field Data Entry Operations (DEO Desk)', badge: 'DEO' }
    ]
  }
];

export function DepartmentSelect({
  value,
  onChange,
  isDeoMode = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter departments based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return PRESET_DEPARTMENTS;
    const term = searchTerm.toLowerCase();

    return PRESET_DEPARTMENTS.map((cat) => {
      const matchingItems = cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.badge.toLowerCase().includes(term) ||
          cat.category.toLowerCase().includes(term)
      );
      return {
        ...cat,
        items: matchingItems
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchTerm]);

  const handleSelect = (deptName) => {
    onChange(deptName);
    setIsOpen(false);
    setIsCustomMode(false);
    setSearchTerm('');
  };

  const handleApplyCustom = (e) => {
    if (e) e.preventDefault();
    if (customInput.trim()) {
      onChange(customInput.trim());
      setIsCustomMode(false);
      setCustomInput('');
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-left transition-all duration-150 cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
            : value
            ? 'border-emerald-300/80 hover:border-emerald-500'
            : 'border-slate-200 hover:border-slate-300'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Building2 className={`w-4 h-4 absolute left-3 top-2.5 transition-colors ${
          value ? 'text-emerald-600' : 'text-slate-400'
        }`} />

        <div className="flex items-center gap-2 truncate pr-2">
          {value ? (
            <span className="font-semibold text-slate-900 truncate">
              {value}
            </span>
          ) : (
            <span className="text-slate-400 truncate">
              {isDeoMode ? 'Select Field Entry Desk / Cell...' : 'Select Department / Division...'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <span
              onClick={handleClear}
              title="Clear selection"
              className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl border border-emerald-200/90 rounded-2xl shadow-[0_12px_36px_-6px_rgba(16,185,129,0.18),0_4px_16px_-2px_rgba(0,0,0,0.06)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 flex flex-col">
          {/* Search Header */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search department, division, or desk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Department List */}
          <div className="overflow-y-auto space-y-2 pr-1 custom-scrollbar flex-1 text-xs">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{group.icon}</span>
                    <span>{group.category}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isSelected = value === item.name;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item.name)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-300/70'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate mr-2">
                            <span className="truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-500">
                <p className="text-xs">No matching standard department found.</p>
                <button
                  type="button"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      handleSelect(searchTerm.trim());
                    }
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Use "{searchTerm.trim()}" as custom department
                </button>
              </div>
            )}
          </div>

          {/* Custom Department / Desk Input Footer */}
          <div className="mt-2 pt-2 border-t border-slate-100 shrink-0">
            {isCustomMode ? (
              <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter custom department / desk..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-slate-50 border border-emerald-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  setCustomInput(searchTerm || '');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-dashed border-emerald-300/80"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custom / Specific Desk Name...</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
