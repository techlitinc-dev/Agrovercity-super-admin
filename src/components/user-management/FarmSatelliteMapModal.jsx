import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function FarmSatelliteMapModal({ isOpen, onClose, user, onPolygonUpdated }) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [polygonData, setPolygonData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'vertices' | 'geojson'
  const [editingVertices, setEditingVertices] = useState([]);
  const [adminReason, setAdminReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [mouseCoord, setMouseCoord] = useState(null);
  const [showSatelliteGrid, setShowSatelliteGrid] = useState(true);

  // Initialize polygon state when user changes
  useEffect(() => {
    if (user && user.farmPolygon) {
      setPolygonData(user.farmPolygon);
      setEditingVertices(user.farmPolygon.coordinates ? [...user.farmPolygon.coordinates] : []);
    } else if (user) {
      // Default empty or new polygon
      const defaultPoly = {
        title: `${user.name}'s Farmland Plot`,
        surveyNumber: '7/12 Gat No. 101/A',
        district: user.geoCity ? user.geoCity.split(',')[0] : 'Kolhapur',
        taluka: 'Karvir',
        village: 'Shiroli',
        acreage: 3.5,
        gunthas: 20,
        soilType: 'Medium Black Loam',
        irrigationSource: 'Borewell Lift',
        center: [16.7200, 74.2640],
        coordinates: [
          { lat: 16.7210, lng: 74.2610, label: 'Point A (North)' },
          { lat: 16.7230, lng: 74.2650, label: 'Point B (East)' },
          { lat: 16.7190, lng: 74.2670, label: 'Point C (South)' },
          { lat: 16.7180, lng: 74.2620, label: 'Point D (West)' }
        ],
        verifiedByAdmin: false
      };
      setPolygonData(defaultPoly);
      setEditingVertices(defaultPoly.coordinates);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  // Calculate SVG polygon points based on normalized coordinates
  // Normalize lat/lng to SVG viewport [100, 500] x [100, 400]
  const renderSvgPolygon = () => {
    if (!editingVertices || editingVertices.length < 3) return '';

    const lats = editingVertices.map((v) => v.lat);
    const lngs = editingVertices.map((v) => v.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = maxLat - minLat || 0.001;
    const lngSpan = maxLng - minLng || 0.001;

    return editingVertices
      .map((v) => {
        // Project to SVG coordinates: 600 x 400 with 60px padding
        const x = 70 + ((v.lng - minLng) / lngSpan) * 460;
        // Invert Y because SVG 0 is top
        const y = 350 - ((v.lat - minLat) / latSpan) * 280;
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Calculate perimeter and area approximation
  const calculateArea = () => {
    if (editingVertices.length < 3) return 0;
    // Simple Shoelace approximation
    let area = 0;
    const n = editingVertices.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += editingVertices[i].lat * editingVertices[j].lng;
      area -= editingVertices[j].lat * editingVertices[i].lng;
    }
    const rawSqDeg = Math.abs(area) / 2;
    // Rough conversion in Maharashtra region (1 deg lat ~ 111 km, 1 deg lng ~ 106 km)
    const sqKm = rawSqDeg * 111 * 106;
    const acres = sqKm * 247.105;
    return Math.max(Number(acres.toFixed(2)), 0.5);
  };

  const handleVertexChange = (index, field, value) => {
    const updated = [...editingVertices];
    updated[index] = {
      ...updated[index],
      [field]: field === 'label' ? value : parseFloat(value) || 0
    };
    setEditingVertices(updated);
  };

  const handleAddVertex = () => {
    const last = editingVertices[editingVertices.length - 1] || { lat: 16.7200, lng: 74.2640 };
    const newVertex = {
      lat: Number((last.lat + 0.0015).toFixed(4)),
      lng: Number((last.lng + 0.0015).toFixed(4)),
      label: `Point ${String.fromCharCode(65 + editingVertices.length)}`
    };
    setEditingVertices([...editingVertices, newVertex]);
  };

  const handleDeleteVertex = (index) => {
    if (editingVertices.length <= 3) {
      addToast({
        title: 'Validation Error',
        message: 'A geofence polygon requires at least 3 vertices.',
        type: 'warning'
      });
      return;
    }
    setEditingVertices(editingVertices.filter((_, i) => i !== index));
  };

  const handleSavePolygon = async () => {
    if (!adminReason.trim()) {
      addToast({
        title: 'Administrative Reason Required',
        message: 'Please provide an audit rationale for updating farm geofence coordinates.',
        type: 'warning'
      });
      return;
    }

    setSaving(true);
    try {
      const computedAcreage = calculateArea() || polygonData.acreage;
      const updatedPolygon = {
        ...polygonData,
        acreage: computedAcreage,
        gunthas: Math.round((computedAcreage % 1) * 40),
        coordinates: editingVertices,
        verifiedByAdmin: true,
        lastMappedAt: new Date().toISOString()
      };

      const res = await adminUserService.updateFarmPolygon({
        uid: user.uid,
        farmPolygon: updatedPolygon,
        adminUid: currentAdmin.email,
        reason: adminReason.trim()
      });

      addToast({
        title: 'Farm Boundary Saved',
        message: res.message,
        type: 'success'
      });

      if (onPolygonUpdated) {
        onPolygonUpdated(res.user);
      }
      onClose();
    } catch (err) {
      addToast({
        title: 'Save Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportGeoJson = () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            userId: user.uid,
            userName: user.name,
            parcelTitle: polygonData.title,
            surveyNumber: polygonData.surveyNumber,
            acreage: polygonData.acreage,
            district: polygonData.district,
            taluka: polygonData.taluka
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                ...editingVertices.map((v) => [v.lng, v.lat]),
                // Close the loop
                editingVertices[0] ? [editingVertices[0].lng, editingVertices[0].lat] : []
              ]
            ]
          }
        }
      ]
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJson, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `farm_geofence_${user.id}_${polygonData.surveyNumber?.replace(/[^a-zA-Z0-9]/g, '_')}.geojson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'GeoJSON Exported',
      message: 'Boundary geometry downloaded for GIS / Mahabhulekh verification.',
      type: 'success'
    });
  };

  const computedAcres = calculateArea();
  const computedGunthas = Math.round((computedAcres % 1) * 40);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-teal-400">
                  Satellite Cadastral Map Viewer
                </span>
                <span className="text-slate-600">::</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  SOP-02 / Geofence
                </span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{polygonData?.title || 'Farm Boundary Viewer'}</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  ({polygonData?.surveyNumber})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'map' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite Canvas
              </button>
              <button
                onClick={() => setActiveTab('vertices')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'vertices' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Vertex Editor ({editingVertices.length})
              </button>
              <button
                onClick={() => setActiveTab('geojson')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'geojson' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                GeoJSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Land Parcel KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Acreage</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {computedAcres} Acres
                <span className="text-xs font-normal text-slate-400 ml-1">
                  ({computedGunthas} Gunthas)
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">7/12 Land Title</div>
              <div className="text-slate-200 font-medium truncate font-mono">
                {polygonData?.surveyNumber}
              </div>
              <div className="text-[10px] text-slate-500">
                {polygonData?.village}, {polygonData?.taluka}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Soil & Irrigation</div>
              <div className="text-slate-300 font-medium truncate">
                {polygonData?.soilType || 'Black Loam'}
              </div>
              <div className="text-[10px] text-teal-400 truncate">
                {polygonData?.irrigationSource || 'Drip Irrigation'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Verification Status</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {polygonData?.verifiedByAdmin ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" /> GPS Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" /> Pending Survey
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1: Satellite Map Canvas */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              {/* Controls bar over map */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-300">
                    Satellite Farm Terrain & Boundary Geofence
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                    <input
                      type="checkbox"
                      checked={showSatelliteGrid}
                      onChange={(e) => setShowSatelliteGrid(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
                    />
                    <span>Cadastral Grid Overlay</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-teal-400">
                    {mouseCoord ? `Lat: ${mouseCoord.lat}, Lng: ${mouseCoord.lng}` : `Center: ${polygonData?.center?.join(', ')}`}
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 2))}
                    className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
                    className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Satellite Canvas Viewport */}
              <div
                className="relative w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-[#0c1815] shadow-inner select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  const lat = (16.715 + (1 - y) * 0.012).toFixed(5);
                  const lng = (74.258 + x * 0.015).toFixed(5);
                  setMouseCoord({ lat, lng });
                }}
                onMouseLeave={() => setMouseCoord(null)}
              >
                {/* Simulated High-Res Satellite Texture with agricultural contours */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none transition-transform duration-200"
                  style={{
                    backgroundImage: `radial-gradient(#1e4d3b 1px, transparent 1px), radial-gradient(#15382b 1px, transparent 1px), linear-gradient(135deg, #091a13 0%, #102d21 50%, #0c2017 100%)`,
                    backgroundSize: `${30 * zoomLevel}px ${30 * zoomLevel}px, ${60 * zoomLevel}px ${60 * zoomLevel}px, cover`
                  }}
                />

                {/* Cadastral farm field boundaries grid */}
                {showSatelliteGrid && (
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)`,
                      backgroundSize: `${50 * zoomLevel}px ${50 * zoomLevel}px`
                    }}
                  />
                )}

                {/* SVG Polygon Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 600 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="farmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Neighboring plot faint boundaries */}
                  <polygon
                    points="30,50 180,40 160,180 20,160"
                    fill="none"
                    stroke="#1e3a2f"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <polygon
                    points="420,60 580,80 560,240 400,210"
                    fill="none"
                    stroke="#1e3a2f"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <polygon
                    points="120,310 280,330 260,390 100,380"
                    fill="none"
                    stroke="#1e3a2f"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Main Farm Geofence Polygon */}
                  <polygon
                    points={renderSvgPolygon()}
                    fill="url(#farmGrad)"
                    stroke="#10b981"
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="cursor-pointer transition-all hover:stroke-emerald-300"
                  />

                  {/* Vertex Points & Labels */}
                  {editingVertices.map((v, i) => {
                    const lats = editingVertices.map((p) => p.lat);
                    const lngs = editingVertices.map((p) => p.lng);
                    const minLat = Math.min(...lats);
                    const maxLat = Math.max(...lats);
                    const minLng = Math.min(...lngs);
                    const maxLng = Math.max(...lngs);
                    const latSpan = maxLat - minLat || 0.001;
                    const lngSpan = maxLng - minLng || 0.001;

                    const x = 70 + ((v.lng - minLng) / lngSpan) * 460;
                    const y = 350 - ((v.lat - minLat) / latSpan) * 280;

                    return (
                      <g key={i} className="cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#34d399"
                          stroke="#064e3b"
                          strokeWidth="2"
                        />
                        <text
                          x={x + 10}
                          y={y + 4}
                          fill="#ecfdf5"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                          filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.8))"
                        >
                          {v.label || `P${i + 1}`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Centroid Pin Marker */}
                  <g transform="translate(300, 200)">
                    <circle r="4" fill="#fbbf24" />
                    <circle r="12" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                    <text
                      x="0"
                      y="-12"
                      textAnchor="middle"
                      fill="#fef3c7"
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight="600"
                    >
                      {polygonData.surveyNumber} ({computedAcres} Ac)
                    </text>
                  </g>
                </svg>

                {/* Map Compass & Scale Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-sm p-2 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400 animate-pulse" />
                  <div>
                    <div>Bearing: N 00° E</div>
                    <div className="text-slate-500">WGS84 EPSG:4326</div>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-400">
                  Cadastral Scale: 1 cm = 20 m
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Vertex Coordinate Table Editor */}
          {activeTab === 'vertices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Boundary Polygon Vertices (GPS Coordinates)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust coordinate pairs (WGS84 Latitude & Longitude) to reshape the farm boundary.
                  </p>
                </div>
                <button
                  onClick={handleAddVertex}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Boundary Vertex</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-4 w-12">#</th>
                      <th className="py-2.5 px-4 w-44">Vertex Identifier</th>
                      <th className="py-2.5 px-4">Latitude (° N)</th>
                      <th className="py-2.5 px-4">Longitude (° E)</th>
                      <th className="py-2.5 px-4 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {editingVertices.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-mono font-bold text-teal-400">
                          {i + 1}
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={v.label}
                            onChange={(e) => handleVertexChange(i, 'label', e.target.value)}
                            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-white w-full focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            step="0.0001"
                            value={v.lat}
                            onChange={(e) => handleVertexChange(i, 'lat', e.target.value)}
                            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-white w-full focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            step="0.0001"
                            value={v.lng}
                            onChange={(e) => handleVertexChange(i, 'lng', e.target.value)}
                            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-white w-full focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteVertex(i)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                            title="Remove vertex"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GeoJSON Explorer */}
          {activeTab === 'geojson' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Standard GeoJSON Feature Geometry (RFC 7946)
                </span>
                <button
                  onClick={handleExportGeoJson}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .geojson</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 max-h-[300px] overflow-y-auto">
                {JSON.stringify(
                  {
                    type: 'Feature',
                    properties: {
                      userId: user.uid,
                      userName: user.name,
                      title: polygonData.title,
                      surveyNumber: polygonData.surveyNumber,
                      acreage: computedAcres,
                      gunthas: computedGunthas
                    },
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        [
                          ...editingVertices.map((v) => [v.lng, v.lat]),
                          editingVertices[0] ? [editingVertices[0].lng, editingVertices[0].lat] : []
                        ]
                      ]
                    }
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* Mandatory Administrative Reason Input for Audit Log */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Administrative Audit Reason (Mandatory for Geofence Override):</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder="e.g. Ground cadastral survey verified with Maharashtra 7/12 Gat No. 412/A deed..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <div className="text-[11px] text-slate-500">
              Saving writes an immutable record to <code className="text-slate-400">audit_logs</code> with Admin ID <span className="text-teal-400">{currentAdmin.email}</span>.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handleExportGeoJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Boundary</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePolygon}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-md shadow-teal-950/50 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Boundary...' : 'Save & Verify Boundary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
