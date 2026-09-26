import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Activity,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Award,
  Sparkles,
  Calculator,
  Store,
  MapPin,
  Clock,
  RefreshCw,
  Info
} from 'lucide-react';
import { adminMandiService } from '../../services/adminMandiService';
import { useNotification } from '../../context/NotificationContext';

export function MandiHistoryAndComparison() {
  const { addToast } = useNotification();
  const [commodity, setCommodity] = useState('All Commodities');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  // Comparison Calculator state
  const [calcCommodity, setCalcCommodity] = useState('Onion (Nashik Red)');
  const [quantityQtl, setQuantityQtl] = useState(100);
  const [farmerDistrict, setFarmerDistrict] = useState('Nashik');
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // Fetch trend history
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const data = await adminMandiService.listMandiDetailedHistory({ commodity });
      setTrends(data);
    } catch (err) {
      addToast({
        title: 'Failed to Fetch History',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Run Net-Profit Comparison
  const runComparison = async () => {
    setCalcLoading(true);
    try {
      const result = await adminMandiService.calculateNetMandiComparison({
        commodity: calcCommodity,
        quantityQtl,
        farmerDistrict
      });
      setCalcResult(result);
    } catch (err) {
      addToast({
        title: 'Comparison Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setCalcLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [commodity]);

  useEffect(() => {
    runComparison();
  }, [calcCommodity, quantityQtl, farmerDistrict]);

  return (
    <div className="space-y-6">
      {/* 1. Historical Trends Header & Filter */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Historical Price Trends & Volatility Analytics (<span className="font-mono text-xs text-emerald-700 font-semibold">mandi_history</span>)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory 7-day modal benchmark curves, day-over-day price momentum, and APMC arrival volumes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600">Commodity:</span>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All Commodities">All Commodities</option>
                <option value="Onion">Onion (Nashik Red)</option>
                <option value="Soybean">Soybean (Yellow)</option>
                <option value="Turmeric">Turmeric (Salem)</option>
                <option value="Sugarcane">Sugarcane (Co 86032)</option>
              </select>
            </div>

            <button
              onClick={fetchTrends}
              disabled={loading}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-all active:scale-95"
              title="Refresh Trends"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Commodity Trends Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {trends.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 truncate pr-2">{item.commodity}</span>
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    item.pctChange7d >= 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {item.pctChange7d >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {item.pctChange7d}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{item.mandiName}</span>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-black font-mono text-slate-900">
                    ₹{item.currentModal.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-500 font-normal"> /Qtl</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                    <span>7D High: <strong className="text-slate-700">₹{item.weekHigh}</strong></span>
                    <span>7D Low: <strong className="text-slate-700">₹{item.weekLow}</strong></span>
                  </div>
                </div>
              </div>

              {/* Sparkline Visual Simulation */}
              <div className="mt-4 pt-3 border-t border-emerald-100/70">
                <div className="flex items-end gap-1.5 h-10 w-full">
                  {item.dailyHistory.map((d, i) => {
                    const minVal = item.weekLow * 0.98;
                    const maxVal = item.weekHigh * 1.02;
                    const heightPct = Math.round(((d.modal - minVal) / (maxVal - minVal)) * 100);
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                      >
                        <div
                          style={{ height: `${Math.max(heightPct, 15)}%` }}
                          className={`w-full rounded-t-sm transition-all ${
                            i === item.dailyHistory.length - 1
                              ? 'bg-emerald-600'
                              : 'bg-emerald-200 group-hover:bg-emerald-400'
                          }`}
                        />
                        {/* Tooltip */}
                        <div className="absolute -top-9 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                          {d.date}: ₹{d.modal} ({d.arrivalsMt} MT)
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                  <span>14 Sep</span>
                  <span className="text-emerald-700 font-bold">{item.volatility}</span>
                  <span>20 Sep</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Detailed Historical Price Ledger Table */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Official Daily Modal & Inflow Ledger (7-Day Government Registry)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            Daily Reconciliation · Central eNAM Database
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-2.5 px-4">Commodity / APMC</th>
                <th className="py-2.5 px-3">14 Sep</th>
                <th className="py-2.5 px-3">15 Sep</th>
                <th className="py-2.5 px-3">16 Sep</th>
                <th className="py-2.5 px-3">17 Sep</th>
                <th className="py-2.5 px-3">18 Sep</th>
                <th className="py-2.5 px-3">19 Sep</th>
                <th className="py-2.5 px-4 bg-emerald-100/40 font-black">20 Sep (Today)</th>
                <th className="py-2.5 px-3 text-right">7D Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60">
              {trends.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.commodity}</div>
                    <div className="text-[10px] text-slate-500">{item.mandiName}</div>
                  </td>
                  {item.dailyHistory.map((d, idx) => (
                    <td
                      key={idx}
                      className={`py-3 px-3 font-mono ${
                        idx === item.dailyHistory.length - 1 ? 'bg-emerald-50/70 font-bold text-emerald-900' : 'text-slate-700'
                      }`}
                    >
                      <div>₹{d.modal}</div>
                      <div className="text-[9px] text-slate-400 font-sans">{d.arrivalsMt} MT</div>
                    </td>
                  ))}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={item.pctChange7d >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                      {item.pctChange7d >= 0 ? `+${item.pctChange7d}%` : `${item.pctChange7d}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Net-Profit Mandi Comparison Engine */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Net-Profit Farmer Realization Engine</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    SOP-04 §1
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculates true farmer take-home realization across Mandis after deducting Freight (₹/Qtl/km), APMC Market Cess, and Weighbridge Fees vs Partner Vyapari Farmgate direct purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600">Commodity:</span>
              <select
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value)}
                className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Onion (Nashik Red)">Onion (Nashik Red)</option>
                <option value="Soybean (Yellow)">Soybean (Yellow)</option>
                <option value="Turmeric (Salem)">Turmeric (Salem)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-600">Lot Size:</span>
              <input
                type="number"
                min="10"
                max="5000"
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(Number(e.target.value))}
                className="w-16 bg-transparent text-xs font-bold font-mono text-slate-900 focus:outline-none"
              />
              <span className="text-xs text-slate-500">Qtl</span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-semibold text-slate-600">Farmer Origin:</span>
              <select
                value={farmerDistrict}
                onChange={(e) => setFarmerDistrict(e.target.value)}
                className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Nashik">Nashik (Sinnar/Niphad)</option>
                <option value="Pune">Pune (Haveli/Shirur)</option>
                <option value="Sangli">Sangli (Miraj)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        {calcResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {calcResult.comparison.map((opt) => (
              <div
                key={opt.id}
                className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  opt.isBestOption
                    ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-emerald-200 shadow-xs'
                }`}
              >
                {opt.isBestOption && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold font-mono px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>Highest Net Realization</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        opt.type === 'VYAPARI_FARMGATE'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-sky-100 text-sky-900 border border-sky-300'
                      }`}>
                        {opt.type === 'VYAPARI_FARMGATE' ? 'Farmgate Direct Vyapari' : 'Regulated APMC Mandi'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{opt.name}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{opt.location} · {opt.distanceKm} km away</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Realization Per Qtl */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Net Realization (Take-Home):</div>
                    <div className="text-2xl font-black font-mono text-emerald-700 flex items-baseline gap-1 mt-0.5">
                      <span>₹{opt.netPerQtl.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-normal text-slate-500">/Qtl</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700 font-mono mt-1">
                      Total Payout: ₹{opt.netPayout.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Deductions Breakdown */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Rate Offered:</span>
                      <span className="font-mono font-bold text-slate-900">₹{opt.grossRatePerQtl}/Qtl</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Freight Transport:</span>
                      <span className="font-mono text-rose-600">
                        {opt.freightRatePerQtl === 0 ? 'FREE (Pickup)' : `-₹${opt.freightTotal.toLocaleString('en-IN')} (-₹${opt.freightRatePerQtl}/Q) `}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>APMC Cess ({opt.mandiCessPercent}%):</span>
                      <span className="font-mono text-rose-600">
                        {opt.mandiCessTotal === 0 ? 'Exempt (₹0)' : `-₹${opt.mandiCessTotal.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Weighbridge / Loading:</span>
                      <span className="font-mono text-rose-600">-₹{opt.loadingTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Terms: {opt.paymentTerms}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Advisory Explanation Banner */}
        {calcResult && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900">Superadmin Market Efficiency Finding:</span>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                For a <strong>{calcResult.quantityQtl} Quintal</strong> shipment of {calcResult.commodity} from {calcResult.farmerDistrict}, <strong>{calcResult.bestRecommendation?.name}</strong> delivers the optimal net farmer realization of <strong>₹{calcResult.bestRecommendation?.netPerQtl}/Qtl (₹{calcResult.bestRecommendation?.netPayout.toLocaleString('en-IN')} total)</strong>. 
                Even when distant mandis offer higher gross rates, transport freight deductions and APMC cess erode take-home profits by up to 14%. Partner trader farmgate pickup protects farmers from logistics overhead.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
