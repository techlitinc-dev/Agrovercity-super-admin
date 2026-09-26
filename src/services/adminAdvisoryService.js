// Admin AI Advisory, Disease Scan & Pest Radar Service for AGROVERCITY Superadmin
// Implements Module 11: AI Advisory, Disease Scan & Pest Radar (SOP-11)
// Target Collections: advisory_scans, pest_alerts, soil_tests, crop_cycles, npk_config, audit_logs

import { mockAdvisoryScans, mockPestAlerts, mockSoilTests, NPK_CONFIG } from '../api/mockData';

const SCANS_STORAGE_KEY = 'agrovercity_superadmin_advisory_scans';
const ALERTS_STORAGE_KEY = 'agrovercity_superadmin_pest_alerts';
const SOIL_STORAGE_KEY = 'agrovercity_superadmin_soil_tests';
const CYCLES_STORAGE_KEY = 'agrovercity_superadmin_crop_cycles';
const NPK_STORAGE_KEY = 'agrovercity_superadmin_npk_config';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

export const INITIAL_CROP_CYCLES = [
  {
    id: 'CYC-101',
    district: 'Nashik',
    crop: 'Onion (Nashik Red)',
    season: 'Kharif 2026',
    acreageSown: 42500,
    targetMarketCapacityAcres: 36000,
    saturationIndexPercent: 118,
    priceRiskStatus: 'critical_oversupply',
    recommendedSubstitution: 'Gram / Chickpea (Vijay)',
    expectedYieldPerAcre: '110 Quintals',
    status: 'flagged_oversupply',
    updatedAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 'CYC-102',
    district: 'Pune',
    crop: 'Sugarcane (Co 86032)',
    season: 'Adsali 2026',
    acreageSown: 88500,
    targetMarketCapacityAcres: 92000,
    saturationIndexPercent: 96,
    priceRiskStatus: 'balanced',
    recommendedSubstitution: 'Maize (African Tall)',
    expectedYieldPerAcre: '48 Tons',
    status: 'balanced',
    updatedAt: '2026-09-18T14:30:00.000Z'
  },
  {
    id: 'CYC-103',
    district: 'Jalgaon',
    crop: 'Cotton (Bt RCH-2)',
    season: 'Kharif 2026',
    acreageSown: 76000,
    targetMarketCapacityAcres: 80000,
    saturationIndexPercent: 95,
    priceRiskStatus: 'balanced',
    recommendedSubstitution: 'Tur / Pigeon Pea',
    expectedYieldPerAcre: '14 Quintals',
    status: 'balanced',
    updatedAt: '2026-09-15T09:20:00.000Z'
  },
  {
    id: 'CYC-104',
    district: 'Nashik',
    crop: 'Grapes (Thompson Seedless)',
    season: 'Annual 2026',
    acreageSown: 32800,
    targetMarketCapacityAcres: 31000,
    saturationIndexPercent: 106,
    priceRiskStatus: 'moderate_risk',
    recommendedSubstitution: 'Pomegranate (Bhagwa)',
    expectedYieldPerAcre: '8.5 Tons',
    status: 'moderate_risk',
    updatedAt: '2026-09-19T11:45:00.000Z'
  },
  {
    id: 'CYC-105',
    district: 'Ahmednagar',
    crop: 'Soybean (JS-335)',
    season: 'Kharif 2026',
    acreageSown: 64200,
    targetMarketCapacityAcres: 68000,
    saturationIndexPercent: 94,
    priceRiskStatus: 'high_demand',
    recommendedSubstitution: 'Sorghum (Maldandi)',
    expectedYieldPerAcre: '11.5 Quintals',
    status: 'balanced',
    updatedAt: '2026-09-17T16:00:00.000Z'
  },
  {
    id: 'CYC-106',
    district: 'Solapur',
    crop: 'Pomegranate (Bhagwa)',
    season: 'Mrug Bahar 2026',
    acreageSown: 18500,
    targetMarketCapacityAcres: 16000,
    saturationIndexPercent: 115,
    priceRiskStatus: 'critical_oversupply',
    recommendedSubstitution: 'Custard Apple (Balanagar)',
    expectedYieldPerAcre: '6.2 Tons',
    status: 'flagged_oversupply',
    updatedAt: '2026-09-21T08:15:00.000Z'
  }
];

