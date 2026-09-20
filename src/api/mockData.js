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
