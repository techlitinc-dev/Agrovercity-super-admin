const day = (n, h = 6) => {
  const d = new Date('2026-09-20T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - n)
  d.setUTCHours(h, 15, 0, 0)
  return d.toISOString()
}

export const mockContracts = [
  { id: 'ctx_1001', status: 'active', buyerName: 'ITC Limited', buyerType: 'institutional', farmerId: 'usr_a91f', farmerName: 'Ram Patil', farmerPhone: '+919822012345', crop: 'Soybean', grade: 'A', quantityQuintals: 120, ratePerQuintal: 5250, escrowAmount: 630000, escrowReleased: 210000, acceptanceDeadline: '2026-10-05', deliveryDate: '2026-11-15', flagged: false, createdAt: day(12), updatedAt: day(1) },
  { id: 'ctx_1002', status: 'pending_review', buyerName: 'Reliance Retail', buyerType: 'institutional', farmerId: 'usr_b773', farmerName: 'Suresh Jadhav', farmerPhone: '+919822098765', crop: 'Wheat', grade: 'B', quantityQuintals: 200, ratePerQuintal: 2450, escrowAmount: 490000, escrowReleased: 0, acceptanceDeadline: '2026-10-01', deliveryDate: '2026-12-01', flagged: false, createdAt: day(3), updatedAt: day(2) },
  { id: 'ctx_1003', status: 'disputed', buyerName: 'Adani Agri Logistics', buyerType: 'institutional', farmerId: 'usr_c410', farmerName: 'Mahadev Shinde', farmerPhone: '+919822055588', crop: 'Cotton', grade: 'A', quantityQuintals: 85, ratePerQuintal: 7100, escrowAmount: 603500, escrowReleased: 0, acceptanceDeadline: '2026-09-25', deliveryDate: '2026-10-30', flagged: true, disputeReason: 'Quality rejection — buyer claims moisture above contract limit', createdAt: day(8), updatedAt: day(0, 4) },
  { id: 'ctx_1004', status: 'published', buyerName: 'ITC Limited', buyerType: 'institutional', farmerId: 'usr_d205', farmerName: 'Vitthal Kale', farmerPhone: '+919822077733', crop: 'Onion', grade: 'A', quantityQuintals: 300, ratePerQuintal: 1850, escrowAmount: 555000, escrowReleased: 0, acceptanceDeadline: '2026-09-28', deliveryDate: '2026-11-20', flagged: false, createdAt: day(2), updatedAt: day(1) },
  { id: 'ctx_1005', status: 'fulfilled', buyerName: 'Reliance Retail', buyerType: 'institutional', farmerId: 'usr_e881', farmerName: 'Gopal Deshmukh', farmerPhone: '+919822031122', crop: 'Maize', grade: 'B', quantityQuintals: 150, ratePerQuintal: 2100, escrowAmount: 315000, escrowReleased: 315000, acceptanceDeadline: '2026-08-15', deliveryDate: '2026-09-05', flagged: false, createdAt: day(35), updatedAt: day(6) },
  { id: 'ctx_1006', status: 'breached', buyerName: 'Adani Agri Logistics', buyerType: 'institutional', farmerId: 'usr_f119', farmerName: 'Shanta Bai Pawar', farmerPhone: '+919822099001', crop: 'Tur', grade: 'A', quantityQuintals: 60, ratePerQuintal: 8300, escrowAmount: 498000, escrowReleased: 0, acceptanceDeadline: '2026-08-30', deliveryDate: '2026-09-18', flagged: true, disputeReason: 'Delivery delay beyond milestone window', createdAt: day(40), updatedAt: day(4) },
  { id: 'ctx_1007', status: 'draft', buyerName: 'ITC Limited', buyerType: 'institutional', farmerId: 'usr_g552', farmerName: 'Nitin More', farmerPhone: '+919822024680', crop: 'Gram', grade: 'A', quantityQuintals: 90, ratePerQuintal: 5600, escrowAmount: 504000, escrowReleased: 0, acceptanceDeadline: '2026-10-10', deliveryDate: '2026-12-15', flagged: false, createdAt: day(1), updatedAt: day(0, 2) },
  { id: 'ctx_1008', status: 'active', buyerName: 'Reliance Retail', buyerType: 'institutional', farmerId: 'usr_h937', farmerName: 'Kailas Wagh', farmerPhone: '+919822061357', crop: 'Groundnut', grade: 'B', quantityQuintals: 45, ratePerQuintal: 6400, escrowAmount: 288000, escrowReleased: 96000, acceptanceDeadline: '2026-10-02', deliveryDate: '2026-11-25', flagged: false, createdAt: day(9), updatedAt: day(0, 7) },
]

export const mockAcceptances = {
  ctx_1001: [
    { id: 'acc_5001', contractId: 'ctx_1001', farmerId: 'usr_a91f', farmerName: 'Ram Patil', farmerPhone: '+919822012345', status: 'signed', signedAt: day(10), mpinVerified: true },
  ],
  ctx_1004: [
    { id: 'acc_5002', contractId: 'ctx_1004', farmerId: 'usr_d205', farmerName: 'Vitthal Kale', farmerPhone: '+919822077733', status: 'signed', signedAt: day(1), mpinVerified: true },
  ],
  ctx_1008: [
    { id: 'acc_5003', contractId: 'ctx_1008', farmerId: 'usr_h937', farmerName: 'Kailas Wagh', farmerPhone: '+919822061357', status: 'signed', signedAt: day(7), mpinVerified: true },
  ],
  ctx_1005: [
    { id: 'acc_5004', contractId: 'ctx_1005', farmerId: 'usr_e881', farmerName: 'Gopal Deshmukh', farmerPhone: '+919822031122', status: 'signed', signedAt: day(33), mpinVerified: true },
  ],
}

export const AUDIT_LOG_ENTRIES = (contract, previousState, newState, reason) => [
  { id: `aud_${contract.id}`, adminUid: 'root@agrovercity', timestamp: new Date().toISOString(), action: 'STATUS_CHANGE', previousState, newState, reason, ipAddress: '10.0.0.4' },
]

export const mockLandListings = [
  { id: 'lst_2001', status: 'available', landlordId: 'usr_a91f', landlordName: 'Ram Patil', landlordPhone: '+919822012345', district: 'Nashik', taluka: 'Dindori', surveyNo: '0712/2/34', areaAcres: 5.5, expectedRentPerAcre: 22000, cropSuitability: ['Soybean', 'Gram'], soilType: 'Black Cotton', waterSource: 'Borewell', sevenTwelveVerified: true, flagged: false, createdAt: day(11), updatedAt: day(1) },
  { id: 'lst_2002', status: 'pending_audit', landlordId: 'usr_b773', landlordName: 'Suresh Jadhav', landlordPhone: '+919822098765', district: 'Pune', taluka: 'Baramati', surveyNo: '0912/1/08', areaAcres: 12, expectedRentPerAcre: 18000, cropSuitability: ['Sugarcane', 'Wheat'], soilType: 'Medium Black', waterSource: 'Canal', sevenTwelveVerified: false, flagged: false, createdAt: day(3), updatedAt: day(2) },
  { id: 'lst_2003', status: 'flagged', landlordId: 'usr_c410', landlordName: 'Mahadev Shinde', landlordPhone: '+919822055588', district: 'Nashik', taluka: 'Sinnar', surveyNo: '0451/3/19', areaAcres: 8.2, expectedRentPerAcre: 25000, cropSuitability: ['Onion', 'Gram'], soilType: 'Black Cotton', waterSource: 'River Lift', sevenTwelveVerified: false, flagged: true, flagReason: 'Survey number does not match 7/12 land record — ownership name mismatch', createdAt: day(9), updatedAt: day(0, 5) },
  { id: 'lst_2004', status: 'leased', landlordId: 'usr_d205', landlordName: 'Vitthal Kale', landlordPhone: '+919822077733', district: 'Ahmednagar', taluka: 'Rahuri', surveyNo: '1188/2/51', areaAcres: 6, expectedRentPerAcre: 15000, cropSuitability: ['Wheat', 'Maize'], soilType: 'Light Black', waterSource: 'Dug Well', sevenTwelveVerified: true, flagged: false, createdAt: day(22), updatedAt: day(4) },
  { id: 'lst_2005', status: 'available', landlordId: 'usr_e881', landlordName: 'Gopal Deshmukh', landlordPhone: '+919822031122', district: 'Pune', taluka: 'Indapur', surveyNo: '2201/4/02', areaAcres: 15, expectedRentPerAcre: 12000, cropSuitability: ['Sorghum', 'Tur'], soilType: 'Rain-fed Medium', waterSource: 'Rain-fed', sevenTwelveVerified: true, flagged: false, createdAt: day(6), updatedAt: day(0, 8) },
  { id: 'lst_2006', status: 'pending_audit', landlordId: 'usr_f119', landlordName: 'Shanta Bai Pawar', landlordPhone: '+919822099001', district: 'Jalgaon', taluka: 'Chopda', surveyNo: '0330/1/77', areaAcres: 4.5, expectedRentPerAcre: 20000, cropSuitability: ['Cotton'], soilType: 'Deep Black', waterSource: 'Borewell', sevenTwelveVerified: false, flagged: false, createdAt: day(1), updatedAt: day(0, 3) },
  { id: 'lst_2007', status: 'removed', landlordId: 'usr_g552', landlordName: 'Nitin More', landlordPhone: '+919822024680', district: 'Nashik', taluka: 'Niphad', surveyNo: '0524/2/40', areaAcres: 3.75, expectedRentPerAcre: 24000, cropSuitability: ['Grapes', 'Onion'], soilType: 'Black Cotton', waterSource: 'Drip + Borewell', sevenTwelveVerified: true, flagged: false, removalReason: 'Landlord withdrew listing — sold to family member', createdAt: day(30), updatedAt: day(7) },
  { id: 'lst_2008', status: 'leased', landlordId: 'usr_h937', landlordName: 'Kailas Wagh', landlordPhone: '+919822061357', district: 'Ahmednagar', taluka: 'Shrirampur', surveyNo: '1671/1/12', areaAcres: 9.5, expectedRentPerAcre: 16500, cropSuitability: ['Sugarcane', 'Wheat'], soilType: 'Deep Black', waterSource: 'Canal', sevenTwelveVerified: true, flagged: false, createdAt: day(16), updatedAt: day(5) },
]

export const mockLandLeases = [
  { id: 'lse_3001', status: 'active', listingId: 'lst_2004', landlordId: 'usr_d205', landlordName: 'Vitthal Kale', landlordPhone: '+919822077733', tenantId: 'usr_a91f', tenantName: 'Ram Patil', tenantPhone: '+919822012345', district: 'Ahmednagar', surveyNo: '1188/2/51', areaAcres: 6, crop: 'Wheat', monthlyRent: 90000, rentDueDay: 5, monthsElapsed: 4, monthsTotal: 24, paymentsOnTime: 4, paymentsOverdue: 0, securityDeposit: 180000, agreementSignedAt: day(120, 10), startDate: '2026-06-01', endDate: '2028-05-31', flagged: false, createdAt: day(20), updatedAt: day(1) },
  { id: 'lse_3002', status: 'active', listingId: 'lst_2008', landlordId: 'usr_h937', landlordName: 'Kailas Wagh', landlordPhone: '+919822061357', tenantId: 'usr_e881', tenantName: 'Gopal Deshmukh', tenantPhone: '+919822031122', district: 'Ahmednagar', surveyNo: '1671/1/12', areaAcres: 9.5, crop: 'Sugarcane', monthlyRent: 156750, rentDueDay: 10, monthsElapsed: 2, monthsTotal: 12, paymentsOnTime: 1, paymentsOverdue: 1, securityDeposit: 300000, agreementSignedAt: day(70, 9), startDate: '2026-08-01', endDate: '2027-07-31', flagged: false, createdAt: day(12), updatedAt: day(0, 7) },
  { id: 'lse_3003', status: 'disputed', listingId: 'lst_2001', landlordId: 'usr_a91f', landlordName: 'Ram Patil', landlordPhone: '+919822012345', tenantId: 'usr_b773', tenantName: 'Suresh Jadhav', tenantPhone: '+919822098765', district: 'Nashik', surveyNo: '0712/2/34', areaAcres: 5.5, crop: 'Soybean', monthlyRent: 121000, rentDueDay: 1, monthsElapsed: 7, monthsTotal: 18, paymentsOnTime: 5, paymentsOverdue: 2, securityDeposit: 240000, agreementSignedAt: day(210, 11), startDate: '2026-03-01', endDate: '2027-08-31', flagged: true, disputeReason: 'Tenant withholding 2 months rent claiming crop failure relief; landlord demands termination and deposit forfeiture', createdAt: day(8), updatedAt: day(0, 4) },
  { id: 'lse_3004', status: 'expiring', listingId: 'lst_2008', landlordId: 'usr_h937', landlordName: 'Kailas Wagh', landlordPhone: '+919822061357', tenantId: 'usr_c410', tenantName: 'Mahadev Shinde', tenantPhone: '+919822055588', district: 'Ahmednagar', surveyNo: '1671/1/12', areaAcres: 9.5, crop: 'Wheat', monthlyRent: 142500, rentDueDay: 15, monthsElapsed: 11, monthsTotal: 12, paymentsOnTime: 11, paymentsOverdue: 0, securityDeposit: 280000, agreementSignedAt: day(350, 8), startDate: '2025-10-01', endDate: '2026-09-30', flagged: false, createdAt: day(40), updatedAt: day(2) },
  { id: 'lse_3005', status: 'terminated', listingId: 'lst_2007', landlordId: 'usr_g552', landlordName: 'Nitin More', landlordPhone: '+919822024680', tenantId: 'usr_d205', tenantName: 'Vitthal Kale', tenantPhone: '+919822077733', district: 'Nashik', surveyNo: '0524/2/40', areaAcres: 3.75, crop: 'Grapes', monthlyRent: 90000, rentDueDay: 5, monthsElapsed: 3, monthsTotal: 24, paymentsOnTime: 3, paymentsOverdue: 0, securityDeposit: 180000, agreementSignedAt: day(160, 10), startDate: '2026-04-01', endDate: '2028-03-31', flagged: true, disputeReason: 'Mutual termination — land sold; deposit refunded in full', createdAt: day(25), updatedAt: day(7) },
  { id: 'lse_3006', status: 'active', listingId: 'lst_2004', landlordId: 'usr_d205', landlordName: 'Vitthal Kale', landlordPhone: '+919822077733', tenantId: 'usr_f119', tenantName: 'Shanta Bai Pawar', tenantPhone: '+919822099001', district: 'Ahmednagar', surveyNo: '1188/2/51', areaAcres: 6, crop: 'Maize', monthlyRent: 75000, rentDueDay: 20, monthsElapsed: 6, monthsTotal: 36, paymentsOnTime: 4, paymentsOverdue: 2, securityDeposit: 150000, agreementSignedAt: day(180, 12), startDate: '2026-04-01', endDate: '2029-03-31', flagged: true, createdAt: day(30), updatedAt: day(1) },
  { id: 'lse_3007', status: 'active', listingId: 'lst_2001', landlordId: 'usr_a91f', landlordName: 'Ram Patil', landlordPhone: '+919822012345', tenantId: 'usr_g552', tenantName: 'Nitin More', tenantPhone: '+919822024680', district: 'Nashik', surveyNo: '0712/2/34', areaAcres: 5.5, crop: 'Onion', monthlyRent: 115000, rentDueDay: 5, monthsElapsed: 9, monthsTotal: 24, paymentsOnTime: 9, paymentsOverdue: 0, securityDeposit: 230000, agreementSignedAt: day(280, 9), startDate: '2026-01-01', endDate: '2027-12-31', flagged: false, createdAt: day(15), updatedAt: day(0, 2) },
]

export const mockLeaseAgreements = {
  lse_3001: { id: 'agr_8001', leaseId: 'lse_3001', language: 'mr', templateVersion: 'v2.3', generatedAt: day(120, 10), clauses: ['करार कालावधी: २४ महिने (01/06/2026 – 31/05/2028)', 'भाडे रक्कम: ₹90,000 प्रति महिना, दरमहा 5 तारखेस', 'जमीन पर्वतफीत (अक्षरशः): सर्वे नं. 1188/2/51, राहुरी, अहमदनगर', 'हमी रक्कम: ₹1,80,000 — करार समाप्तीनंतर 30 दिवसांत परतावा', 'पीक हक्क: गहू व गळीत हळद — केवळ भाडेकरूस पीक काढण्याचा हक्क'], signatures: [{ party: 'landlord', name: 'Vitthal Kale', signedAt: day(120, 10) }, { party: 'tenant', name: 'Ram Patil', signedAt: day(120, 11) }] },
  lse_3003: { id: 'agr_8003', leaseId: 'lse_3003', language: 'mr', templateVersion: 'v2.3', generatedAt: day(210, 11), clauses: ['करार कालावधी: १८ महिने (01/03/2026 – 31/08/2027)', 'भाडे रक्कम: ₹1,21,000 प्रति महिना, दरमहा 1 तारखेस', 'हमी रक्कम: ₹2,40,000 — पीक अपयशास वजावटीची तरतूद नाही', 'वादनिवारण: जिल्हा मध्यस्थी मंडळाकडे अंतिम निर्णय'], signatures: [{ party: 'landlord', name: 'Ram Patil', signedAt: day(210, 11) }, { party: 'tenant', name: 'Suresh Jadhav', signedAt: day(210, 12) }] },
}

export const mockRentReminders = {
  lse_3002: [
    { id: 'rem_9001', leaseId: 'lse_3002', channel: 'sms', sentAt: day(1, 9), status: 'delivered', receiptId: 'dlr_4f2a91' },
    { id: 'rem_9002', leaseId: 'lse_3002', channel: 'whatsapp', sentAt: day(1, 9), status: 'delivered', receiptId: 'dlr_4f2a92' },
    { id: 'rem_9003', leaseId: 'lse_3002', channel: 'ivr', sentAt: day(0, 8), status: 'failed', receiptId: null },
  ],
  lse_3003: [
    { id: 'rem_9004', leaseId: 'lse_3003', channel: 'sms', sentAt: day(2, 9), status: 'delivered', receiptId: 'dlr_5c1b07' },
    { id: 'rem_9005', leaseId: 'lse_3003', channel: 'whatsapp', sentAt: day(2, 9), status: 'read', receiptId: 'dlr_5c1b08' },
    { id: 'rem_9006', leaseId: 'lse_3003', channel: 'sms', sentAt: day(0, 7), status: 'delivered', receiptId: 'dlr_5c1b09' },
  ],
  lse_3006: [
    { id: 'rem_9007', leaseId: 'lse_3006', channel: 'sms', sentAt: day(1, 10), status: 'delivered', receiptId: 'dlr_6d3c18' },
  ],
}

export const mockAdvisoryScans = [
  { id: 'scn_4001', status: 'confirmed', userId: 'usr_a91f', farmerName: 'Ram Patil', farmerPhone: '+919822012345', crop: 'Soybean', district: 'Nashik', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4001.jpg', diagnosis: 'Soybean Rust (Phakopsora pachyrhizi)', severity: 'moderate', confidence: 0.94, modelVersion: 'cnn-leafnet-v4.2', farmerFeedback: 'confirmed', reviewedAt: day(1), createdAt: day(4), updatedAt: day(1) },
  { id: 'scn_4002', status: 'confirmed', userId: 'usr_b773', farmerName: 'Suresh Jadhav', farmerPhone: '+919822098765', crop: 'Cotton', district: 'Pune', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4002.jpg', diagnosis: 'Bacterial Blight (Xanthomonas)', severity: 'high', confidence: 0.91, modelVersion: 'cnn-leafnet-v4.2', farmerFeedback: 'confirmed', reviewedAt: day(2), createdAt: day(6), updatedAt: day(2) },
  { id: 'scn_4003', status: 'false_positive', userId: 'usr_c410', farmerName: 'Mahadev Shinde', farmerPhone: '+919822055588', crop: 'Onion', district: 'Nashik', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4003.jpg', diagnosis: 'Purple Blotch (Alternaria porri)', severity: 'low', confidence: 0.58, modelVersion: 'cnn-leafnet-v4.1', farmerFeedback: 'false_positive', falsePositiveReason: 'Scan showed nutrient deficiency spots, not disease', reviewedAt: day(0, 5), createdAt: day(3), updatedAt: day(0, 5) },
  { id: 'scn_4004', status: 'pending_review', userId: 'usr_d205', farmerName: 'Vitthal Kale', farmerPhone: '+919822077733', crop: 'Wheat', district: 'Ahmednagar', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4004.jpg', diagnosis: 'Wheat Rust (Puccinia)', severity: 'high', confidence: 0.66, modelVersion: 'cnn-leafnet-v4.2', farmerFeedback: 'pending', createdAt: day(0, 3), updatedAt: day(0, 3) },
  { id: 'scn_4005', status: 'confirmed', userId: 'usr_e881', farmerName: 'Gopal Deshmukh', farmerPhone: '+919822031122', crop: 'Maize', district: 'Pune', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4005.jpg', diagnosis: 'Turcicum Leaf Blight', severity: 'moderate', confidence: 0.88, modelVersion: 'cnn-leafnet-v4.2', farmerFeedback: 'confirmed', reviewedAt: day(1), createdAt: day(2), updatedAt: day(1) },
  { id: 'scn_4006', status: 'false_positive', userId: 'usr_f119', farmerName: 'Shanta Bai Pawar', farmerPhone: '+919822099001', crop: 'Tur', district: 'Jalgaon', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4006.jpg', diagnosis: 'Wilt (Fusarium)', severity: 'high', confidence: 0.52, modelVersion: 'cnn-leafnet-v4.1', farmerFeedback: 'false_positive', falsePositiveReason: 'Healthy plant — dew drops misread as lesions', reviewedAt: day(0, 7), createdAt: day(1), updatedAt: day(0, 7) },
  { id: 'scn_4007', status: 'confirmed', userId: 'usr_g552', farmerName: 'Nitin More', farmerPhone: '+919822024680', crop: 'Grapes', district: 'Nashik', imageUrl: 'gs://agrovercity-scans/2026/09/scn_4007.jpg', diagnosis: 'Downy Mildew (Plasmopara viticola)', severity: 'high', confidence: 0.97, modelVersion: 'cnn-leafnet-v4.2', farmerFeedback: 'confirmed', reviewedAt: day(0, 2), createdAt: day(0, 6), updatedAt: day(0, 2) },
]

export const mockPestAlerts = [
  { id: 'alr_5001', status: 'active', pestName: 'Fall Armyworm (Spodoptera frugiperda)', district: 'Nashik', radiusKm: 45, severity: 'high', crop: 'Maize', message: 'Fall Armyworm outbreak confirmed in Dindori belt. Inspect whorl leaves daily; apply recommended pheromone traps.', broadcastAt: day(2), broadcastBy: 'root@agrovercity', recipientsNotified: 4820, createdAt: day(2), updatedAt: day(0, 6) },
  { id: 'alr_5002', status: 'active', pestName: 'Pink Bollworm (Pectinophora gossypiella)', district: 'Jalgaon', radiusKm: 60, severity: 'high', crop: 'Cotton', message: 'Pink bollworm moth catches above ETL in Chopda taluka. Destroy infected bolls and follow ICAR spray schedule.', broadcastAt: day(4), broadcastBy: 'root@agrovercity', recipientsNotified: 6310, createdAt: day(4), updatedAt: day(3) },
  { id: 'alr_5003', status: 'expired', pestName: 'Gregarious Locust Sighting', district: 'Ahmednagar', radiusKm: 100, severity: 'critical', crop: 'All Crops', message: 'Locust swarm movement reported near Rahuri. Report sightings immediately to the toll-free helpline.', broadcastAt: day(21), broadcastBy: 'root@agrovercity', recipientsNotified: 11450, createdAt: day(21), updatedAt: day(12) },
  { id: 'alr_5004', status: 'scheduled', pestName: 'Aphid Buildup Warning', district: 'Pune', radiusKm: 30, severity: 'moderate', crop: 'Sorghum', message: 'Weather models indicate aphid population surge within 72 hours on Indapur sorghum belt.', broadcastAt: '2026-09-23T06:00:00.000Z', broadcastBy: 'root@agrovercity', recipientsNotified: 0, createdAt: day(1), updatedAt: day(1) },
  { id: 'alr_5005', status: 'active', pestName: 'Whitefly Surge (Bemisia tabaci)', district: 'Nashik', radiusKm: 25, severity: 'moderate', crop: 'Cotton', message: 'Whitefly counts crossing ETL in Sinnar. Avoid broad-spectrum sprays; use yellow sticky traps.', broadcastAt: day(0, 8), broadcastBy: 'root@agrovercity', recipientsNotified: 2140, createdAt: day(0, 8), updatedAt: day(0, 8) },
]

export const mockSoilTests = [
  { id: 'st_6001', status: 'result_uploaded', userId: 'usr_a91f', farmerName: 'Ram Patil', farmerPhone: '+919822012345', district: 'Nashik', surveyNo: '0712/2/34', sampleCode: 'SOIL/NSK/2026/1101', collectedAt: day(14), labName: 'MahaBhumi Soil Lab', nitrogen: 210, phosphorus: 18, potassium: 240, ph: 7.2, organicCarbon: 0.58, recommendation: 'Apply 40:60:20 NPK kg/ha split in two doses; add 5t FYM per acre', reportUrl: 'gs://agrovercity-soil/2026/st_6001.pdf', uploadedAt: day(2), createdAt: day(14), updatedAt: day(2) },
  { id: 'st_6002', status: 'lab_processing', userId: 'usr_b773', farmerName: 'Suresh Jadhav', farmerPhone: '+919822098765', district: 'Pune', surveyNo: '0912/1/08', sampleCode: 'SOIL/PUN/2026/2210', collectedAt: day(6), labName: 'ICAR Regional Soil Lab', createdAt: day(6), updatedAt: day(4) },
  { id: 'st_6003', status: 'sample_collected', userId: 'usr_c410', farmerName: 'Mahadev Shinde', farmerPhone: '+919822055588', district: 'Nashik', surveyNo: '0451/3/19', sampleCode: 'SOIL/NSK/2026/1128', collectedAt: day(1), labName: 'MahaBhumi Soil Lab', createdAt: day(1), updatedAt: day(1) },
  { id: 'st_6004', status: 'lab_processing', userId: 'usr_d205', farmerName: 'Vitthal Kale', farmerPhone: '+919822077733', district: 'Ahmednagar', surveyNo: '1188/2/51', sampleCode: 'SOIL/AHM/2026/0774', collectedAt: day(9), labName: 'ICAR Regional Soil Lab', createdAt: day(9), updatedAt: day(7) },
  { id: 'st_6005', status: 'result_uploaded', userId: 'usr_e881', farmerName: 'Gopal Deshmukh', farmerPhone: '+919822031122', district: 'Pune', surveyNo: '2201/4/02', sampleCode: 'SOIL/PUN/2026/3352', collectedAt: day(20), labName: 'MahaBhumi Soil Lab', nitrogen: 145, phosphorus: 11, potassium: 190, ph: 8.1, organicCarbon: 0.34, recommendation: 'Low N & P — apply 60:80:30 NPK kg/ha; gypsum 500 kg/acre for pH correction', reportUrl: 'gs://agrovercity-soil/2026/st_6005.pdf', uploadedAt: day(1), createdAt: day(20), updatedAt: day(1) },
  { id: 'st_6006', status: 'result_uploaded', userId: 'usr_h937', farmerName: 'Kailas Wagh', farmerPhone: '+919822061357', district: 'Ahmednagar', surveyNo: '1671/1/12', sampleCode: 'SOIL/AHM/2026/0891', collectedAt: day(18), labName: 'ICAR Regional Soil Lab', nitrogen: 260, phosphorus: 25, potassium: 310, ph: 6.8, organicCarbon: 0.72, recommendation: 'Fertile soil — maintenance dose 30:40:20 NPK kg/ha only', reportUrl: 'gs://agrovercity-soil/2026/st_6006.pdf', uploadedAt: day(0, 5), createdAt: day(18), updatedAt: day(0, 5) },
]

export const NPK_CONFIG = {
  algorithmVersion: 'icar-npk-v3.1',
  lastReviewedAt: day(5),
  params: [
    { key: 'targetYieldFactor', value: 1.25, unit: '×', note: 'ICAR targeted-yield multiplier per crop' },
    { key: 'soilOCAdjustment', value: 0.15, unit: 'ratio', note: 'Fertilizer reduction per 1% organic carbon above 0.5%' },
    { key: 'soilTestCropResponse', value: 0.9, unit: 'ratio', note: 'Nutrient supply from soil test vs crop response weight' },
    { key: 'saturationElasticity', value: 0.62, unit: 'index', note: 'Market saturation demand-forecast damping coefficient' },
    { key: 'substitutionWindow', value: 14, unit: 'days', note: 'Crop substitution model look-ahead window' },
  ],
}