export const INITIAL_ADVISORY_AUDIT_LOGS = [
  {
    id: 'AUD-1101',
    adminUid: 'root@agrovercity',
    action: 'PEST_ALERT_BROADCASTED',
    targetUserId: 'REG-NASHIK-DISTRICT',
    targetUserName: 'Fall Armyworm (Spodoptera frugiperda)',
    previousState: 'Unannounced pest outbreak alert',
    newState: 'Broadcasted 45km geofenced alert across Dindori; notified 4,820 farmers',
    reason: 'Trap catches exceeded economic threshold levels (ETL > 8 moths/trap/night) verified by KVK entomologist.',
    timestamp: '2026-09-20T10:15:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1102',
    adminUid: 'root@agrovercity',
    action: 'SCAN_MARKED_FALSE_POSITIVE',
    targetUserId: 'usr_c410',
    targetUserName: 'Mahadev Shinde (scn_4003)',
    previousState: 'Scan status: confirmed (Purple Blotch diagnosis)',
    newState: 'Scan status: false_positive (Attributed to cnn-leafnet-v4.1 miss)',
    reason: 'Agronomist microscopic inspection showed magnesium deficiency speckles rather than Alternaria porri fungal lesions.',
    timestamp: '2026-09-19T14:40:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1103',
    adminUid: 'root@agrovercity',
    action: 'SOIL_TEST_RESULTS_UPLOADED',
    targetUserId: 'usr_a91f',
    targetUserName: 'Ram Patil (SOIL/NSK/2026/1101)',
    previousState: 'Soil test status: lab_processing',
    newState: 'Soil test status: result_uploaded (NPK: 210:18:240 kg/ha, pH: 7.2)',
    reason: 'Verified certified lab test report from MahaBhumi Soil Lab; automated ICAR fertilizer recommendation dispatched.',
    timestamp: '2026-09-18T16:20:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1104',
    adminUid: 'root@agrovercity',
    action: 'NPK_ALGORITHM_CONFIGURED',
    targetUserId: 'ALGO-ICAR-NPK',
    targetUserName: 'ICAR Algorithm Calibration v3.1',
    previousState: 'soilTestCropResponse: 0.85',
    newState: 'soilTestCropResponse: 0.90; saturationElasticity: 0.62',
    reason: 'Calibrated crop response weight according to Indian Council of Agricultural Research revised black soil norms.',
    timestamp: '2026-09-16T11:00:00.000Z',
    ipAddress: '14.139.122.9'
  }
];

function getStored(key, seed) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return seed;
  }
}

function save(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function recordAuditLog({
  adminUid = 'root@agrovercity',
  action,
  targetUserId,
  targetUserName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'ADVISORY_SYSTEM',
    targetUserName: targetUserName || 'AI Advisory Radar',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'AI Advisory administrative intervention via Superadmin Console (SOP-11)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

function paginate(items, page, limit) {
  const total = items.length;
  const startIndex = (page - 1) * limit;
  return {
    records: items.slice(startIndex, startIndex + limit),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

function matchesQuery(item, q, fields) {
  return fields.some((f) => String(item[f] || '').toLowerCase().includes(q));
}

export const adminAdvisoryService = {
  // 1. Audit disease scans and confidence metrics (GET /v1/admin/advisory/scans)
  async listScans({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let scans = getStored(SCANS_STORAGE_KEY, mockAdvisoryScans);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      scans = scans.filter((s) =>
        matchesQuery(s, q, ['id', 'farmerName', 'farmerPhone', 'crop', 'district', 'diagnosis', 'modelVersion'])
      );
    }

    if (status && status !== 'all') {
      scans = scans.filter((s) => s.status === status);
    }

    const { records, pagination } = paginate(scans, page, limit);
    return { success: true, data: { scans: records, pagination } };
  },

  // 2. Update scan status (e.g. false positive confirmation)
  async updateScanStatus({ scanId, status, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative explanation (min 8 characters) is required for audit trail.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const scans = getStored(SCANS_STORAGE_KEY, mockAdvisoryScans);
    const index = scans.findIndex((s) => s.id === scanId);
    if (index === -1) throw new Error(`Scan ${scanId} not found`);

    const scan = scans[index];
    const prevStatus = scan.status;

    scan.status = status;
    scan.updatedAt = new Date().toISOString();
    if (status === 'false_positive') {
      scan.farmerFeedback = 'false_positive';
      scan.falsePositiveReason = reason.trim();
    }

    scans[index] = scan;
    save(SCANS_STORAGE_KEY, scans);

    const audit = recordAuditLog({
      adminUid,
      action: status === 'false_positive' ? 'SCAN_MARKED_FALSE_POSITIVE' : 'SCAN_STATUS_OVERRIDDEN',
      targetUserId: scan.userId,
      targetUserName: `${scan.farmerName} (${scan.diagnosis})`,
      previousState: `Scan ${scan.id} status: ${prevStatus}`,
      newState: `Scan ${scan.id} status: ${status} (Model: ${scan.modelVersion})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Scan ${scanId} status updated to ${status}.`,
      scan,
      auditRecord: audit
    };
  },

  // 3. Broadcast geofenced pest outbreak radar alert (POST /v1/admin/advisory/pest-alerts)
  async broadcastPestAlert({
    pestName,
    district,
    severity = 'moderate',
    crop = 'All Crops',
    radiusKm = 50,
    message,
    scheduledFor,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!pestName || !pestName.trim()) throw new Error('Pest or disease scientific/common name is required.');
    if (!district || !district.trim()) throw new Error('Target outbreak district is required.');
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative reason (min 8 characters) is required for broadcast authorization.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const alerts = getStored(ALERTS_STORAGE_KEY, mockPestAlerts);
    const newId = `alr_${Date.now().toString().slice(-4)}`;

    const newAlert = {
      id: newId,
      status: scheduledFor ? 'scheduled' : 'active',
      pestName: pestName.trim(),
      district: district.trim(),
      radiusKm: Number(radiusKm) || 50,
      severity,
      crop: crop.trim() || 'All Crops',
      message: message?.trim() || `Advisory: ${pestName} outbreak reported in ${district}. Follow ICAR management schedule.`,
      broadcastAt: scheduledFor || new Date().toISOString(),
      broadcastBy: adminUid,
      recipientsNotified: scheduledFor ? 0 : Math.floor(2500 + Math.random() * 6000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    save(ALERTS_STORAGE_KEY, [newAlert, ...alerts]);

    const audit = recordAuditLog({
      adminUid,
      action: 'PEST_ALERT_BROADCASTED',
      targetUserId: `DISTRICT-${newAlert.district.toUpperCase()}`,
      targetUserName: `${newAlert.pestName} (${newAlert.district})`,
      previousState: 'Non-existent pest alert',
      newState: `Broadcasted alert ${newAlert.id} [${newAlert.severity}, Radius: ${newAlert.radiusKm}km, Reach: ${newAlert.recipientsNotified} farmers]`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Pest alert ${newAlert.id} for ${newAlert.pestName} broadcasted to ${newAlert.recipientsNotified.toLocaleString('en-IN')} farmers in ${newAlert.district}.`,
      alert: newAlert,
      auditRecord: audit
    };
  },

  // 4. List pest alerts
  async listPestAlerts({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 70));
    let alerts = getStored(ALERTS_STORAGE_KEY, mockPestAlerts);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      alerts = alerts.filter((a) =>
        matchesQuery(a, q, ['id', 'pestName', 'district', 'crop', 'message', 'severity'])
      );
    }

    if (status && status !== 'all') {
      alerts = alerts.filter((a) => a.status === status);
    }

    const { records, pagination } = paginate(alerts, page, limit);
    return { success: true, data: { alerts: records, pagination } };
  },

  // 5. List soil tests (GET /v1/admin/soil-tests)
  async listSoilTests({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 70));
    let tests = getStored(SOIL_STORAGE_KEY, mockSoilTests);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      tests = tests.filter((t) =>
        matchesQuery(t, q, ['id', 'farmerName', 'farmerPhone', 'district', 'surveyNo', 'sampleCode', 'labName'])
      );
    }

    if (status && status !== 'all') {
      tests = tests.filter((t) => t.status === status);
    }

    const { records, pagination } = paginate(tests, page, limit);
    return { success: true, data: { tests: records, pagination } };
  },

  // 6. Upload laboratory soil test results (POST /v1/admin/soil-tests/{id}/results)
  async uploadSoilResults({
    testId,
    nitrogen,
    phosphorus,
    potassium,
    ph,
    organicCarbon,
    recommendation,
    reportUrl,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative reason (min 8 characters) is required for certified soil test upload.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const tests = getStored(SOIL_STORAGE_KEY, mockSoilTests);
    const index = tests.findIndex((t) => t.id === testId);
    if (index === -1) throw new Error(`Soil test ${testId} not found`);

    const test = tests[index];
    const prevStatus = test.status;

    test.status = 'result_uploaded';
    test.nitrogen = Number(nitrogen) || 0;
    test.phosphorus = Number(phosphorus) || 0;
    test.potassium = Number(potassium) || 0;
    test.ph = Number(ph) || 7.0;
    test.organicCarbon = Number(organicCarbon) || 0.5;
    test.recommendation = recommendation?.trim() || 'Follow ICAR balanced NPK schedule';
    test.reportUrl = reportUrl?.trim() || `gs://agrovercity-soil/2026/${test.id}.pdf`;
    test.uploadedAt = new Date().toISOString();
    test.updatedAt = new Date().toISOString();

    tests[index] = test;
    save(SOIL_STORAGE_KEY, tests);

    const audit = recordAuditLog({
      adminUid,
      action: 'SOIL_TEST_RESULTS_UPLOADED',
      targetUserId: test.userId,
      targetUserName: `${test.farmerName} (${test.sampleCode})`,
      previousState: `Soil test ${test.id} status: ${prevStatus}`,
      newState: `Soil test ${test.id} status: result_uploaded (NPK: ${test.nitrogen}:${test.phosphorus}:${test.potassium} kg/ha, pH: ${test.ph})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Soil test results for sample ${test.sampleCode} uploaded and farmer notified.`,
      test,
      auditRecord: audit
    };
  },

  // 7. Book a new soil test sample
  async bookSoilTest(testData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 140));
    const tests = getStored(SOIL_STORAGE_KEY, mockSoilTests);
    const newId = `st_${Date.now().toString().slice(-4)}`;

    const newTest = {
      id: newId,
      status: 'sample_collected',
      userId: testData.userId || `usr_${Date.now().toString().slice(-4)}`,
      farmerName: testData.farmerName?.trim() || 'Farmland Owner',
      farmerPhone: testData.farmerPhone?.trim() || '+91 98000 00000',
      district: testData.district?.trim() || 'Nashik',
      surveyNo: testData.surveyNo?.trim() || '0000/1/00',
      sampleCode: `SOIL/${testData.district?.slice(0, 3).toUpperCase() || 'NSK'}/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      collectedAt: new Date().toISOString().slice(0, 10),
      labName: testData.labName || 'ICAR Regional Soil Lab',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    save(SOIL_STORAGE_KEY, [newTest, ...tests]);

    const audit = recordAuditLog({
      adminUid,
      action: 'SOIL_TEST_SAMPLE_BOOKED',
      targetUserId: newTest.userId,
      targetUserName: `${newTest.farmerName} (${newTest.sampleCode})`,
      previousState: 'Non-existent soil test',
      newState: `Booked sample ${newTest.sampleCode} at ${newTest.labName}`,
      reason: 'Soil health card test booked via Superadmin Console (SOP-11 §3)'
    });

    return {
      success: true,
      message: `Soil test sample ${newTest.sampleCode} booked successfully.`,
      test: newTest,
      auditRecord: audit
    };
  },

  // 8. List Market Saturation & Crop Cycles (crop_cycles)
  async listCropCycles({ query = '', district = 'all', status = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 70));
    let cycles = getStored(CYCLES_STORAGE_KEY, INITIAL_CROP_CYCLES);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      cycles = cycles.filter((c) =>
        matchesQuery(c, q, ['id', 'district', 'crop', 'season', 'recommendedSubstitution', 'priceRiskStatus'])
      );
    }

    if (district && district !== 'all') {
      cycles = cycles.filter((c) => c.district.toLowerCase() === district.toLowerCase());
    }

    if (status && status !== 'all') {
      cycles = cycles.filter((c) => c.status === status);
    }

    return { success: true, data: { cycles } };
  },

  // 9. Update Crop Cycle Substitution & Saturation Threshold
  async updateCropCycleSubstitution({
    cycleId,
    saturationIndexPercent,
    recommendedSubstitution,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative rationale (min 8 characters) is required for crop substitution model audit.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const cycles = getStored(CYCLES_STORAGE_KEY, INITIAL_CROP_CYCLES);
    const index = cycles.findIndex((c) => c.id === cycleId);
    if (index === -1) throw new Error(`Crop cycle ${cycleId} not found`);

    const cycle = cycles[index];
    const prevSub = cycle.recommendedSubstitution;

    if (saturationIndexPercent !== undefined) {
      cycle.saturationIndexPercent = Number(saturationIndexPercent);
      cycle.status = cycle.saturationIndexPercent > 110 ? 'flagged_oversupply' : 'balanced';
    }
    if (recommendedSubstitution) {
      cycle.recommendedSubstitution = recommendedSubstitution.trim();
    }
    cycle.updatedAt = new Date().toISOString();

    cycles[index] = cycle;
    save(CYCLES_STORAGE_KEY, cycles);

    const audit = recordAuditLog({
      adminUid,
      action: 'MARKET_SATURATION_AUDITED',
      targetUserId: `DISTRICT-${cycle.district.toUpperCase()}`,
      targetUserName: `${cycle.district} ${cycle.crop}`,
      previousState: `Sub: ${prevSub}`,
      newState: `Sub: ${cycle.recommendedSubstitution}; Saturation: ${cycle.saturationIndexPercent}%; Status: ${cycle.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Crop cycle ${cycleId} updated. Recommended substitution: ${cycle.recommendedSubstitution}.`,
      cycle,
      auditRecord: audit
    };
  },

  // 10. Get and Update ICAR NPK Algorithm Configuration
  async getNpkConfig() {
    await new Promise((r) => setTimeout(r, 50));
    return getStored(NPK_STORAGE_KEY, NPK_CONFIG);
  },

  async updateNpkConfig({ paramKey, newValue, configData, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification (min 4 characters) is required to reconfigure ICAR NPK parameters.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const config = getStored(NPK_STORAGE_KEY, NPK_CONFIG);

    if (configData) {
      const prevVer = config.algorithmVersion;
      if (configData.algorithmVersion) config.algorithmVersion = configData.algorithmVersion;
      if (configData.reviewedBy) config.reviewedBy = configData.reviewedBy;
      if (configData.complianceStandard) config.complianceStandard = configData.complianceStandard;
      if (Array.isArray(configData.params)) {
        config.params = configData.params;
      }
      config.lastReviewedAt = new Date().toISOString();
      save(NPK_STORAGE_KEY, config);

      const audit = recordAuditLog({
        adminUid,
        action: 'NPK_CONFIG_UPDATED',
        targetUserId: 'ALGO-ICAR-NPK',
        targetUserName: `ICAR STCR Framework (${config.algorithmVersion})`,
        previousState: `Version: ${prevVer}`,
        newState: `Version: ${config.algorithmVersion} (${config.params.length} parameters calibrated)`,
        reason: reason.trim()
      });

      return {
        success: true,
        message: `ICAR NPK algorithm configuration updated successfully.`,
        config,
        auditRecord: audit
      };
    }

    const param = config.params.find((p) => p.key === paramKey);
    if (!param) throw new Error(`Parameter ${paramKey} not found in NPK config`);

    const prevValue = param.value;
    param.value = Number(newValue);
    config.lastReviewedAt = new Date().toISOString();

    save(NPK_STORAGE_KEY, config);

    const audit = recordAuditLog({
      adminUid,
      action: 'NPK_CONFIG_UPDATED',
      targetUserId: 'ALGO-ICAR-NPK',
      targetUserName: `ICAR Parameter: ${paramKey}`,
      previousState: `${paramKey}: ${prevValue}`,
      newState: `${paramKey}: ${param.value} (Version: ${config.algorithmVersion})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `NPK parameter ${paramKey} updated to ${param.value}.`,
      config,
      auditRecord: audit
    };
  },

  // 11. List statutory audit logs for Advisory module
  async listAdvisoryAuditLogs({ query = '', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let logs = getStoredAuditLogs();

    if (logs.length === 0) {
      logs = INITIAL_ADVISORY_AUDIT_LOGS;
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }

    const advisoryKeywords = ['SCAN', 'PEST', 'ALERT', 'SOIL', 'NPK', 'SATURATION', 'DIAGNOSIS', 'RADAR'];
    let filtered = logs.filter((log) =>
      advisoryKeywords.some((kw) => (log.action || '').toUpperCase().includes(kw))
    );

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((log) =>
        (log.id && log.id.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.targetUserName && log.targetUserName.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q)) ||
        (log.adminUid && log.adminUid.toLowerCase().includes(q))
      );
    }

    const { records, pagination } = paginate(filtered, page, limit);
    return { success: true, data: { auditLogs: records, pagination } };
  },

  // 12. Compute module KPIs
  async getAdvisoryKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const scans = getStored(SCANS_STORAGE_KEY, mockAdvisoryScans);
    const alerts = getStored(ALERTS_STORAGE_KEY, mockPestAlerts);
    const soil = getStored(SOIL_STORAGE_KEY, mockSoilTests);
    const cycles = getStored(CYCLES_STORAGE_KEY, INITIAL_CROP_CYCLES);

    const feedbackableScans = scans.filter((s) => s.farmerFeedback !== 'pending');
    const falsePositives = scans.filter((s) => s.farmerFeedback === 'false_positive');
    const accuracyPercent = feedbackableScans.length > 0
      ? Math.round(((feedbackableScans.length - falsePositives.length) / feedbackableScans.length) * 100)
      : 94;

    const activeAlerts = alerts.filter((a) => a.status === 'active');
    const totalFarmersNotified = alerts.reduce((acc, a) => acc + (a.recipientsNotified || 0), 0);
    const pendingSoil = soil.filter((t) => t.status === 'sample_collected' || t.status === 'lab_processing');
    const uploadedSoil = soil.filter((t) => t.status === 'result_uploaded');
    const oversupplyCycles = cycles.filter((c) => c.status === 'flagged_oversupply');

    return {
      totalScansCount: scans.length,
      confirmedScansCount: scans.filter((s) => s.status === 'confirmed').length,
      falsePositivesCount: falsePositives.length,
      diagnosisAccuracyPercent: accuracyPercent,
      activeAlertsCount: activeAlerts.length,
      totalFarmersNotified,
      pendingSoilTestsCount: pendingSoil.length,
      uploadedSoilTestsCount: uploadedSoil.length,
      flaggedOversupplyCyclesCount: oversupplyCycles.length,
      totalCropCyclesCount: cycles.length
    };
  },

  // 13. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(mockAdvisoryScans));
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(mockPestAlerts));
    localStorage.setItem(SOIL_STORAGE_KEY, JSON.stringify(mockSoilTests));
    localStorage.setItem(CYCLES_STORAGE_KEY, JSON.stringify(INITIAL_CROP_CYCLES));
    localStorage.setItem(NPK_STORAGE_KEY, JSON.stringify(NPK_CONFIG));
    return { success: true };
  }
};
