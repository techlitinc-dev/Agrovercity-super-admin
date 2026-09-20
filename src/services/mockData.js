// Mock Seed Data for AGROVERCITY Superadmin
// Implements Collections: users, users/{uid}/role_profiles, users/{uid}/bookings, auth_tokens, devices, sessions, audit_logs
// Compliance: SOP-01 & SOP-02 (User Profiles & Multi-Persona Management)

export const PERSONA_TYPES = {
  FARMER: 'Farmer',
  LANDLORD: 'Landlord',
  TRANSPORTER: 'Transporter',
  SELLER: 'Seller',
  EQUIPMENT_OWNER: 'Equipment Owner',
  BROKER: 'Broker'
};

export const LANGUAGES = [
  { code: 'mr', name: 'मराठी (Marathi)', native: 'मराठी' },
  { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी' },
  { code: 'en', name: 'English (UK/IN)', native: 'English' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', native: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', native: 'ಕನ್ನಡ' },
  { code: 'te', name: 'తెలుగు (Telugu)', native: 'తెలుగు' }
];

export const INITIAL_USERS = [
  {
    id: "USR-1001",
    uid: "fb_uid_ram_patil_92817",
    name: "Ram Patil",
    mobile: "+91 98220 14592",
    email: "ram.patil@agrovercity.in",
    persona: "Farmer",
    activePersona: "Farmer",
    primaryPersona: "Farmer",
    status: "verified",
    aadhaarMasked: "XXXX-XXXX-4812",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: true,
    failedLoginAttempts: 0,
    createdAt: "2026-09-18T06:14:22.000Z",
    updatedAt: "2026-09-20T08:30:15.000Z",
    lastLoginAt: "2026-09-20T08:15:00.000Z",
    lastLoginIp: "49.36.128.45",
    geoCity: "Kolhapur, Maharashtra",
    language: "mr",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Shiroli Sugarcane & Soybean Parcel",
      surveyNumber: "7/12 Gat No. 412/A",
      district: "Kolhapur",
      taluka: "Karvir",
      village: "Shiroli",
      acreage: 5.4,
      gunthas: 16,
      soilType: "Deep Black Clayey (Regur)",
      irrigationSource: "Drip + Panchganga River Lift",
      center: [16.7204, 74.2645],
      coordinates: [
        { lat: 16.7210, lng: 74.2610, label: "Point A (North Gate / Canal)" },
        { lat: 16.7240, lng: 74.2655, label: "Point B (Borewell #1)" },
        { lat: 16.7200, lng: 74.2685, label: "Point C (East Bund)" },
        { lat: 16.7165, lng: 74.2635, label: "Point D (South Roadway)" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-09-19T11:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: true,
        status: "verified",
        verificationDate: "2026-09-18T06:30:00.000Z",
        crops: ["Sugarcane (Co 86032)", "Soybean (JS 335)", "Turmeric (Salem)"],
        acreage: 5.4,
        ownership: "Owned (Ancestral 7/12)",
        soilHealthCard: "SHC-MH-2026-4401",
        pmKisanId: "PMK-4491028",
        irrigationType: "Drip + River Lift",
        rating: 4.9,
        totalHarvestSoldKg: 28400
      },
      "Landlord": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-19T10:00:00.000Z",
        parcelsCount: 2,
        leasedAcreage: 8.0,
        leaseTerms: "Annual Cash Rent (₹38,000/acre)",
        ratePerAcre: 38000,
        verifiedTitle712: true,
        disputeFree: true,
        rating: 4.8
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-19T14:20:00.000Z",
        machinery: ["John Deere 5310 4WD Tractor (55 HP)", "Rotavator (6 ft Shaktiman)"],
        fleetCount: 2,
        hourlyRateRange: "₹850 - ₹1,400 / hr",
        gpsTracked: true,
        operatorIncluded: true,
        rating: 4.7,
        totalHoursRented: 142
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7701",
        persona: "Equipment Owner",
        service: "Rotavator Tillage (6 hours)",
        counterparty: "Suresh Jadhav (Farmer)",
        amount: 5100,
        status: "completed",
        date: "2026-09-19T14:30:00.000Z",
        paymentStatus: "Paid (Escrow Released)"
      },
      {
        id: "BKG-7702",
        persona: "Landlord",
        service: "Sugarcane Farmland Lease (Gat 412/B - 3 Acres)",
        counterparty: "Ganesh Kadam (Tenant Farmer)",
        amount: 114000,
        status: "active",
        date: "2026-09-10T09:00:00.000Z",
        paymentStatus: "Held in Escrow"
      },
      {
        id: "BKG-7703",
        persona: "Farmer",
        service: "Produce Sale Lot #LOT-881 (20 Tonnes Sugarcane)",
        counterparty: "Dutt Sugar Cooperative Factory",
        amount: 64000,
        status: "completed",
        date: "2026-09-17T16:00:00.000Z",
        paymentStatus: "Direct Bank Transfer"
      }
    ],
    devices: [
      {
        id: "DEV-101",
        userId: "fb_uid_ram_patil_92817",
        deviceName: "Samsung Galaxy M34 5G",
        platform: "Android",
        osVersion: "Android 14",
        appVersion: "v2.4.1",
        pushToken: "fcm_token_98fa...772b",
        biometricEnabled: true,
        status: "trusted",
        registeredAt: "2026-08-10T12:00:00.000Z",
        lastActive: "2026-09-20T08:15:00.000Z",
        isCurrent: true
      }
    ],
    sessions: [
      {
        id: "SES-801",
        userId: "fb_uid_ram_patil_92817",
        deviceId: "DEV-101",
        deviceName: "Samsung Galaxy M34 5G",
        ipAddress: "49.36.128.45",
        userAgent: "AgrovercityMobile/2.4.1 (Android 14; Mobile)",
        location: "Kolhapur, MH, IN",
        active: true,
        startedAt: "2026-09-20T08:00:00.000Z",
        lastSeenAt: "2026-09-20T08:15:00.000Z"
      }
    ],
    authTokens: [
      {
        id: "TOK-9001",
        tokenType: "refresh",
        tokenHash: "eyJhbGciOi...q89B",
        deviceId: "DEV-101",
        issuedAt: "2026-09-20T08:00:00.000Z",
        expiresAt: "2026-10-20T08:00:00.000Z",
        status: "active",
        ipAddress: "49.36.128.45"
      }
    ]
  },
  {
    id: "USR-1002",
    uid: "fb_uid_suresh_jadhav_55219",
    name: "Suresh Jadhav",
    mobile: "+91 94231 77650",
    email: "suresh.jadhav@krishi.org",
    persona: "Farmer",
    activePersona: "Farmer",
    primaryPersona: "Farmer",
    status: "pending",
    aadhaarMasked: "XXXX-XXXX-6531",
    mpinSet: false,
    twoFactorEnabled: false,
    biometricEnabled: false,
    failedLoginAttempts: 1,
    createdAt: "2026-09-18T11:20:00.000Z",
    updatedAt: "2026-09-18T11:20:00.000Z",
    lastLoginAt: "2026-09-18T11:25:00.000Z",
    lastLoginIp: "103.21.144.90",
    geoCity: "Nashik, Maharashtra",
    language: "mr",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Dindori Table Grapes Vineyard",
      surveyNumber: "7/12 Gat No. 104/2",
      district: "Nashik",
      taluka: "Dindori",
      village: "Janori",
      acreage: 3.2,
      gunthas: 8,
      soilType: "Well-Drained Red Sandy Loam",
      irrigationSource: "Automated Micro-Drip with Fertigation",
      center: [20.1845, 73.8320],
      coordinates: [
        { lat: 20.1855, lng: 73.8300, label: "Gate A (Dindori Highway)" },
        { lat: 20.1870, lng: 73.8340, label: "Trellis Block #1" },
        { lat: 20.1830, lng: 73.8350, label: "Fertigation Pump House" },
        { lat: 20.1820, lng: 73.8310, label: "Boundary Wall South" }
      ],
      verifiedByAdmin: false,
      lastMappedAt: "2026-09-18T11:20:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: true,
        status: "pending",
        crops: ["Export Quality Thompson Seedless Grapes", "Red Onions"],
        acreage: 3.2,
        ownership: "Owned (Gat 104/2)",
        soilHealthCard: "SHC-MH-2026-7811",
        pmKisanId: "PMK-9901428",
        irrigationType: "Micro-Drip",
        rating: 4.4,
        totalHarvestSoldKg: 8500
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: true,
        isPrimary: false,
        status: "pending",
        verificationDate: null,
        apmcLicense: "APMC-NSK-COMM-PENDING",
        operatingMandis: ["Nashik APMC", "Lasalgaon Onion Mandi"],
        activeTradersCount: 6,
        securityDeposit: 25000,
        commissionRate: "1.5%",
        rating: 3.8
      }
    },
    bookings: [
      {
        id: "BKG-7704",
        persona: "Farmer",
        service: "Cold Storage Reservation (200 Crates Grapes)",
        counterparty: "Sahyadri Agro Fresh Cold Chain",
        amount: 8200,
        status: "active",
        date: "2026-09-18T11:28:00.000Z",
        paymentStatus: "Pending Verification"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1003",
    uid: "fb_uid_mahadev_shinde_33109",
    name: "Mahadev Shinde",
    mobile: "+91 97654 32180",
    email: "mahadev.shinde@agrotrade.biz",
    persona: "Broker",
    activePersona: "Broker",
    primaryPersona: "Broker",
    status: "flagged",
    aadhaarMasked: "XXXX-XXXX-9923",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: true,
    failedLoginAttempts: 4,
    createdAt: "2026-09-17T14:10:00.000Z",
    updatedAt: "2026-09-20T06:05:00.000Z",
    lastLoginAt: "2026-09-20T05:58:00.000Z",
    lastLoginIp: "185.220.101.5",
    geoCity: "Pune, Maharashtra",
    language: "hi",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: true,
      density: "compact",
      fontScale: "normal"
    },
    farmPolygon: null,
    roleProfiles: {
      "Farmer": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-17T15:00:00.000Z",
        shopName: "Shinde Agri Commodities & Wholesale",
        licenseNo: "COMM-WH-PUN-0919",
        gstin: "27AAZCS9912E1ZQ",
        categories: ["Grains Wholesale", "Pulses", "Soybean Oil Seeds"],
        storeLocation: "Market Yard Gate #3, Gultekdi, Pune",
        creditAllowed: true,
        rating: 4.1
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: true,
        isPrimary: true,
        status: "flagged",
        verificationDate: "2026-09-17T14:20:00.000Z",
        apmcLicense: "APMC-PUN-BROKER-2022",
        operatingMandis: ["Pune Gultekdi Market Yard", "Baramati Sub-Market"],
        activeTradersCount: 42,
        securityDeposit: 150000,
        commissionRate: "2.0%",
        rating: 3.5,
        flagReason: "Disputed Mandi commission deduction flagged by 3 local farmers"
      }
    },
    bookings: [
      {
        id: "BKG-7705",
        persona: "Broker",
        service: "Mandi Auction Commission (Lot #LOT-412 Soybean 500 Quintals)",
        counterparty: "Kisan Agro Producers Company",
        amount: 24500,
        status: "disputed",
        date: "2026-09-19T08:00:00.000Z",
        paymentStatus: "On Hold (Dispute Ticket #DIS-4099)"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1004",
    uid: "fb_uid_sunita_more_88421",
    name: "Sunita More",
    mobile: "+91 98901 23456",
    email: "sunita.more@mahilashg.org",
    persona: "Farmer",
    activePersona: "Farmer",
    primaryPersona: "Farmer",
    status: "verified",
    aadhaarMasked: "XXXX-XXXX-3341",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: true,
    failedLoginAttempts: 0,
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-09-20T07:10:00.000Z",
    lastLoginAt: "2026-09-20T07:05:00.000Z",
    lastLoginIp: "27.106.15.22",
    geoCity: "Satara, Maharashtra",
    language: "mr",
    womenMode: true,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "large"
    },
    farmPolygon: {
      title: "Wai Mahila SHG Strawberry & Turmeric Field",
      surveyNumber: "7/12 Gat No. 88/1",
      district: "Satara",
      taluka: "Wai",
      village: "Bhilare",
      acreage: 4.0,
      gunthas: 0,
      soilType: "Rich Organic Mountain Loam",
      irrigationSource: "Gravity Spring Water + Drip Lines",
      center: [17.9480, 73.8920],
      coordinates: [
        { lat: 17.9495, lng: 73.8900, label: "SHG Training Shelter" },
        { lat: 17.9505, lng: 73.8935, label: "Organic Strawberry Beds" },
        { lat: 17.9470, lng: 73.8945, label: "Turmeric Nursery" },
        { lat: 17.9455, lng: 73.8910, label: "Compost & Bio-gas Unit" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-09-16T10:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: true,
        status: "verified",
        verificationDate: "2026-09-15T08:30:00.000Z",
        crops: ["Organic Strawberry (Sweet Charlie)", "Waigaon Turmeric", "Ginger"],
        acreage: 4.0,
        ownership: "SHG Cooperative Lease",
        soilHealthCard: "SHC-MH-2026-1188",
        pmKisanId: "PMK-7712399",
        irrigationType: "Drip (Gravity fed)",
        rating: 5.0,
        totalHarvestSoldKg: 14200
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-16T12:00:00.000Z",
        shopName: "Savtribai Phule Women SHG Agri Hub",
        licenseNo: "SHG-BIO-SAT-2024",
        gstin: "27SHGMP8811A1ZX",
        categories: ["Organic Seeds", "Vermi-Compost", "Turmeric Powder"],
        storeLocation: "Wai Bazar Chowk, Satara",
        creditAllowed: false,
        rating: 4.9
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7706",
        persona: "Seller",
        service: "Direct Sale: 80 Bags Vermi-Compost",
        counterparty: "Green Valley Vineyards Nashik",
        amount: 32000,
        status: "completed",
        date: "2026-09-18T14:00:00.000Z",
        paymentStatus: "Paid (Direct UPI)"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1005",
    uid: "fb_uid_anita_deshmukh_77210",
    name: "Anita Deshmukh",
    mobile: "+91 97302 99881",
    email: "anita.logistics@agrolog.in",
    persona: "Transporter",
    activePersona: "Transporter",
    primaryPersona: "Transporter",
    status: "verified",
    aadhaarMasked: "XXXX-XXXX-7719",
    mpinSet: true,
    twoFactorEnabled: false,
    biometricEnabled: true,
    failedLoginAttempts: 0,
    createdAt: "2026-09-14T09:30:00.000Z",
    updatedAt: "2026-09-19T14:20:00.000Z",
    lastLoginAt: "2026-09-19T14:15:00.000Z",
    lastLoginIp: "49.36.210.88",
    geoCity: "Solapur, Maharashtra",
    language: "mr",
    womenMode: true,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "compact",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Mohol Agro Logistics Depot & Orchard",
      surveyNumber: "7/12 Gat No. 219/3",
      district: "Solapur",
      taluka: "Mohol",
      village: "Kurul",
      acreage: 6.5,
      gunthas: 20,
      soilType: "Medium Black Soil",
      irrigationSource: "Sina River Lift",
      center: [17.8120, 75.6410],
      coordinates: [
        { lat: 17.8140, lng: 75.6390, label: "Depot & Weighbridge" },
        { lat: 17.8155, lng: 75.6435, label: "Pomegranate Orchard A" },
        { lat: 17.8105, lng: 75.6440, label: "Reefer Parking Bay" },
        { lat: 17.8090, lng: 75.6400, label: "Warehouse Entry" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-09-15T15:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Landlord": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-15T10:00:00.000Z",
        parcelsCount: 1,
        leasedAcreage: 4.0,
        leaseTerms: "Long-term Commercial Agro Lease",
        ratePerAcre: 42000,
        verifiedTitle712: true,
        disputeFree: true,
        rating: 4.9
      },
      "Transporter": {
        linked: true,
        isPrimary: true,
        status: "verified",
        verificationDate: "2026-09-14T11:00:00.000Z",
        vehicleTypes: ["Tata 407 (4-Tonner)", "Mahindra Bolero Maxi Truck (1.7T)", "Eicher Pro Reefer (6-Tonner Cold)"],
        fleetCount: 3,
        registrationNo: "MH-13-CU-8841",
        permitType: "All-India Transit Permit (National)",
        coldChainAvailable: true,
        maxPayloadTons: 11.7,
        operatingRoutes: ["Solapur - Pune APMC", "Solapur - Vashi Mumbai", "Solapur - Hyderabad"],
        rating: 4.95,
        completedTrips: 184
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7707",
        persona: "Transporter",
        service: "Cold Chain Transport (Solapur Pomegranate to Mumbai Vashi)",
        counterparty: "Mahapom Export FPO",
        amount: 22000,
        status: "in-transit",
        date: "2026-09-20T04:00:00.000Z",
        paymentStatus: "Escrow Locked (Release on GPS Geofence Arrival)"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1006",
    uid: "fb_uid_vikram_rathod_66190",
    name: "Vikram Rathod",
    mobile: "+91 99225 44332",
    email: "vikram.rathod@agrirental.co.in",
    persona: "Equipment Owner",
    activePersona: "Equipment Owner",
    primaryPersona: "Equipment Owner",
    status: "suspended",
    aadhaarMasked: "XXXX-XXXX-9021",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: false,
    failedLoginAttempts: 0,
    createdAt: "2026-09-10T10:00:00.000Z",
    updatedAt: "2026-09-19T16:00:00.000Z",
    lastLoginAt: "2026-09-18T16:30:00.000Z",
    lastLoginIp: "103.44.52.19",
    geoCity: "Chhatrapati Sambhajinagar, Maharashtra",
    language: "hi",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Paithan Equipment Yard & Service Hub",
      surveyNumber: "7/12 Gat No. 55/A",
      district: "Chhatrapati Sambhajinagar",
      taluka: "Paithan",
      village: "Shevgaon Road",
      acreage: 2.8,
      gunthas: 12,
      soilType: "Sandy Alluvial",
      irrigationSource: "Jayakwadi Dam Backwater",
      center: [19.4820, 75.3850],
      coordinates: [
        { lat: 19.4835, lng: 75.3830, label: "Tractor Garage A" },
        { lat: 19.4845, lng: 75.3870, label: "Harvester Bay" },
        { lat: 19.4805, lng: 75.3880, label: "Diesel Storage Tank" },
        { lat: 19.4795, lng: 75.3840, label: "Customer Counter" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-09-11T12:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: true,
        isPrimary: false,
        status: "suspended",
        vehicleTypes: ["Ashok Leyland Dost (2.5 Tonner)"],
        fleetCount: 1,
        registrationNo: "MH-20-DE-1190",
        permitType: "State Maharashtra",
        coldChainAvailable: false,
        maxPayloadTons: 2.5,
        rating: 3.2
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: true,
        isPrimary: true,
        status: "suspended",
        verificationDate: "2026-09-10T11:00:00.000Z",
        machinery: ["Mahindra 575 DI Tractor (45 HP)", "Combine Harvester (Preet 987)", "Laser Land Leveler"],
        fleetCount: 3,
        hourlyRateRange: "₹950 - ₹2,400 / hr",
        gpsTracked: true,
        operatorIncluded: true,
        rating: 3.4,
        suspensionReason: "Suspected fleet listing fraud flagged by dispute unit #DIS-4091"
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7708",
        persona: "Equipment Owner",
        service: "Combine Harvester Rental (Soybean - 12 Acres)",
        counterparty: "Gopal Rao (Farmer)",
        amount: 28800,
        status: "cancelled",
        date: "2026-09-18T16:00:00.000Z",
        paymentStatus: "Refunded to Farmer"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1007",
    uid: "fb_uid_rajesh_verma_44122",
    name: "Rajesh Verma",
    mobile: "+91 98110 55443",
    email: "rajesh.verma@delhigrain.com",
    persona: "Seller",
    activePersona: "Seller",
    primaryPersona: "Seller",
    status: "locked",
    aadhaarMasked: "XXXX-XXXX-1144",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: false,
    failedLoginAttempts: 5,
    createdAt: "2026-09-08T07:15:00.000Z",
    updatedAt: "2026-09-20T08:00:00.000Z",
    lastLoginAt: "2026-09-20T07:55:00.000Z",
    lastLoginIp: "122.161.49.201",
    geoCity: "New Delhi, Delhi",
    language: "en",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: null,
    roleProfiles: {
      "Farmer": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: true,
        isPrimary: true,
        status: "locked",
        verificationDate: "2026-09-08T08:00:00.000Z",
        shopName: "Verma Seeds & Modern Agro Equipment",
        licenseNo: "DL-AGRO-SEED-8819",
        gstin: "07AAACV9918B1Z2",
        categories: ["Hybrid Maize Seeds", "Water Soluble NPK", "Drip Irrigation Fittings"],
        storeLocation: "Naya Bazar, Old Delhi Wholesale Market",
        creditAllowed: true,
        rating: 4.3
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-09T10:00:00.000Z",
        apmcLicense: "APMC-AZADPUR-COMM-2018",
        operatingMandis: ["Azadpur Fruit & Veg Mandi", "Naya Bazar Mandi"],
        activeTradersCount: 88,
        securityDeposit: 300000,
        commissionRate: "1.8%",
        rating: 4.2
      }
    },
    bookings: [
      {
        id: "BKG-7709",
        persona: "Seller",
        service: "B2B Bulk Hybrid Maize Seed Consignment (50 Quintals)",
        counterparty: "Karnal Farmer Producer Group",
        amount: 145000,
        status: "completed",
        date: "2026-09-17T11:00:00.000Z",
        paymentStatus: "Settled via NEFT"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1008",
    uid: "fb_uid_ananya_kulkarni_12098",
    name: "Dr. Ananya Kulkarni",
    mobile: "+91 94220 88123",
    email: "ananya.kulkarni@icar.gov.in",
    persona: "Farmer",
    activePersona: "Farmer",
    primaryPersona: "Farmer",
    status: "verified",
    aadhaarMasked: "XXXX-XXXX-9901",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: true,
    failedLoginAttempts: 0,
    createdAt: "2026-09-01T05:00:00.000Z",
    updatedAt: "2026-09-20T04:20:00.000Z",
    lastLoginAt: "2026-09-20T04:15:00.000Z",
    lastLoginIp: "49.36.190.14",
    geoCity: "Pune, Maharashtra",
    language: "en",
    womenMode: true,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Baramati Agri-Research Demonstration Orchard",
      surveyNumber: "7/12 Gat No. 31/1B",
      district: "Pune",
      taluka: "Baramati",
      village: "Malegaon Khurd",
      acreage: 8.2,
      gunthas: 8,
      soilType: "Volcanic Medium Black Soil (Fertile)",
      irrigationSource: "Solar Powered Automated Micro-Sprinklers",
      center: [18.1510, 74.5780],
      coordinates: [
        { lat: 18.1530, lng: 74.5750, label: "Agri-Tech Weather Station" },
        { lat: 18.1545, lng: 74.5810, label: "Dragonfruit Trellis System" },
        { lat: 18.1495, lng: 74.5820, label: "Protected Polyhouse #1" },
        { lat: 18.1480, lng: 74.5760, label: "Main Solar Pump Array" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-09-05T09:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: true,
        status: "verified",
        verificationDate: "2026-09-01T06:00:00.000Z",
        crops: ["Red Dragonfruit", "Tissue Culture Banana (Grand Naine)", "Avocado"],
        acreage: 8.2,
        ownership: "Owned (ICAR Certified Model Farm)",
        soilHealthCard: "SHC-MH-2026-0012",
        pmKisanId: "PMK-1100293",
        irrigationType: "Solar Micro-Sprinkler & Sensor Drip",
        rating: 5.0,
        totalHarvestSoldKg: 36000
      },
      "Landlord": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-09-02T10:00:00.000Z",
        parcelsCount: 3,
        leasedAcreage: 14.0,
        leaseTerms: "Organic Farming Cooperative Lease",
        ratePerAcre: 45000,
        verifiedTitle712: true,
        disputeFree: true,
        rating: 5.0
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7710",
        persona: "Landlord",
        service: "Organic Polyhouse Lease (3 Years)",
        counterparty: "Krishi Vigyan Kendra Student Group",
        amount: 135000,
        status: "active",
        date: "2026-09-04T12:00:00.000Z",
        paymentStatus: "Annual Escrow Disbursed"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1009",
    uid: "fb_uid_prakash_patil_77180",
    name: "Prakash Bapu Patil",
    mobile: "+91 94224 55102",
    email: "prakash.patil@tasgaonfruits.com",
    persona: "Landlord",
    activePersona: "Landlord",
    primaryPersona: "Landlord",
    status: "verified",
    aadhaarMasked: "XXXX-XXXX-8822",
    mpinSet: true,
    twoFactorEnabled: true,
    biometricEnabled: false,
    failedLoginAttempts: 0,
    createdAt: "2026-08-20T10:00:00.000Z",
    updatedAt: "2026-09-19T11:00:00.000Z",
    lastLoginAt: "2026-09-19T10:45:00.000Z",
    lastLoginIp: "49.36.140.71",
    geoCity: "Sangli, Maharashtra",
    language: "mr",
    womenMode: false,
    displaySettings: {
      theme: "dark",
      highContrast: false,
      density: "comfortable",
      fontScale: "normal"
    },
    farmPolygon: {
      title: "Tasgaon Grapes & Pomegranate Estate",
      surveyNumber: "7/12 Gat No. 602/B",
      district: "Sangli",
      taluka: "Tasgaon",
      village: "Kavathe Ekand",
      acreage: 14.5,
      gunthas: 20,
      soilType: "Deep Alluvial Loam",
      irrigationSource: "Krishna River Lift Irrigation Scheme",
      center: [17.0340, 74.6010],
      coordinates: [
        { lat: 17.0370, lng: 74.5980, label: "North Boundary / Krishna Canal" },
        { lat: 17.0385, lng: 74.6045, label: "Export Grape Trellis Block" },
        { lat: 17.0315, lng: 74.6055, label: "Pomegranate Parcel East" },
        { lat: 17.0295, lng: 74.5995, label: "Main Farm Bungalow & Office" }
      ],
      verifiedByAdmin: true,
      lastMappedAt: "2026-08-25T14:00:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: false,
        status: "verified",
        verificationDate: "2026-08-21T09:00:00.000Z",
        crops: ["Export Crimson Seedless Grapes", "Bhagwa Pomegranate"],
        acreage: 6.5,
        ownership: "Owned (Gat 602/B)",
        soilHealthCard: "SHC-MH-2026-9041",
        pmKisanId: "PMK-3341908",
        irrigationType: "River Lift + Micro Drip",
        rating: 4.85,
        totalHarvestSoldKg: 52000
      },
      "Landlord": {
        linked: true,
        isPrimary: true,
        status: "verified",
        verificationDate: "2026-08-20T11:00:00.000Z",
        parcelsCount: 4,
        leasedAcreage: 8.0,
        leaseTerms: "₹42,000 / Acre Annual Lease with Escrow Guarantee",
        ratePerAcre: 42000,
        verifiedTitle712: true,
        disputeFree: true,
        rating: 4.9
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7711",
        persona: "Landlord",
        service: "Vineyard Land Lease (Gat 602/B - 4 Acres)",
        counterparty: "Nitin Shinde (Farmer)",
        amount: 168000,
        status: "active",
        date: "2026-09-01T10:00:00.000Z",
        paymentStatus: "Annual Escrow Secured"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  },
  {
    id: "USR-1010",
    uid: "fb_uid_meena_bai_rathore_99120",
    name: "Meena Bai Rathore",
    mobile: "+91 94042 11984",
    email: "meenabai.shg@krishimahila.org",
    persona: "Farmer",
    activePersona: "Farmer",
    primaryPersona: "Farmer",
    status: "pending",
    aadhaarMasked: "XXXX-XXXX-5519",
    mpinSet: false,
    twoFactorEnabled: false,
    biometricEnabled: true,
    failedLoginAttempts: 0,
    createdAt: "2026-09-19T08:00:00.000Z",
    updatedAt: "2026-09-20T07:00:00.000Z",
    lastLoginAt: "2026-09-20T06:50:00.000Z",
    lastLoginIp: "27.106.90.11",
    geoCity: "Nanded, Maharashtra",
    language: "hi",
    womenMode: true,
    displaySettings: {
      theme: "dark",
      highContrast: true,
      density: "comfortable",
      fontScale: "large"
    },
    farmPolygon: {
      title: "Nanded Mahila SHG Cotton & Safflower Farmland",
      surveyNumber: "7/12 Gat No. 174/A",
      district: "Nanded",
      taluka: "Mudkhed",
      village: "Mugath",
      acreage: 3.8,
      gunthas: 32,
      soilType: "Deep Black Cotton Soil (Regur)",
      irrigationSource: "Godavari Canal Minor Lift",
      center: [19.1410, 77.4120],
      coordinates: [
        { lat: 19.1425, lng: 77.4100, label: "Godavari Canal Sluice" },
        { lat: 19.1435, lng: 77.4145, label: "Bt Cotton Field Sector 1" },
        { lat: 19.1395, lng: 77.4150, label: "Safflower (Kardi) Patch" },
        { lat: 19.1385, lng: 77.4105, label: "Community Tractor Shed" }
      ],
      verifiedByAdmin: false,
      lastMappedAt: "2026-09-19T08:30:00.000Z"
    },
    roleProfiles: {
      "Farmer": {
        linked: true,
        isPrimary: true,
        status: "pending",
        crops: ["Bt Cotton (Bollgard II)", "Safflower (Kardi)", "Pigeon Pea (Tur)"],
        acreage: 3.8,
        ownership: "Mahila SHG Land Parcel",
        soilHealthCard: "SHC-MH-2026-5599",
        pmKisanId: "PMK-9918230",
        irrigationType: "Canal Lift + Furrow",
        rating: 4.6,
        totalHarvestSoldKg: 9100
      },
      "Landlord": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Transporter": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Seller": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      },
      "Equipment Owner": {
        linked: true,
        isPrimary: false,
        status: "pending",
        machinery: ["Swaraj 744 FE Tractor (Women SHG Shared Custody)", "Multi-Crop Thresher"],
        fleetCount: 2,
        hourlyRateRange: "₹700 - ₹1,100 / hr (Subsidized for Women Farmers)",
        gpsTracked: true,
        operatorIncluded: true,
        rating: 4.5
      },
      "Broker": {
        linked: false,
        isPrimary: false,
        status: "inactive"
      }
    },
    bookings: [
      {
        id: "BKG-7712",
        persona: "Equipment Owner",
        service: "Community Thresher Rental (Tur Harvest - 4 hrs)",
        counterparty: "Rukmini Kadam (Farmer)",
        amount: 2800,
        status: "completed",
        date: "2026-09-19T15:00:00.000Z",
        paymentStatus: "Paid via SHG Micro-Credit"
      }
    ],
    devices: [],
    sessions: [],
    authTokens: []
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-8925",
    adminUid: "root@agrovercity",
    action: "PERSONA_LINKED",
    targetUserId: "fb_uid_ram_patil_92817",
    targetUserName: "Ram Patil",
    previousState: "Linked: Farmer",
    newState: "Linked: Farmer, Landlord, Equipment Owner",
    reason: "Farmer registered 2 additional commercial tractors and 7/12 land parcels for rental leasing",
    timestamp: "2026-09-19T14:20:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8924",
    adminUid: "root@agrovercity",
    action: "FARM_POLYGON_VERIFIED",
    targetUserId: "fb_uid_sunita_more_88421",
    targetUserName: "Sunita More",
    previousState: "Unverified Polygon",
    newState: "Verified 4.0 Acres · Gat 88/1 (Wai)",
    reason: "Satellite cadastral ground survey matched with Maharashtra Mahabhulekh 7/12 records",
    timestamp: "2026-09-19T11:00:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8923",
    adminUid: "support.tier2@agrovercity.in",
    action: "PREFERENCES_UPDATED",
    targetUserId: "fb_uid_sunita_more_88421",
    targetUserName: "Sunita More",
    previousState: "womenMode: false, lang: en",
    newState: "womenMode: true, lang: mr (मराठी)",
    reason: "User requested Marathi regional interface and Women SHG safety emergency routing via helpline #HEL-901",
    timestamp: "2026-09-18T12:00:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8922",
    adminUid: "root@agrovercity",
    action: "PRIMARY_PERSONA_SET",
    targetUserId: "fb_uid_anita_deshmukh_77210",
    targetUserName: "Anita Deshmukh",
    previousState: "Primary: Landlord",
    newState: "Primary: Transporter ⭐",
    reason: "User operates commercial 3-vehicle transport fleet with verified National permit",
    timestamp: "2026-09-17T15:30:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8921",
    adminUid: "root@agrovercity",
    action: "STATUS_CHANGE",
    targetUserId: "fb_uid_vikram_rathod_66190",
    targetUserName: "Vikram Rathod",
    previousState: "verified",
    newState: "suspended",
    reason: "Suspected fleet listing fraud flagged by dispute unit #DIS-4091",
    timestamp: "2026-09-19T16:00:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8920",
    adminUid: "root@agrovercity",
    action: "REVOKE_ALL_SESSIONS",
    targetUserId: "fb_uid_vikram_rathod_66190",
    targetUserName: "Vikram Rathod",
    previousState: "1 active session",
    newState: "0 active sessions (revoked)",
    reason: "Precautionary token revocation following account suspension",
    timestamp: "2026-09-19T16:01:00.000Z",
    ipAddress: "14.139.122.9"
  },
  {
    id: "AUD-8919",
    adminUid: "system_security_bot",
    action: "ACCOUNT_LOCKED",
    targetUserId: "fb_uid_rajesh_verma_44122",
    targetUserName: "Rajesh Verma",
    previousState: "verified",
    newState: "locked",
    reason: "Exceeded maximum failed MPIN threshold (5 consecutive bad attempts)",
    timestamp: "2026-09-20T08:00:00.000Z",
    ipAddress: "122.161.49.201"
  },
  {
    id: "AUD-8918",
    adminUid: "root@agrovercity",
    action: "MPIN_RESET_TRIGGERED",
    targetUserId: "fb_uid_ram_patil_92817",
    targetUserName: "Ram Patil",
    previousState: "MPIN active",
    newState: "Temporary OTP dispatched",
    reason: "Customer support ticket #SUP-1102 - user forgot MPIN in rural area without email",
    timestamp: "2026-09-18T09:30:00.000Z",
    ipAddress: "14.139.122.9"
  }
];

export const KYC_DOCUMENT_TYPES = [
  { id: 'all', label: 'All Documents (6 Types)' },
  { id: 'aadhaar', label: '🪪 Aadhaar Card (Masked)' },
  { id: 'land_record_712', label: '📜 7/12 Land Record (Mahabhulekh)' },
  { id: 'bank_passbook', label: '🏦 Bank Passbook / Cheque' },
  { id: 'soil_health_card', label: '🧪 Soil Health Card (SHC)' },
  { id: 'apmc_license', label: '⚖️ APMC Mandi License' },
  { id: 'transport_permit', label: '🚚 Commercial Vehicle Permit / RC' },
  { id: 'seller_license', label: '🏪 Fertilizer & Seed License' }
];

export const INITIAL_KYC_VERIFICATIONS = [
  {
    id: "KYC-2001",
    userId: "fb_uid_suresh_jadhav_55219",
    userName: "Suresh Jadhav",
    userMobile: "+91 94231 77650",
    userPersona: "Farmer",
    userCity: "Nashik, Maharashtra",
    docId: "DOC-801",
    docType: "land_record_712",
    docName: "Maharashtra 7/12 Land Extract - Gat No. 104/2",
    fileSize: "2.4 MB",
    mimeType: "image/jpeg",
    status: "pending",
    submittedAt: "2026-09-18T11:25:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    verificationBadgeIssued: false,
    ocrConfidenceScore: 98,
    dpdpComplianceStatus: "verified_masked",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "7/12 Gat No. 104/2",
      holderName: "Suresh Bapu Jadhav",
      village: "Janori",
      taluka: "Dindori",
      district: "Nashik",
      areaAcreage: "3.2 Acres (1.29 Hectare)",
      potKharaba: "0.10 Hectare",
      landType: "Jirayat / Bagayat (Micro-Drip Irrigated)",
      cropSeason: "Kharif & Rabi (Export Grapes, Onion)"
    },
    profileComparison: [
      { field: "Landholder Name", profileValue: "Suresh Jadhav", ocrValue: "Suresh Bapu Jadhav", status: "match", matchScore: 96 },
      { field: "Survey / Gat No.", profileValue: "Gat No. 104/2", ocrValue: "Gat No. 104/2", status: "exact", matchScore: 100 },
      { field: "District / Taluka", profileValue: "Nashik, Dindori", ocrValue: "Nashik, Dindori", status: "exact", matchScore: 100 },
      { field: "Village", profileValue: "Janori", ocrValue: "Janori", status: "exact", matchScore: 100 },
      { field: "Cultivated Area", profileValue: "3.2 Acres", ocrValue: "3.2 Acres (1.29 Ha)", status: "exact", matchScore: 99 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-18T11:25:00.000Z", actor: "Suresh Jadhav", notes: "Uploaded via Agrovercity Mobile App v2.4.0" },
      { action: "OCR_EXTRACTION_SUCCESS", timestamp: "2026-09-18T11:26:00.000Z", actor: "AI OCR Pipeline", notes: "Confidence: 98%. Mahabhulekh watermarks verified." }
    ]
  },
  {
    id: "KYC-2002",
    userId: "fb_uid_meena_bai_rathore_99120",
    userName: "Meena Bai Rathore",
    userMobile: "+91 94042 11984",
    userPersona: "Farmer",
    userCity: "Nanded, Maharashtra",
    docId: "DOC-802",
    docType: "aadhaar",
    docName: "Aadhaar Card (National ID) - Government of India",
    fileSize: "1.8 MB",
    mimeType: "image/jpeg",
    status: "pending",
    submittedAt: "2026-09-19T08:15:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    verificationBadgeIssued: false,
    ocrConfidenceScore: 95,
    dpdpComplianceStatus: "verified_masked",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "XXXX-XXXX-5519 (Redacted)",
      holderName: "Meena Bai Rathore",
      dob: "1984-04-12",
      gender: "Female",
      address: "Mugath, Mudkhed, Nanded, Maharashtra 431715",
      pincode: "431715",
      issuingAuthority: "UIDAI (Govt. of India)"
    },
    profileComparison: [
      { field: "Beneficiary Name", profileValue: "Meena Bai Rathore", ocrValue: "Meena Bai Rathore", status: "exact", matchScore: 100 },
      { field: "Aadhaar Redaction", profileValue: "XXXX-XXXX-5519", ocrValue: "XXXX-XXXX-5519", status: "exact", matchScore: 100 },
      { field: "Gender & DOB", profileValue: "Female (1984)", ocrValue: "Female · 12/04/1984", status: "match", matchScore: 98 },
      { field: "Address / Village", profileValue: "Mugath, Nanded", ocrValue: "Mugath, Mudkhed, Nanded", status: "match", matchScore: 94 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-19T08:15:00.000Z", actor: "Meena Bai Rathore", notes: "Aadhaar image uploaded with QR code" },
      { action: "DPDP_REDACTION_CHECK", timestamp: "2026-09-19T08:16:00.000Z", actor: "Compliance Bot", notes: "Pass: First 8 digits masked." }
    ]
  },
  {
    id: "KYC-2003",
    userId: "fb_uid_mahadev_shinde_33109",
    userName: "Mahadev Shinde",
    userMobile: "+91 97654 32180",
    userPersona: "Broker",
    userCity: "Pune, Maharashtra",
    docId: "DOC-803",
    docType: "apmc_license",
    docName: "APMC Commission Agent License - Pune Gultekdi",
    fileSize: "3.1 MB",
    mimeType: "application/pdf",
    status: "flagged",
    submittedAt: "2026-09-17T14:20:00.000Z",
    reviewedAt: "2026-09-18T10:00:00.000Z",
    reviewedBy: "support.tier2@agrovercity.in",
    rejectionReason: "Name discrepancy between platform profile and APMC license document",
    verificationBadgeIssued: false,
    ocrConfidenceScore: 78,
    dpdpComplianceStatus: "not_applicable",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "APMC-PUN-BROKER-2022/41",
      holderName: "M. K. Shinde & Brothers Trading Co.",
      marketYard: "Agricultural Produce Market Committee, Gultekdi, Pune",
      validUntil: "2027-03-31",
      securityDepositAmount: "₹1,50,000 in Escrow",
      authorizedCommodities: "Soybean, Pulses, Wheat, Maize"
    },
    profileComparison: [
      { field: "Entity Trade Name", profileValue: "Mahadev Shinde", ocrValue: "M. K. Shinde & Brothers", status: "mismatch", matchScore: 68 },
      { field: "License Number", profileValue: "APMC-PUN-BROKER-2022", ocrValue: "APMC-PUN-BROKER-2022/41", status: "match", matchScore: 92 },
      { field: "Market Yard", profileValue: "Pune Gultekdi", ocrValue: "Pune Gultekdi Market Yard", status: "exact", matchScore: 98 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-17T14:20:00.000Z", actor: "Mahadev Shinde", notes: "APMC license renewal copy uploaded" },
      { action: "OCR_DISCREPANCY_FLAGGED", timestamp: "2026-09-17T14:22:00.000Z", actor: "Automated OCR Engine", notes: "Flagged: Partnership name differs from individual user KYC." }
    ]
  },
  {
    id: "KYC-2004",
    userId: "fb_uid_ram_patil_92817",
    userName: "Ram Patil",
    userMobile: "+91 98220 14592",
    userPersona: "Farmer",
    userCity: "Kolhapur, Maharashtra",
    docId: "DOC-804",
    docType: "land_record_712",
    docName: "Maharashtra 7/12 Land Record Extract - Gat No. 412/A",
    fileSize: "2.1 MB",
    mimeType: "image/jpeg",
    status: "verified",
    submittedAt: "2026-09-18T06:20:00.000Z",
    reviewedAt: "2026-09-18T06:30:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    verificationBadgeIssued: true,
    ocrConfidenceScore: 100,
    dpdpComplianceStatus: "verified_masked",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "7/12 Gat No. 412/A",
      holderName: "Ramchandra Govind Patil",
      village: "Shiroli",
      taluka: "Karvir",
      district: "Kolhapur",
      areaAcreage: "5.4 Acres (2.18 Hectare)",
      potKharaba: "0.16 Hectare",
      landType: "Bagayat (Perennial Panchganga Lift)",
      cropSeason: "Sugarcane (Co 86032), Soybean (JS 335)"
    },
    profileComparison: [
      { field: "Holder Full Name", profileValue: "Ram Patil", ocrValue: "Ramchandra Govind Patil", status: "match", matchScore: 95 },
      { field: "7/12 Survey Gat No.", profileValue: "Gat No. 412/A", ocrValue: "Gat No. 412/A", status: "exact", matchScore: 100 },
      { field: "Village / Taluka", profileValue: "Shiroli, Karvir", ocrValue: "Shiroli, Karvir", status: "exact", matchScore: 100 },
      { field: "Landholding Area", profileValue: "5.4 Acres", ocrValue: "5.4 Acres (2.18 Ha)", status: "exact", matchScore: 100 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-18T06:20:00.000Z", actor: "Ram Patil", notes: "Certified digital 7/12 with QR code uploaded" },
      { action: "ADMIN_APPROVED", timestamp: "2026-09-18T06:30:00.000Z", actor: "root@agrovercity", notes: "Approved: Verified against Maharashtra Land Record Portal. Land Verified badge issued." }
    ]
  },
  {
    id: "KYC-2005",
    userId: "fb_uid_sunita_more_88421",
    userName: "Sunita More",
    userMobile: "+91 98901 23456",
    userPersona: "Farmer",
    userCity: "Satara, Maharashtra",
    docId: "DOC-805",
    docType: "bank_passbook",
    docName: "State Bank of India Passbook Front Page",
    fileSize: "1.6 MB",
    mimeType: "image/jpeg",
    status: "verified",
    submittedAt: "2026-09-15T08:20:00.000Z",
    reviewedAt: "2026-09-15T09:00:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    verificationBadgeIssued: true,
    ocrConfidenceScore: 97,
    dpdpComplianceStatus: "verified_masked",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "A/C: XXXXXX9921",
      holderName: "Sunita Ramesh More",
      bankName: "State Bank of India",
      branchName: "Wai Branch, Satara",
      ifscCode: "SBIN0000491",
      micrCode: "415002081",
      accountType: "Mahila Savings A/C"
    },
    profileComparison: [
      { field: "Account Holder", profileValue: "Sunita More", ocrValue: "Sunita Ramesh More", status: "match", matchScore: 96 },
      { field: "Bank Name", profileValue: "State Bank of India", ocrValue: "State Bank of India", status: "exact", matchScore: 100 },
      { field: "IFSC Code", profileValue: "SBIN0000491", ocrValue: "SBIN0000491", status: "exact", matchScore: 100 },
      { field: "Branch Name", profileValue: "Wai, Satara", ocrValue: "Wai Branch, Satara", status: "exact", matchScore: 100 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-15T08:20:00.000Z", actor: "Sunita More", notes: "Passbook stamped copy uploaded" },
      { action: "ADMIN_APPROVED", timestamp: "2026-09-15T09:00:00.000Z", actor: "root@agrovercity", notes: "Bank account verified for direct SHG subsidy payouts." }
    ]
  },
  {
    id: "KYC-2006",
    userId: "fb_uid_anita_deshmukh_77210",
    userName: "Anita Deshmukh",
    userMobile: "+91 97302 99881",
    userPersona: "Transporter",
    userCity: "Solapur, Maharashtra",
    docId: "DOC-806",
    docType: "transport_permit",
    docName: "All-India Commercial Goods Carriage Permit",
    fileSize: "2.9 MB",
    mimeType: "application/pdf",
    status: "verified",
    submittedAt: "2026-09-14T10:00:00.000Z",
    reviewedAt: "2026-09-14T11:00:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    verificationBadgeIssued: true,
    ocrConfidenceScore: 99,
    dpdpComplianceStatus: "not_applicable",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "MH-13-CU-8841",
      holderName: "Anita Logistics Enterprise",
      vehicleMake: "Tata Motors LPT 407 (Reefer Insulated)",
      registeredOwner: "Anita Dilip Deshmukh",
      permitType: "National Goods Permit (All-India)",
      validUntil: "2028-08-31",
      grossVehicleWeight: "4,450 KG"
    },
    profileComparison: [
      { field: "Fleet Operator", profileValue: "Anita Deshmukh", ocrValue: "Anita Dilip Deshmukh", status: "match", matchScore: 98 },
      { field: "Registration No.", profileValue: "MH-13-CU-8841", ocrValue: "MH-13-CU-8841", status: "exact", matchScore: 100 },
      { field: "Permit Scope", profileValue: "National All-India", ocrValue: "National Goods Permit", status: "exact", matchScore: 100 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-14T10:00:00.000Z", actor: "Anita Deshmukh", notes: "Uploaded commercial RTO permit" },
      { action: "ADMIN_APPROVED", timestamp: "2026-09-14T11:00:00.000Z", actor: "root@agrovercity", notes: "Approved: Transport verified badge active." }
    ]
  },
  {
    id: "KYC-2007",
    userId: "fb_uid_vikram_rathod_66190",
    userName: "Vikram Rathod",
    userMobile: "+91 99225 44332",
    userPersona: "Equipment Owner",
    userCity: "Chhatrapati Sambhajinagar, Maharashtra",
    docId: "DOC-807",
    docType: "transport_permit",
    docName: "Harvester Commercial Fitness Certificate",
    fileSize: "1.9 MB",
    mimeType: "image/jpeg",
    status: "rejected",
    submittedAt: "2026-09-10T10:15:00.000Z",
    reviewedAt: "2026-09-10T12:00:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: "Fitness certificate expired on 2024-05-15. Commercial machinery operations require active roadworthiness certificate.",
    verificationBadgeIssued: false,
    ocrConfidenceScore: 62,
    dpdpComplianceStatus: "not_applicable",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "MH-20-DE-1190",
      holderName: "Vikram Singh Rathod",
      machineryType: "Combine Harvester (Preet 987)",
      validUntil: "2024-05-15 (EXPIRED)",
      fitnessStatus: "Lapsed / Requires Re-Inspection"
    },
    profileComparison: [
      { field: "Machinery Owner", profileValue: "Vikram Rathod", ocrValue: "Vikram Singh Rathod", status: "match", matchScore: 94 },
      { field: "Validity Date", profileValue: "Active 2026", ocrValue: "2024-05-15 (EXPIRED)", status: "mismatch", matchScore: 20 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-10T10:15:00.000Z", actor: "Vikram Rathod", notes: "Old fitness certificate scan uploaded" },
      { action: "ADMIN_REJECTED", timestamp: "2026-09-10T12:00:00.000Z", actor: "root@agrovercity", notes: "Rejected: Expired roadworthiness certificate." }
    ]
  },
  {
    id: "KYC-2008",
    userId: "fb_uid_rajesh_verma_44122",
    userName: "Rajesh Verma",
    userMobile: "+91 98110 55443",
    userPersona: "Seller",
    userCity: "New Delhi, Delhi",
    docId: "DOC-808",
    docType: "seller_license",
    docName: "Agri-Input Wholesale & Seed Trade License",
    fileSize: "2.3 MB",
    mimeType: "image/jpeg",
    status: "pending",
    submittedAt: "2026-09-08T07:30:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    verificationBadgeIssued: false,
    ocrConfidenceScore: 89,
    dpdpComplianceStatus: "not_applicable",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "DL-AGRO-SEED-8819/2022",
      holderName: "Verma Seeds & Commercial Agri Hub",
      licenseType: "Fertilizer (FARM-CHEM-1) & Certified Seeds Wholesale",
      gstin: "07AAACV9918B1Z2",
      validUntil: "2027-12-31"
    },
    profileComparison: [
      { field: "Trade Entity", profileValue: "Rajesh Verma", ocrValue: "Verma Seeds & Commercial", status: "match", matchScore: 88 },
      { field: "GSTIN Number", profileValue: "07AAACV9918B1Z2", ocrValue: "07AAACV9918B1Z2", status: "exact", matchScore: 100 },
      { field: "License Number", profileValue: "DL-AGRO-SEED-8819", ocrValue: "DL-AGRO-SEED-8819/2022", status: "exact", matchScore: 98 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-08T07:30:00.000Z", actor: "Rajesh Verma", notes: "Uploaded Delhi Seed Licensing document" }
    ]
  },
  {
    id: "KYC-2009",
    userId: "fb_uid_ananya_kulkarni_12098",
    userName: "Dr. Ananya Kulkarni",
    userMobile: "+91 94220 88123",
    userPersona: "Farmer",
    userCity: "Pune, Maharashtra",
    docId: "DOC-809",
    docType: "soil_health_card",
    docName: "ICAR-KVK Certified Soil Health Card & Nutrient Profile",
    fileSize: "1.7 MB",
    mimeType: "image/jpeg",
    status: "verified",
    submittedAt: "2026-09-01T05:20:00.000Z",
    reviewedAt: "2026-09-01T06:00:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    verificationBadgeIssued: true,
    ocrConfidenceScore: 99,
    dpdpComplianceStatus: "not_applicable",
    encryptionStatus: "AES-256-GCM Encrypted at Rest",
    extractedFields: {
      documentNumber: "SHC-MH-2026-0012",
      holderName: "Dr. Ananya Kulkarni",
      testingLab: "ICAR Baramati Regional Soil Science Laboratory",
      phValue: "7.15 (Optimal Neutral)",
      organicCarbon: "1.12% (High / Superior Soil Health)",
      nitrogenN: "Medium",
      phosphorusP: "High",
      potassiumK: "Very High",
      recommendedCrops: "Dragonfruit, Tissue Culture Banana, Organic Avocado"
    },
    profileComparison: [
      { field: "Beneficiary Name", profileValue: "Dr. Ananya Kulkarni", ocrValue: "Dr. Ananya Kulkarni", status: "exact", matchScore: 100 },
      { field: "SHC Reference", profileValue: "SHC-MH-2026-0012", ocrValue: "SHC-MH-2026-0012", status: "exact", matchScore: 100 },
      { field: "Gat Location", profileValue: "Baramati Gat 31", ocrValue: "Baramati Gat No. 31/1B", status: "exact", matchScore: 98 }
    ],
    auditTrail: [
      { action: "DOCUMENT_UPLOADED", timestamp: "2026-09-01T05:20:00.000Z", actor: "Dr. Ananya Kulkarni", notes: "Soil Health Card test results uploaded" },
      { action: "ADMIN_APPROVED", timestamp: "2026-09-01T06:00:00.000Z", actor: "root@agrovercity", notes: "Accredited model farm soil profile verified." }
    ]
  }
];

export const COMMODITIES_LIST = [
  'All Commodities',
  'Onion (Nashik Red)',
  'Sugarcane (Co 86032)',
  'Soybean (Yellow)',
  'Turmeric (Salem)',
  'Table Grapes (Thompson)',
  'Bt Cotton (Medium)',
  'Pomegranate (Bhagwa)'
];

export const INITIAL_MANDI_BENCHMARKS = [
  {
    id: "MP-501",
    mandiName: "Lasalgaon APMC",
    state: "Maharashtra",
    district: "Nashik",
    commodity: "Onion (Nashik Red)",
    variety: "Pola / Summer Crop",
    minPrice: 1850,
    maxPrice: 2650,
    modalPrice: 2250,
    unit: "₹/Quintal",
    arrivalTonnage: 420,
    syncTimestamp: "2026-09-20T08:00:00.000Z",
    syncStatus: "synced",
    sourceApi: "Agmarknet eNAM Central Gateway",
    latencyMs: 145,
    sanityBand: { lowerLimit: 1912, upperLimit: 2588, tolerancePercent: 15 }
  },
  {
    id: "MP-502",
    mandiName: "Kolhapur Market Yard",
    state: "Maharashtra",
    district: "Kolhapur",
    commodity: "Sugarcane (Co 86032)",
    variety: "Co 86032 High Recovery",
    minPrice: 3100,
    maxPrice: 3700,
    modalPrice: 3400,
    unit: "₹/Quintal",
    arrivalTonnage: 1250,
    syncTimestamp: "2026-09-20T08:15:00.000Z",
    syncStatus: "synced",
    sourceApi: "Maharashtra MSAMB Gateway",
    latencyMs: 180,
    sanityBand: { lowerLimit: 2890, upperLimit: 3910, tolerancePercent: 15 }
  },
  {
    id: "MP-503",
    mandiName: "Sangli Turmeric Mandi",
    state: "Maharashtra",
    district: "Sangli",
    commodity: "Turmeric (Salem)",
    variety: "Salem Double Polished",
    minPrice: 12800,
    maxPrice: 16500,
    modalPrice: 14200,
    unit: "₹/Quintal",
    arrivalTonnage: 280,
    syncTimestamp: "2026-09-20T07:45:00.000Z",
    syncStatus: "synced",
    sourceApi: "Agmarknet eNAM Central Gateway",
    latencyMs: 210,
    sanityBand: { lowerLimit: 12070, upperLimit: 16330, tolerancePercent: 15 }
  },
  {
    id: "MP-504",
    mandiName: "Pune Gultekdi APMC",
    state: "Maharashtra",
    district: "Pune",
    commodity: "Soybean (Yellow)",
    variety: "JS 335 Milling Quality",
    minPrice: 4200,
    maxPrice: 4900,
    modalPrice: 4650,
    unit: "₹/Quintal",
    arrivalTonnage: 540,
    syncTimestamp: "2026-09-20T08:20:00.000Z",
    syncStatus: "synced",
    sourceApi: "Agmarknet eNAM Central Gateway",
    latencyMs: 160,
    sanityBand: { lowerLimit: 3952, upperLimit: 5348, tolerancePercent: 15 }
  },
  {
    id: "MP-505",
    mandiName: "Azadpur Mandi",
    state: "Delhi",
    district: "New Delhi",
    commodity: "Table Grapes (Thompson)",
    variety: "Export Grade Seedless",
    minPrice: 6800,
    maxPrice: 9500,
    modalPrice: 8200,
    unit: "₹/Quintal",
    arrivalTonnage: 310,
    syncTimestamp: "2026-09-20T07:30:00.000Z",
    syncStatus: "synced",
    sourceApi: "DMI Agmarknet National Portal",
    latencyMs: 290,
    sanityBand: { lowerLimit: 6970, upperLimit: 9430, tolerancePercent: 15 }
  },
  {
    id: "MP-506",
    mandiName: "Nanded APMC",
    state: "Maharashtra",
    district: "Nanded",
    commodity: "Bt Cotton (Medium)",
    variety: "Bollgard II Medium Staple",
    minPrice: 6400,
    maxPrice: 7600,
    modalPrice: 7100,
    unit: "₹/Quintal",
    arrivalTonnage: 680,
    syncTimestamp: "2026-09-20T05:00:00.000Z",
    syncStatus: "delayed",
    sourceApi: "Agmarknet eNAM Central Gateway",
    latencyMs: 1420,
    sanityBand: { lowerLimit: 6035, upperLimit: 8165, tolerancePercent: 15 }
  },
  {
    id: "MP-507",
    mandiName: "Solapur Market Yard",
    state: "Maharashtra",
    district: "Solapur",
    commodity: "Pomegranate (Bhagwa)",
    variety: "Bhagwa Premium Red",
    minPrice: 8000,
    maxPrice: 11200,
    modalPrice: 9800,
    unit: "₹/Quintal",
    arrivalTonnage: 190,
    syncTimestamp: "2026-09-20T08:10:00.000Z",
    syncStatus: "synced",
    sourceApi: "Agmarknet eNAM Central Gateway",
    latencyMs: 175,
    sanityBand: { lowerLimit: 8330, upperLimit: 11270, tolerancePercent: 15 }
  },
  {
    id: "MP-508",
    mandiName: "Dindori Sub-Market",
    state: "Maharashtra",
    district: "Nashik",
    commodity: "Onion (Nashik Red)",
    variety: "Garva Onion Late Kharif",
    minPrice: 1700,
    maxPrice: 2400,
    modalPrice: 2100,
    unit: "₹/Quintal",
    arrivalTonnage: 220,
    syncTimestamp: "2026-09-19T18:00:00.000Z",
    syncStatus: "manual_override",
    sourceApi: "Manual Superadmin Field Override",
    latencyMs: 0,
    sanityBand: { lowerLimit: 1785, upperLimit: 2415, tolerancePercent: 15 }
  }
];

export const INITIAL_VYAPARI_RATES = [
  {
    id: "VR-901",
    vyapariId: "fb_uid_suresh_jadhav_55219",
    vyapariName: "Suresh Jadhav",
    vyapariMobile: "+91 94231 77650",
    tradeFirm: "Jadhav Krishi Mandi Vyapar",
    mandiId: "MP-501",
    mandiName: "Lasalgaon APMC",
    commodity: "Onion (Nashik Red)",
    offeredRate: 2350,
    unit: "₹/Quintal",
    benchmarkModalPrice: 2250,
    deviationPercent: 4.4,
    sanityBandStatus: "within_band",
    slot: "Morning 08:00 - 10:00",
    paymentTerms: "Spot Cash at Mandi Weighbridge",
    minQuantityQtl: 15,
    maxQuantityQtl: 200,
    status: "pending",
    submittedAt: "2026-09-20T08:05:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    publishedToApp: false,
    estimatedFreightDeduction: 120,
    netFarmerRealization: 2230
  },
  {
    id: "VR-902",
    vyapariId: "fb_uid_mahadev_shinde_33109",
    vyapariName: "Mahadev Shinde",
    vyapariMobile: "+91 97654 32180",
    tradeFirm: "Shinde Agri Commodities & Trading",
    mandiId: "MP-504",
    mandiName: "Pune Gultekdi APMC",
    commodity: "Soybean (Yellow)",
    offeredRate: 3800,
    unit: "₹/Quintal",
    benchmarkModalPrice: 4650,
    deviationPercent: -18.3,
    sanityBandStatus: "predatory_low",
    slot: "Midday 12:00 - 14:00",
    paymentTerms: "Same Day RTGS",
    minQuantityQtl: 25,
    maxQuantityQtl: 500,
    status: "flagged",
    submittedAt: "2026-09-20T07:50:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "Rate is -18.3% below official Agmarknet modal price (Exceeds -15% predatory threshold)",
    publishedToApp: false,
    estimatedFreightDeduction: 150,
    netFarmerRealization: 3650
  },
  {
    id: "VR-903",
    vyapariId: "fb_uid_rajesh_verma_44122",
    vyapariName: "Rajesh Verma",
    vyapariMobile: "+91 98110 55443",
    tradeFirm: "Verma Seeds & Commercial Agri",
    mandiId: "MP-505",
    mandiName: "Azadpur Mandi",
    commodity: "Table Grapes (Thompson)",
    offeredRate: 8400,
    unit: "₹/Quintal",
    benchmarkModalPrice: 8200,
    deviationPercent: 2.4,
    sanityBandStatus: "within_band",
    slot: "Morning 08:00 - 10:00",
    paymentTerms: "24-Hr Escrow via Agrovercity",
    minQuantityQtl: 20,
    maxQuantityQtl: 300,
    status: "approved",
    submittedAt: "2026-09-20T07:15:00.000Z",
    reviewedAt: "2026-09-20T07:25:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    publishedToApp: true,
    estimatedFreightDeduction: 450,
    netFarmerRealization: 7950
  },
  {
    id: "VR-904",
    vyapariId: "fb_uid_prakash_patil_77180",
    vyapariName: "Prakash Bapu Patil",
    vyapariMobile: "+91 94224 55102",
    tradeFirm: "Tasgaon Fruits & Spices Network",
    mandiId: "MP-503",
    mandiName: "Sangli Turmeric Mandi",
    commodity: "Turmeric (Salem)",
    offeredRate: 14500,
    unit: "₹/Quintal",
    benchmarkModalPrice: 14200,
    deviationPercent: 2.1,
    sanityBandStatus: "within_band",
    slot: "Morning 08:00 - 10:00",
    paymentTerms: "Immediate Direct NEFT",
    minQuantityQtl: 10,
    maxQuantityQtl: 150,
    status: "approved",
    submittedAt: "2026-09-20T07:30:00.000Z",
    reviewedAt: "2026-09-20T07:40:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    publishedToApp: true,
    estimatedFreightDeduction: 200,
    netFarmerRealization: 14300
  },
  {
    id: "VR-905",
    vyapariId: "fb_uid_suresh_jadhav_55219",
    vyapariName: "Suresh Jadhav",
    vyapariMobile: "+91 94231 77650",
    tradeFirm: "Jadhav Krishi Mandi Vyapar",
    mandiId: "MP-508",
    mandiName: "Dindori Sub-Market",
    commodity: "Onion (Nashik Red)",
    offeredRate: 2150,
    unit: "₹/Quintal",
    benchmarkModalPrice: 2100,
    deviationPercent: 2.4,
    sanityBandStatus: "within_band",
    slot: "Midday 12:00 - 14:00",
    paymentTerms: "Spot Cash at Weighbridge",
    minQuantityQtl: 20,
    maxQuantityQtl: 250,
    status: "pending",
    submittedAt: "2026-09-20T08:10:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    publishedToApp: false,
    estimatedFreightDeduction: 90,
    netFarmerRealization: 2060
  },
  {
    id: "VR-906",
    vyapariId: "fb_uid_kisan_syndicate_11029",
    vyapariName: "Kisan Traders Syndicate",
    vyapariMobile: "+91 98230 44911",
    tradeFirm: "Kisan Commercial Sugar Corp",
    mandiId: "MP-502",
    mandiName: "Kolhapur Market Yard",
    commodity: "Sugarcane (Co 86032)",
    offeredRate: 4200,
    unit: "₹/Quintal",
    benchmarkModalPrice: 3400,
    deviationPercent: 23.5,
    sanityBandStatus: "inflated_high",
    slot: "Evening 16:00 - 18:00",
    paymentTerms: "Cash",
    minQuantityQtl: 50,
    maxQuantityQtl: 1000,
    status: "rejected",
    submittedAt: "2026-09-19T16:00:00.000Z",
    reviewedAt: "2026-09-19T16:15:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: "Offered rate ₹4,200 exceeds upper +15% sanity band (₹3,910). Suspicion of speculative bidding without proof of purchase.",
    publishedToApp: false,
    estimatedFreightDeduction: 140,
    netFarmerRealization: 4060
  },
  {
    id: "VR-907",
    vyapariId: "fb_uid_sunita_more_88421",
    vyapariName: "Sunita More",
    vyapariMobile: "+91 98901 23456",
    tradeFirm: "Savitribai Phule Women SHG Hub",
    mandiId: "MP-503",
    mandiName: "Sangli Turmeric Mandi",
    commodity: "Turmeric (Salem)",
    offeredRate: 15200,
    unit: "₹/Quintal",
    benchmarkModalPrice: 14200,
    deviationPercent: 7.0,
    sanityBandStatus: "within_band",
    slot: "Morning 08:00 - 10:00",
    paymentTerms: "Direct Bank Transfer to SHG Account",
    minQuantityQtl: 5,
    maxQuantityQtl: 80,
    status: "approved",
    submittedAt: "2026-09-20T08:00:00.000Z",
    reviewedAt: "2026-09-20T08:10:00.000Z",
    reviewedBy: "root@agrovercity",
    rejectionReason: null,
    publishedToApp: true,
    estimatedFreightDeduction: 180,
    netFarmerRealization: 15020
  },
  {
    id: "VR-908",
    vyapariId: "fb_uid_anita_deshmukh_77210",
    vyapariName: "Anita Deshmukh",
    vyapariMobile: "+91 97302 99881",
    tradeFirm: "Anita Agro Logistics & Trading",
    mandiId: "MP-507",
    mandiName: "Solapur Market Yard",
    commodity: "Pomegranate (Bhagwa)",
    offeredRate: 10100,
    unit: "₹/Quintal",
    benchmarkModalPrice: 9800,
    deviationPercent: 3.1,
    sanityBandStatus: "within_band",
    slot: "Midday 12:00 - 14:00",
    paymentTerms: "48-Hour Escrow on Reefer Unloading",
    minQuantityQtl: 30,
    maxQuantityQtl: 400,
    status: "pending",
    submittedAt: "2026-09-20T08:20:00.000Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
    publishedToApp: false,
    estimatedFreightDeduction: 260,
    netFarmerRealization: 9840
  }
];

export const INITIAL_MANDI_HISTORY = [
  { date: "14 Sep", LasalgaonOnion: 2150, PuneSoybean: 4580, SangliTurmeric: 13900, KolhapurSugarcane: 3380 },
  { date: "15 Sep", LasalgaonOnion: 2180, PuneSoybean: 4600, SangliTurmeric: 14000, KolhapurSugarcane: 3390 },
  { date: "16 Sep", LasalgaonOnion: 2200, PuneSoybean: 4620, SangliTurmeric: 14100, KolhapurSugarcane: 3400 },
  { date: "17 Sep", LasalgaonOnion: 2220, PuneSoybean: 4630, SangliTurmeric: 14150, KolhapurSugarcane: 3410 },
  { date: "18 Sep", LasalgaonOnion: 2240, PuneSoybean: 4640, SangliTurmeric: 14200, KolhapurSugarcane: 3400 },
  { date: "19 Sep", LasalgaonOnion: 2230, PuneSoybean: 4650, SangliTurmeric: 14180, KolhapurSugarcane: 3400 },
  { date: "20 Sep", LasalgaonOnion: 2250, PuneSoybean: 4650, SangliTurmeric: 14200, KolhapurSugarcane: 3400 }
];

// ==========================================
// MODULE 05: PRODUCE LOTS & B2B TRADING (SOP-05)
// Target Collections: market_lots, deals, procurements, buyer_ledgers
// ==========================================

export const INITIAL_MARKET_LOTS = [
  {
    id: "LOT-701",
    farmerId: "USR-1001",
    farmerName: "Ram Patil",
    farmerMobile: "+91 98220 14592",
    district: "Kolhapur",
    state: "Maharashtra",
    village: "Shiroli",
    commodity: "Soybean",
    variety: "JS-335 (Yellow Bold)",
    quantityQtl: 120,
    reservePrice: 4800,
    estimatedTotalValue: 576000,
    qualityGrade: "Grade A (Export Quality)",
    qualityParams: {
      moisturePercent: 9.2,
      foreignMatterPercent: 0.8,
      damagedGrainsPercent: 0.4,
      oilContentPercent: 19.4,
      certifiedBy: "Kolhapur APMC Quality Assayer #4"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-KOP-8841",
      grossWeightKg: 14620,
      tareWeightKg: 2620,
      netWeightKg: 12000,
      netQuintals: 120,
      weighbridgeName: "Shiroli Central APMC Electronic Dharam Kanta",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-19T10:15:00.000Z",
      variancePercent: 0.0
    },
    status: "active",
    bidsCount: 4,
    highestBid: {
      traderId: "USR-1004",
      traderName: "Prakash Mehta",
      tradeFirm: "Kisan Vyapar Kendra",
      bidPrice: 4920,
      bidTimestamp: "2026-09-20T07:45:00.000Z"
    },
    dealId: null,
    createdAt: "2026-09-18T14:30:00.000Z",
    updatedAt: "2026-09-20T07:45:00.000Z"
  },
  {
    id: "LOT-702",
    farmerId: "USR-1002",
    farmerName: "Suresh Jadhav",
    farmerMobile: "+91 94231 77610",
    district: "Nashik",
    state: "Maharashtra",
    village: "Niphad",
    commodity: "Onion",
    variety: "Garva (Late Kharif Red)",
    quantityQtl: 250,
    reservePrice: 2200,
    estimatedTotalValue: 550000,
    qualityGrade: "FAQ (Fair Average Quality)",
    qualityParams: {
      moisturePercent: 12.1,
      foreignMatterPercent: 1.5,
      damagedGrainsPercent: 1.8,
      bulbSizeMm: "55mm - 65mm",
      certifiedBy: "Lasalgaon Grading Cell"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-LSG-4102",
      grossWeightKg: 28400,
      tareWeightKg: 3400,
      netWeightKg: 25000,
      netQuintals: 250,
      weighbridgeName: "Lasalgaon APMC Gate #1 Weighbridge",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-19T14:00:00.000Z",
      variancePercent: 0.0
    },
    status: "under_review",
    bidsCount: 2,
    highestBid: {
      traderId: "VR-901",
      traderName: "Sunil Agrawal",
      tradeFirm: "Agrawal Onion Traders",
      bidPrice: 2250,
      bidTimestamp: "2026-09-20T08:10:00.000Z"
    },
    dealId: null,
    createdAt: "2026-09-19T09:00:00.000Z",
    updatedAt: "2026-09-20T08:10:00.000Z"
  },
  {
    id: "LOT-703",
    farmerId: "USR-1003",
    farmerName: "Mahadev Shinde",
    farmerMobile: "+91 97644 88321",
    district: "Sangli",
    state: "Maharashtra",
    village: "Miraj",
    commodity: "Turmeric",
    variety: "Salem Finger (Special Polished)",
    quantityQtl: 80,
    reservePrice: 14500,
    estimatedTotalValue: 1160000,
    qualityGrade: "Grade 1 Export (Curcumin 4.2%)",
    qualityParams: {
      moisturePercent: 8.5,
      foreignMatterPercent: 0.5,
      damagedGrainsPercent: 0.2,
      curcuminPercent: 4.25,
      certifiedBy: "Spices Board Assayer Sangli"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-SGL-9921",
      grossWeightKg: 10450,
      tareWeightKg: 2450,
      netWeightKg: 8000,
      netQuintals: 80,
      weighbridgeName: "Sangli Spices APMC Platform #2",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-18T16:20:00.000Z",
      variancePercent: 0.0
    },
    status: "deal_locked",
    bidsCount: 6,
    highestBid: {
      traderId: "BUY-401",
      traderName: "Rajesh Gupta",
      tradeFirm: "MahaSpices Global Exports Ltd",
      bidPrice: 14650,
      bidTimestamp: "2026-09-19T11:30:00.000Z"
    },
    dealId: "DEAL-501",
    createdAt: "2026-09-17T11:00:00.000Z",
    updatedAt: "2026-09-19T11:30:00.000Z"
  },
  {
    id: "LOT-704",
    farmerId: "USR-1004",
    farmerName: "Laxman Thorat",
    farmerMobile: "+91 98901 23456",
    district: "Solapur",
    state: "Maharashtra",
    village: "Pandharpur",
    commodity: "Pomegranate",
    variety: "Bhagwa (Arakta Red)",
    quantityQtl: 150,
    reservePrice: 10500,
    estimatedTotalValue: 1575000,
    qualityGrade: "Grade A+ (Super Premium)",
    qualityParams: {
      moisturePercent: 80.2,
      foreignMatterPercent: 0.0,
      damagedGrainsPercent: 3.5,
      fruitWeightGrams: "280g - 340g",
      certifiedBy: "Solapur Horti Assayer"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-SOL-3190",
      grossWeightKg: 18200,
      tareWeightKg: 3200,
      netWeightKg: 15000,
      netQuintals: 150,
      weighbridgeName: "Pandharpur Cold Storage Weighbridge",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: false,
      verifiedAt: null,
      variancePercent: -2.5
    },
    status: "disputed",
    bidsCount: 3,
    highestBid: {
      traderId: "BUY-402",
      traderName: "Deepak Parekh",
      tradeFirm: "FreshCold Logistics Mumbai",
      bidPrice: 10200,
      bidTimestamp: "2026-09-19T15:00:00.000Z"
    },
    dealId: "DEAL-502",
    disputeDetails: {
      reason: "Buyer claims 15% rot on cold store arrival; farmer states delay in reefer dispatch caused quality deterioration.",
      claimedDeduction: 229500,
      escrowLocked: 1530000,
      reportedAt: "2026-09-20T06:30:00.000Z"
    },
    createdAt: "2026-09-17T08:00:00.000Z",
    updatedAt: "2026-09-20T06:30:00.000Z"
  },
  {
    id: "LOT-705",
    farmerId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    farmerMobile: "+91 97655 43210",
    district: "Yavatmal",
    state: "Maharashtra",
    village: "Pusad",
    commodity: "Cotton",
    variety: "MCU-5 (Extra Long Staple)",
    quantityQtl: 95,
    reservePrice: 7200,
    estimatedTotalValue: 684000,
    qualityGrade: "Grade 1 Shankar Cotton",
    qualityParams: {
      moisturePercent: 7.8,
      foreignMatterPercent: 1.1,
      damagedGrainsPercent: 0.3,
      stapleLengthMm: "29.5mm",
      certifiedBy: "Cotton Corporation Field Inspector"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1594488554261-d703db5cf509?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-YTL-6721",
      grossWeightKg: 12150,
      tareWeightKg: 2650,
      netWeightKg: 9500,
      netQuintals: 95,
      weighbridgeName: "Pusad APMC Ginning Yard Dharam Kanta",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-18T11:00:00.000Z",
      variancePercent: 0.0
    },
    status: "sold",
    bidsCount: 5,
    highestBid: {
      traderId: "BUY-403",
      traderName: "Rohit Oswal",
      tradeFirm: "Vardhman Textiles Ludhiana",
      bidPrice: 7350,
      bidTimestamp: "2026-09-18T13:00:00.000Z"
    },
    dealId: "DEAL-503",
    createdAt: "2026-09-16T10:00:00.000Z",
    updatedAt: "2026-09-18T16:00:00.000Z"
  },
  {
    id: "LOT-706",
    farmerId: "USR-1006",
    farmerName: "Pandurang Kadam",
    farmerMobile: "+91 98224 55678",
    district: "Satara",
    state: "Maharashtra",
    village: "Karad",
    commodity: "Wheat",
    variety: "Sharbati Supreme (Amber Golden)",
    quantityQtl: 180,
    reservePrice: 2850,
    estimatedTotalValue: 513000,
    qualityGrade: "Grade A (Sharbati Milling)",
    qualityParams: {
      moisturePercent: 10.4,
      foreignMatterPercent: 0.6,
      damagedGrainsPercent: 0.5,
      proteinPercent: 13.2,
      certifiedBy: "Karad Grain Assayer"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-STR-1044",
      grossWeightKg: 21200,
      tareWeightKg: 3200,
      netWeightKg: 18000,
      netQuintals: 180,
      weighbridgeName: "Karad APMC Yard Weighbridge",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-19T17:00:00.000Z",
      variancePercent: 0.0
    },
    status: "active",
    bidsCount: 5,
    highestBid: {
      traderId: "BUY-404",
      traderName: "Manoj Agarwal",
      tradeFirm: "Pawanputra Roller Flour Mills",
      bidPrice: 2920,
      bidTimestamp: "2026-09-20T08:00:00.000Z"
    },
    dealId: null,
    createdAt: "2026-09-19T08:30:00.000Z",
    updatedAt: "2026-09-20T08:00:00.000Z"
  },
  {
    id: "LOT-707",
    farmerId: "USR-1007",
    farmerName: "Gopinath Munde",
    farmerMobile: "+91 94222 99881",
    district: "Beed",
    state: "Maharashtra",
    village: "Parli",
    commodity: "Chana",
    variety: "Desi Bold (Vijay Chana)",
    quantityQtl: 110,
    reservePrice: 5400,
    estimatedTotalValue: 594000,
    qualityGrade: "Unverified (Suspicious Listing)",
    qualityParams: {
      moisturePercent: 14.8,
      foreignMatterPercent: 3.2,
      damagedGrainsPercent: 4.1,
      certifiedBy: "Unverified / Self Reported"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-FAKE-0000",
      grossWeightKg: 0,
      tareWeightKg: 0,
      netWeightKg: 0,
      netQuintals: 0,
      weighbridgeName: "Not Provided / Counterfeit Slip Photo",
      slipPhotoUrl: null,
      verified: false,
      verifiedAt: null,
      variancePercent: 0.0
    },
    status: "suspended",
    bidsCount: 0,
    highestBid: null,
    dealId: null,
    suspensionDetails: {
      reason: "Suspected counterfeit listing: Stock photos matched online catalog and weighbridge slip serial missing from Parli APMC records.",
      suspendedAt: "2026-09-19T12:00:00.000Z",
      suspendedBy: "root@agrovercity"
    },
    createdAt: "2026-09-18T16:00:00.000Z",
    updatedAt: "2026-09-19T12:00:00.000Z"
  },
  {
    id: "LOT-708",
    farmerId: "USR-1008",
    farmerName: "Vikramaditya Bhosle",
    farmerMobile: "+91 98230 66778",
    district: "Pune",
    state: "Maharashtra",
    village: "Baramati",
    commodity: "Maize",
    variety: "Yellow Hybrid (Pioneer Feed)",
    quantityQtl: 320,
    reservePrice: 2150,
    estimatedTotalValue: 688000,
    qualityGrade: "Feed Grade FAQ (Moisture < 12%)",
    qualityParams: {
      moisturePercent: 11.2,
      foreignMatterPercent: 1.2,
      damagedGrainsPercent: 1.0,
      certifiedBy: "Baramati Agri Assayer"
    },
    lotPhotos: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80"
    ],
    weighbridgeSlip: {
      slipNumber: "WB-BRM-8012",
      grossWeightKg: 35800,
      tareWeightKg: 3800,
      netWeightKg: 32000,
      netQuintals: 320,
      weighbridgeName: "Baramati APMC Main Dharma Kanta",
      slipPhotoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      verified: true,
      verifiedAt: "2026-09-19T13:30:00.000Z",
      variancePercent: 0.0
    },
    status: "deal_locked",
    bidsCount: 3,
    highestBid: {
      traderId: "BUY-405",
      traderName: "Sanjay Singhal",
      tradeFirm: "Godrej Agrovet Animal Feed Ltd",
      bidPrice: 2180,
      bidTimestamp: "2026-09-20T08:15:00.000Z"
    },
    dealId: "DEAL-504",
    createdAt: "2026-09-19T11:00:00.000Z",
    updatedAt: "2026-09-20T08:15:00.000Z"
  }
];

export const INITIAL_DEALS = [
  {
    id: "DEAL-501",
    lotId: "LOT-703",
    commodity: "Turmeric (Salem)",
    quantityQtl: 80,
    farmerId: "USR-1003",
    farmerName: "Mahadev Shinde",
    farmerMobile: "+91 97644 88321",
    buyerId: "BUY-401",
    buyerName: "Rajesh Gupta",
    buyerFirm: "MahaSpices Global Exports Ltd",
    buyerMobile: "+91 98110 33445",
    brokerId: "BRK-201",
    brokerName: "Sanjay Kulkarni (Arhatiya #14)",
    brokeragePercent: 1.5,
    brokerageAmount: 17580,
    finalAgreedPrice: 14650,
    totalDealValue: 1172000,
    escrowStatus: "funded",
    escrowAmount: 1172000,
    escrowAccountRef: "ESCROW-ICICI-MH-9921",
    paymentStatus: "partial",
    deliveryStatus: "in_transit",
    status: "weighbridge_verified",
    createdAt: "2026-09-19T11:30:00.000Z",
    updatedAt: "2026-09-20T06:00:00.000Z"
  },
  {
    id: "DEAL-502",
    lotId: "LOT-704",
    commodity: "Pomegranate (Bhagwa)",
    quantityQtl: 150,
    farmerId: "USR-1004",
    farmerName: "Laxman Thorat",
    farmerMobile: "+91 98901 23456",
    buyerId: "BUY-402",
    buyerName: "Deepak Parekh",
    buyerFirm: "FreshCold Logistics Mumbai",
    buyerMobile: "+91 98200 44556",
    brokerId: null,
    brokerName: "Direct Farmer-Trader Procurement",
    brokeragePercent: 0.0,
    brokerageAmount: 0,
    finalAgreedPrice: 10200,
    totalDealValue: 1530000,
    escrowStatus: "disputed_hold",
    escrowAmount: 1530000,
    escrowAccountRef: "ESCROW-HDFC-MUM-7714",
    paymentStatus: "disputed",
    deliveryStatus: "delivered_disputed",
    status: "disputed",
    disputeReason: "Buyer docked ₹2,29,500 claiming cold chain rot. Farmer claims buyer took 36 hours to unload reefer van.",
    createdAt: "2026-09-19T15:00:00.000Z",
    updatedAt: "2026-09-20T06:30:00.000Z"
  },
  {
    id: "DEAL-503",
    lotId: "LOT-705",
    commodity: "Cotton (MCU-5)",
    quantityQtl: 95,
    farmerId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    farmerMobile: "+91 97655 43210",
    buyerId: "BUY-403",
    buyerName: "Rohit Oswal",
    buyerFirm: "Vardhman Textiles Ludhiana",
    buyerMobile: "+91 98140 77889",
    brokerId: "BRK-202",
    brokerName: "Vidarbha Cotton Broking House",
    brokeragePercent: 1.0,
    brokerageAmount: 6982,
    finalAgreedPrice: 7350,
    totalDealValue: 698250,
    escrowStatus: "released_to_farmer",
    escrowAmount: 698250,
    escrowAccountRef: "ESCROW-SBI-LDH-4410",
    paymentStatus: "paid",
    deliveryStatus: "delivered_and_accepted",
    status: "completed",
    createdAt: "2026-09-18T13:00:00.000Z",
    updatedAt: "2026-09-19T18:00:00.000Z"
  },
  {
    id: "DEAL-504",
    lotId: "LOT-708",
    commodity: "Maize (Hybrid)",
    quantityQtl: 320,
    farmerId: "USR-1008",
    farmerName: "Vikramaditya Bhosle",
    farmerMobile: "+91 98230 66778",
    buyerId: "BUY-405",
    buyerName: "Sanjay Singhal",
    buyerFirm: "Godrej Agrovet Animal Feed Ltd",
    buyerMobile: "+91 98229 11223",
    brokerId: null,
    brokerName: "Direct Institutional Purchase Order",
    brokeragePercent: 0.0,
    brokerageAmount: 0,
    finalAgreedPrice: 2180,
    totalDealValue: 697600,
    escrowStatus: "funded",
    escrowAmount: 697600,
    escrowAccountRef: "ESCROW-AXIS-PUN-3319",
    paymentStatus: "partial",
    deliveryStatus: "dispatched",
    status: "contract_signed",
    createdAt: "2026-09-20T08:15:00.000Z",
    updatedAt: "2026-09-20T08:30:00.000Z"
  }
];

export const INITIAL_PROCUREMENTS = [
  {
    id: "PROC-901",
    dealId: "DEAL-501",
    lotId: "LOT-703",
    traderId: "BUY-401",
    traderName: "Rajesh Gupta",
    traderFirm: "MahaSpices Global Exports Ltd",
    farmerId: "USR-1003",
    farmerName: "Mahadev Shinde",
    commodity: "Turmeric (Salem)",
    procuredQuantityQtl: 80,
    agreedRate: 14650,
    totalAmount: 1172000,
    paidAmount: 800000,
    pendingAmount: 372000,
    paymentDueDate: "2026-09-24",
    weighbridgeSlipNo: "WB-SGL-9921",
    weighbridgeVerified: true,
    slipPhotoAttached: true,
    status: "verified",
    createdAt: "2026-09-19T16:00:00.000Z"
  },
  {
    id: "PROC-902",
    dealId: "DEAL-502",
    lotId: "LOT-704",
    traderId: "BUY-402",
    traderName: "Deepak Parekh",
    traderFirm: "FreshCold Logistics Mumbai",
    farmerId: "USR-1004",
    farmerName: "Laxman Thorat",
    commodity: "Pomegranate (Bhagwa)",
    procuredQuantityQtl: 150,
    agreedRate: 10200,
    totalAmount: 1530000,
    paidAmount: 0,
    pendingAmount: 1530000,
    paymentDueDate: "2026-09-21",
    weighbridgeSlipNo: "WB-SOL-3190",
    weighbridgeVerified: false,
    slipPhotoAttached: true,
    status: "disputed",
    createdAt: "2026-09-19T18:00:00.000Z"
  },
  {
    id: "PROC-903",
    dealId: "DEAL-503",
    lotId: "LOT-705",
    traderId: "BUY-403",
    traderName: "Rohit Oswal",
    traderFirm: "Vardhman Textiles Ludhiana",
    farmerId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    commodity: "Cotton (MCU-5)",
    procuredQuantityQtl: 95,
    agreedRate: 7350,
    totalAmount: 698250,
    paidAmount: 698250,
    pendingAmount: 0,
    paymentDueDate: "2026-09-18",
    weighbridgeSlipNo: "WB-YTL-6721",
    weighbridgeVerified: true,
    slipPhotoAttached: true,
    status: "settled",
    createdAt: "2026-09-18T14:00:00.000Z"
  },
  {
    id: "PROC-904",
    dealId: "DEAL-504",
    lotId: "LOT-708",
    traderId: "BUY-405",
    traderName: "Sanjay Singhal",
    traderFirm: "Godrej Agrovet Animal Feed Ltd",
    farmerId: "USR-1008",
    farmerName: "Vikramaditya Bhosle",
    commodity: "Maize (Hybrid)",
    procuredQuantityQtl: 320,
    agreedRate: 2180,
    totalAmount: 697600,
    paidAmount: 200000,
    pendingAmount: 497600,
    paymentDueDate: "2026-09-28",
    weighbridgeSlipNo: "WB-BRM-8012",
    weighbridgeVerified: true,
    slipPhotoAttached: true,
    status: "payment_due",
    createdAt: "2026-09-20T08:30:00.000Z"
  }
];

export const INITIAL_BUYER_LEDGERS = [
  {
    id: "BL-301",
    buyerId: "BUY-401",
    buyerName: "Rajesh Gupta",
    buyerFirm: "MahaSpices Global Exports Ltd",
    apmcLicenseNo: "APMC-MH-SGL-4491",
    contactMobile: "+91 98110 33445",
    creditRating: "AA (Prime)",
    totalPurchasesVal: 18400000,
    totalSettledVal: 15200000,
    currentUdhaarBalance: 3200000,
    creditLimit: 5000000,
    creditUtilizationPercent: 64.0,
    daysOverdue: 4,
    activeDealsCount: 3,
    accountStatus: "active",
    defaultRisk: "low",
    lastPaymentDate: "2026-09-16T11:00:00.000Z",
    panMasked: "AAAA*****G",
    gstin: "27AAACG1234F1Z5"
  },
  {
    id: "BL-302",
    buyerId: "BUY-402",
    buyerName: "Deepak Parekh",
    buyerFirm: "FreshCold Logistics Mumbai",
    apmcLicenseNo: "APMC-MH-PUN-8120",
    contactMobile: "+91 98200 44556",
    creditRating: "C- (High Risk)",
    totalPurchasesVal: 9540000,
    totalSettledVal: 6800000,
    currentUdhaarBalance: 2740000,
    creditLimit: 2500000,
    creditUtilizationPercent: 109.6,
    daysOverdue: 18,
    activeDealsCount: 2,
    accountStatus: "warning_limit_exceeded",
    defaultRisk: "critical",
    lastPaymentDate: "2026-09-02T14:30:00.000Z",
    panMasked: "ABCP*****D",
    gstin: "27ABCPD5678J1ZX"
  },
  {
    id: "BL-303",
    buyerId: "BUY-403",
    buyerName: "Rohit Oswal",
    buyerFirm: "Vardhman Textiles Ludhiana",
    apmcLicenseNo: "APMC-PB-LDH-1029",
    contactMobile: "+91 98140 77889",
    creditRating: "AAA (Institutional)",
    totalPurchasesVal: 42000000,
    totalSettledVal: 42000000,
    currentUdhaarBalance: 0,
    creditLimit: 10000000,
    creditUtilizationPercent: 0.0,
    daysOverdue: 0,
    activeDealsCount: 1,
    accountStatus: "active",
    defaultRisk: "low",
    lastPaymentDate: "2026-09-18T14:00:00.000Z",
    panMasked: "AAAC*****O",
    gstin: "03AAACV9012K1Z9"
  },
  {
    id: "BL-304",
    buyerId: "BUY-405",
    buyerName: "Sanjay Singhal",
    buyerFirm: "Godrej Agrovet Animal Feed Ltd",
    apmcLicenseNo: "APMC-MH-BRM-6621",
    contactMobile: "+91 98229 11223",
    creditRating: "AAA (Corporate)",
    totalPurchasesVal: 31000000,
    totalSettledVal: 26024000,
    currentUdhaarBalance: 4976000,
    creditLimit: 15000000,
    creditUtilizationPercent: 33.2,
    daysOverdue: 0,
    activeDealsCount: 2,
    accountStatus: "active",
    defaultRisk: "low",
    lastPaymentDate: "2026-09-19T09:15:00.000Z",
    panMasked: "AAACG*****G",
    gstin: "27AAACG4321A1Z2"
  }
];

// ==========================================
// MODULE 06: INPUT MARKETPLACE, CART, ORDERS & PAYMENTS (SOP-06)
// Target Collections: products, orders, payments, reviews
// ==========================================

export const MARKETPLACE_CATEGORIES = [
  'Seeds',
  'Fertilizers',
  'Pesticides & Fungicides',
  'Machinery & Tools',
  'Irrigation',
  'Bio-stimulants'
];

export const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    name: "Mahyco Soybean Seeds JS-335 (Certified 30kg Bag)",
    brand: "Mahyco Seeds Ltd",
    category: "Seeds",
    subCategory: "Oilseeds",
    sku: "AGR-SED-SOY-335",
    mrp: 3400,
    price: 2950,
    discountPercent: 13.2,
    stockQuantity: 145,
    unit: "30kg Bag",
    qrCertificate: {
      certificateNumber: "AGM-MH-2026-8819",
      authority: "Agmarknet Seed Testing Laboratory Nagpur",
      batchNumber: "MHC-SOY-B2026-04",
      labTestDate: "2026-08-15",
      purityPercent: 99.4,
      germinationPercent: 88.0,
      moisturePercent: 9.1,
      expiryDate: "2027-08-14",
      verified: true,
      verifiedAt: "2026-08-20T10:00:00.000Z"
    },
    distributorFirm: "Vidarbha Seeds & Agro Inputs Corp",
    distributorMobile: "+91 98230 44551",
    distributorLocation: "Akola, Maharashtra",
    dealerCommissionPercent: 6.5,
    rating: 4.8,
    reviewsCount: 38,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80",
    description: "High-yield resistant JS-335 certified soybean seeds suitable for medium to heavy black soils.",
    createdAt: "2026-08-20T10:00:00.000Z",
    updatedAt: "2026-09-18T14:30:00.000Z"
  },
  {
    id: "PROD-102",
    name: "IFFCO Urea (Neem Coated 45kg)",
    brand: "IFFCO",
    category: "Fertilizers",
    subCategory: "Nitrogenous Fertilizers",
    sku: "AGR-FRT-UREA-045",
    mrp: 300,
    price: 266.50,
    discountPercent: 11.2,
    stockQuantity: 420,
    unit: "45kg Bag",
    qrCertificate: {
      certificateNumber: "FERT-GOV-2026-9902",
      authority: "Department of Fertilizers, Ministry of Chemicals",
      batchNumber: "IFF-KALOL-2026-77B",
      labTestDate: "2026-09-01",
      purityPercent: 99.8,
      nitrogenPercent: 46.0,
      biuretPercent: 0.8,
      expiryDate: "2028-09-01",
      verified: true,
      verifiedAt: "2026-09-05T09:00:00.000Z"
    },
    distributorFirm: "IFFCO Central Buffer Depot Kolhapur",
    distributorMobile: "+91 98220 99112",
    distributorLocation: "Kolhapur, Maharashtra",
    dealerCommissionPercent: 4.0,
    rating: 4.9,
    reviewsCount: 112,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&q=80",
    description: "Govt subsidized neem coated urea with 46% nitrogen content for slow release and higher nitrogen use efficiency.",
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-09-19T11:00:00.000Z"
  },
  {
    id: "PROD-103",
    name: "Bayer Confidor Insecticide (Imidacloprid 17.8% SL 250ml)",
    brand: "Bayer CropScience",
    category: "Pesticides & Fungicides",
    subCategory: "Systemic Insecticides",
    sku: "AGR-PST-BYR-CON-250",
    mrp: 750,
    price: 620,
    discountPercent: 17.3,
    stockQuantity: 65,
    unit: "250ml Bottle",
    qrCertificate: {
      certificateNumber: "CIBRC-PST-2026-4410",
      authority: "Central Insecticides Board & Registration Committee (CIBRC)",
      batchNumber: "BYR-IND-2026-104",
      labTestDate: "2026-07-20",
      activeIngredientPercent: 17.8,
      toxicityColorCode: "Blue (Moderately Toxic)",
      expiryDate: "2028-07-19",
      verified: true,
      verifiedAt: "2026-08-01T12:00:00.000Z"
    },
    distributorFirm: "AgroCare Chemical Distributors Pune",
    distributorMobile: "+91 98900 11223",
    distributorLocation: "Pune, Maharashtra",
    dealerCommissionPercent: 8.0,
    rating: 4.6,
    reviewsCount: 24,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80",
    description: "Systemic insecticide for controlling sucking pests like aphids, jassids, and thrips in cotton and vegetables.",
    createdAt: "2026-08-10T11:00:00.000Z",
    updatedAt: "2026-09-17T16:00:00.000Z"
  },
  {
    id: "PROD-104",
    name: "Jain Drip Irrigation Lateral Pipe 16mm (400m Coil Class 2)",
    brand: "Jain Irrigation Systems Ltd",
    category: "Irrigation",
    subCategory: "Micro-Irrigation Tubing",
    sku: "AGR-IRR-JIS-16MM",
    mrp: 3800,
    price: 3150,
    discountPercent: 17.1,
    stockQuantity: 12,
    unit: "400m Coil",
    qrCertificate: {
      certificateNumber: "BIS-CM/L-8829104",
      authority: "Bureau of Indian Standards (IS:12786:1989)",
      batchNumber: "JISL-JAL-2026-992",
      labTestDate: "2026-06-12",
      hydrostaticPressureBar: 2.5,
      carbonBlackPercent: 2.5,
      expiryDate: "2031-06-11",
      verified: true,
      verifiedAt: "2026-07-01T10:00:00.000Z"
    },
    distributorFirm: "Jain Agro Solutions Nashik",
    distributorMobile: "+91 94231 66778",
    distributorLocation: "Nashik, Maharashtra",
    dealerCommissionPercent: 7.0,
    rating: 4.7,
    reviewsCount: 19,
    status: "low_stock",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
    description: "UV-stabilized virgin polyethylene lateral pipe with smooth inner surface minimizing friction loss.",
    createdAt: "2026-07-15T09:30:00.000Z",
    updatedAt: "2026-09-20T08:00:00.000Z"
  },
  {
    id: "PROD-105",
    name: "KisanKraft 2-Stroke Portable Power Sprayer KK-P768",
    brand: "KisanKraft Machine Tools",
    category: "Machinery & Tools",
    subCategory: "Power Sprayers",
    sku: "AGR-MCH-KK-P768",
    mrp: 12500,
    price: 9800,
    discountPercent: 21.6,
    stockQuantity: 8,
    unit: "Unit Machine",
    qrCertificate: {
      certificateNumber: "FMTTI-GOV-2026-338",
      authority: "Southern Region Farm Machinery Training & Testing Institute (SRFMTTI)",
      batchNumber: "KK-BLR-2026-768B",
      labTestDate: "2026-05-18",
      enginePowerHp: 1.2,
      dischargeLpm: 7.5,
      expiryDate: "2036-05-18",
      verified: true,
      verifiedAt: "2026-06-01T14:00:00.000Z"
    },
    distributorFirm: "Western Agro Equipment Hub Sangli",
    distributorMobile: "+91 98224 88990",
    distributorLocation: "Sangli, Maharashtra",
    dealerCommissionPercent: 9.5,
    rating: 4.5,
    reviewsCount: 15,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&q=80",
    description: "Heavy-duty brass pump portable power sprayer with 26cc 2-stroke engine and 30m high-pressure delivery hose.",
    createdAt: "2026-06-15T11:00:00.000Z",
    updatedAt: "2026-09-18T10:00:00.000Z"
  },
  {
    id: "PROD-106",
    name: "Multiplex Bio-Jeevamrut Organic Soil Enhancer 5 Litre",
    brand: "Multiplex Bio-Tech Ltd",
    category: "Bio-stimulants",
    subCategory: "Liquid Organic Fertilizers",
    sku: "AGR-BIO-MLT-5000",
    mrp: 1100,
    price: 890,
    discountPercent: 19.1,
    stockQuantity: 80,
    unit: "5L Can",
    qrCertificate: {
      certificateNumber: "NPOP-ORG-2026-5510",
      authority: "National Programme for Organic Production (APEDA / NPOP)",
      batchNumber: "MLT-BLR-2026-JVM4",
      labTestDate: "2026-08-01",
      bacterialCountCfu: "2.5 x 10^8 CFU/ml",
      phRange: "6.8 - 7.2",
      expiryDate: "2027-08-01",
      verified: true,
      verifiedAt: "2026-08-10T15:00:00.000Z"
    },
    distributorFirm: "Organic Roots Bio Inputs Satara",
    distributorMobile: "+91 97644 11229",
    distributorLocation: "Satara, Maharashtra",
    dealerCommissionPercent: 8.5,
    rating: 4.4,
    reviewsCount: 9,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
    description: "Concentrated liquid Jeevamrut formulated with beneficial consortium of nitrogen-fixing, PSB, and KMB micro-organisms.",
    createdAt: "2026-08-10T14:00:00.000Z",
    updatedAt: "2026-09-19T13:00:00.000Z"
  },
  {
    id: "PROD-107",
    name: "Syngenta Fortenza Duo Seed Treatment 100ml",
    brand: "Syngenta India",
    category: "Pesticides & Fungicides",
    subCategory: "Seed Dressing Pesticides",
    sku: "AGR-PST-SYN-FRT-100",
    mrp: 1450,
    price: 1220,
    discountPercent: 15.8,
    stockQuantity: 0,
    unit: "100ml Bottle",
    qrCertificate: {
      certificateNumber: "CIBRC-PST-2026-7721",
      authority: "Central Insecticides Board (CIBRC)",
      batchNumber: "SYN-GOA-2026-112",
      labTestDate: "2026-07-05",
      activeIngredientPercent: 48.0,
      toxicityColorCode: "Yellow (Highly Toxic)",
      expiryDate: "2028-07-04",
      verified: true,
      verifiedAt: "2026-07-15T11:00:00.000Z"
    },
    distributorFirm: "AgroCare Chemical Distributors Pune",
    distributorMobile: "+91 98900 11223",
    distributorLocation: "Pune, Maharashtra",
    dealerCommissionPercent: 7.5,
    rating: 4.8,
    reviewsCount: 42,
    status: "out_of_stock",
    imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80",
    description: "Dual-action broad spectrum systemic insecticide seed dressing protecting corn and soybean from early season chewing pests.",
    createdAt: "2026-07-10T09:00:00.000Z",
    updatedAt: "2026-09-20T07:00:00.000Z"
  },
  {
    id: "PROD-108",
    name: "Mahabeej Cotton Hybrid Seeds (RCH-659 BG II 450g)",
    brand: "Mahabeej State Seeds Corp",
    category: "Seeds",
    subCategory: "Commercial Fibre Seeds",
    sku: "AGR-SED-MHB-RCH-659",
    mrp: 860,
    price: 810,
    discountPercent: 5.8,
    stockQuantity: 210,
    unit: "450g Pouch",
    qrCertificate: {
      certificateNumber: "SEED-ACT-2026-4491",
      authority: "Maharashtra State Seed Certification Agency (MSSCA)",
      batchNumber: "MHB-AKL-2026-659B",
      labTestDate: "2026-08-10",
      purityPercent: 99.5,
      germinationPercent: 85.0,
      geneticPurityPercent: 98.0,
      expiryDate: "2027-08-09",
      verified: true,
      verifiedAt: "2026-08-18T10:30:00.000Z"
    },
    distributorFirm: "Mahabeej Akola Central Depot",
    distributorMobile: "+91 94221 77881",
    distributorLocation: "Akola, Maharashtra",
    dealerCommissionPercent: 5.0,
    rating: 4.7,
    reviewsCount: 54,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1594488554261-d703db5cf509?w=400&q=80",
    description: "Govt certified Bollgard II Bt cotton hybrid offering superior boll retention and bollworm protection.",
    createdAt: "2026-08-18T10:30:00.000Z",
    updatedAt: "2026-09-19T14:00:00.000Z"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-8801",
    userId: "USR-1001",
    farmerName: "Ram Patil",
    farmerMobile: "+91 98220 14592",
    deliveryAddress: {
      street: "Gat No. 412, Near Gram Panchayat",
      village: "Shiroli",
      taluka: "Karvir",
      district: "Kolhapur",
      state: "Maharashtra",
      pincode: "416122"
    },
    items: [
      {
        productId: "PROD-101",
        productName: "Mahyco Soybean Seeds JS-335 (30kg Bag)",
        category: "Seeds",
        quantity: 3,
        unitPrice: 2950,
        totalPrice: 8850
      },
      {
        productId: "PROD-102",
        productName: "IFFCO Urea (Neem Coated 45kg)",
        category: "Fertilizers",
        quantity: 4,
        unitPrice: 266.50,
        totalPrice: 1066
      }
    ],
    subtotal: 9916,
    taxAmount: 0, // Zero GST on agricultural seeds & subsidized urea
    deliveryFee: 150,
    discountAmount: 150,
    totalAmount: 9916,
    paymentMethod: "razorpay_upi",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    trackingNumber: "DLV-AG-991204",
    courierPartner: "Delhivery Agro Logistics",
    razorpayPaymentId: "pay_Rp99281745",
    razorpayOrderId: "order_RpN92817",
    refundId: null,
    refundAmount: 0,
    cancellationReason: null,
    createdAt: "2026-09-19T10:30:00.000Z",
    updatedAt: "2026-09-19T12:00:00.000Z"
  },
  {
    id: "ORD-8802",
    userId: "USR-1002",
    farmerName: "Suresh Jadhav",
    farmerMobile: "+91 94231 77610",
    deliveryAddress: {
      street: "Nashik-Aurangabad Highway, Post Niphad",
      village: "Niphad",
      taluka: "Niphad",
      district: "Nashik",
      state: "Maharashtra",
      pincode: "422303"
    },
    items: [
      {
        productId: "PROD-103",
        productName: "Bayer Confidor Insecticide 250ml",
        category: "Pesticides & Fungicides",
        quantity: 2,
        unitPrice: 620,
        totalPrice: 1240
      },
      {
        productId: "PROD-104",
        productName: "Jain Drip Lateral Pipe 16mm (400m Coil)",
        category: "Irrigation",
        quantity: 1,
        unitPrice: 3150,
        totalPrice: 3150
      }
    ],
    subtotal: 4390,
    taxAmount: 223,
    deliveryFee: 0,
    discountAmount: 223,
    totalAmount: 4390,
    paymentMethod: "razorpay_card",
    paymentStatus: "paid",
    orderStatus: "dispatched",
    trackingNumber: "SP-MH-948123IN",
    courierPartner: "India Post SpeedPost Agro",
    razorpayPaymentId: "pay_Rp88192031",
    razorpayOrderId: "order_RpM88192",
    refundId: null,
    refundAmount: 0,
    cancellationReason: null,
    createdAt: "2026-09-18T14:15:00.000Z",
    updatedAt: "2026-09-19T09:00:00.000Z"
  },
  {
    id: "ORD-8803",
    userId: "USR-1003",
    farmerName: "Mahadev Shinde",
    farmerMobile: "+91 97644 88321",
    deliveryAddress: {
      street: "Station Road, Near Turmeric Mandi Yard",
      village: "Miraj",
      taluka: "Miraj",
      district: "Sangli",
      state: "Maharashtra",
      pincode: "416410"
    },
    items: [
      {
        productId: "PROD-105",
        productName: "KisanKraft Portable Power Sprayer KK-P768",
        category: "Machinery & Tools",
        quantity: 1,
        unitPrice: 9800,
        totalPrice: 9800
      },
      {
        productId: "PROD-106",
        productName: "Multiplex Bio-Jeevamrut 5L",
        category: "Bio-stimulants",
        quantity: 2,
        unitPrice: 890,
        totalPrice: 1780
      }
    ],
    subtotal: 11580,
    taxAmount: 588,
    deliveryFee: 250,
    discountAmount: 250,
    totalAmount: 12168,
    paymentMethod: "kisan_credit_bnpl",
    paymentStatus: "pending",
    orderStatus: "placed",
    trackingNumber: null,
    courierPartner: "Western Express Transport",
    razorpayPaymentId: null,
    razorpayOrderId: null,
    refundId: null,
    refundAmount: 0,
    cancellationReason: null,
    createdAt: "2026-09-20T08:15:00.000Z",
    updatedAt: "2026-09-20T08:15:00.000Z"
  },
  {
    id: "ORD-8804",
    userId: "USR-1004",
    farmerName: "Laxman Thorat",
    farmerMobile: "+91 98901 23456",
    deliveryAddress: {
      street: "Korti Road, Near Bhima Sugar Factory",
      village: "Pandharpur",
      taluka: "Pandharpur",
      district: "Solapur",
      state: "Maharashtra",
      pincode: "413304"
    },
    items: [
      {
        productId: "PROD-107",
        productName: "Syngenta Fortenza Duo Seed Treatment 100ml",
        category: "Pesticides & Fungicides",
        quantity: 2,
        unitPrice: 1220,
        totalPrice: 2440
      }
    ],
    subtotal: 2440,
    taxAmount: 120,
    deliveryFee: 80,
    discountAmount: 80,
    totalAmount: 2560,
    paymentMethod: "razorpay_upi",
    paymentStatus: "refunded",
    orderStatus: "cancelled",
    trackingNumber: null,
    courierPartner: null,
    razorpayPaymentId: "pay_Rp77102938",
    razorpayOrderId: "order_RpK77102",
    refundId: "rfnd_Rp99210492",
    refundAmount: 2560,
    cancellationReason: "Farmer cancelled order before dispatch: Sowing season delayed due to monsoon deficit.",
    createdAt: "2026-09-17T11:00:00.000Z",
    updatedAt: "2026-09-17T15:30:00.000Z"
  },
  {
    id: "ORD-8805",
    userId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    farmerMobile: "+91 97655 43210",
    deliveryAddress: {
      street: "Ward No. 3, Shivaji Nagar",
      village: "Pusad",
      taluka: "Pusad",
      district: "Yavatmal",
      state: "Maharashtra",
      pincode: "445204"
    },
    items: [
      {
        productId: "PROD-108",
        productName: "Mahabeej Cotton Hybrid Seeds (RCH-659 BG II)",
        category: "Seeds",
        quantity: 6,
        unitPrice: 810,
        totalPrice: 4860
      },
      {
        productId: "PROD-102",
        productName: "IFFCO Urea (Neem Coated 45kg)",
        category: "Fertilizers",
        quantity: 2,
        unitPrice: 266.50,
        totalPrice: 533
      }
    ],
    subtotal: 5393,
    taxAmount: 0,
    deliveryFee: 100,
    discountAmount: 100,
    totalAmount: 5393,
    paymentMethod: "cod",
    paymentStatus: "paid",
    orderStatus: "delivered",
    trackingNumber: "DLV-YTL-440219",
    courierPartner: "Delhivery Agro Logistics",
    razorpayPaymentId: "cod_collected_dlv_881",
    razorpayOrderId: null,
    refundId: null,
    refundAmount: 0,
    cancellationReason: null,
    createdAt: "2026-09-16T09:30:00.000Z",
    updatedAt: "2026-09-18T16:00:00.000Z"
  },
  {
    id: "ORD-8806",
    userId: "USR-1006",
    farmerName: "Pandurang Kadam",
    farmerMobile: "+91 98224 55678",
    deliveryAddress: {
      street: "Plot No. 12, Malkapur Industrial Area",
      village: "Karad",
      taluka: "Karad",
      district: "Satara",
      state: "Maharashtra",
      pincode: "415110"
    },
    items: [
      {
        productId: "PROD-101",
        productName: "Mahyco Soybean Seeds JS-335 (30kg Bag)",
        category: "Seeds",
        quantity: 2,
        unitPrice: 2950,
        totalPrice: 5900
      }
    ],
    subtotal: 5900,
    taxAmount: 0,
    deliveryFee: 120,
    discountAmount: 120,
    totalAmount: 5900,
    paymentMethod: "razorpay_netbanking",
    paymentStatus: "paid",
    orderStatus: "dispatched",
    trackingNumber: "LDE-KRD-4402",
    courierPartner: "Local Dealer Express",
    razorpayPaymentId: "pay_Rp66190281",
    razorpayOrderId: "order_RpJ66190",
    refundId: null,
    refundAmount: 0,
    cancellationReason: null,
    createdAt: "2026-09-19T16:45:00.000Z",
    updatedAt: "2026-09-20T08:00:00.000Z"
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: "PAY-301",
    orderId: "ORD-8801",
    userId: "USR-1001",
    farmerName: "Ram Patil",
    amount: 9916,
    currency: "INR",
    method: "UPI (Google Pay)",
    razorpayPaymentId: "pay_Rp99281745",
    razorpayOrderId: "order_RpN92817",
    status: "captured",
    fee: 0,
    tax: 0,
    refundId: null,
    createdAt: "2026-09-19T10:32:15.000Z"
  },
  {
    id: "PAY-302",
    orderId: "ORD-8802",
    userId: "USR-1002",
    farmerName: "Suresh Jadhav",
    amount: 4390,
    currency: "INR",
    method: "RuPay Kisan Debit Card",
    razorpayPaymentId: "pay_Rp88192031",
    razorpayOrderId: "order_RpM88192",
    status: "captured",
    fee: 38.50,
    tax: 6.93,
    refundId: null,
    createdAt: "2026-09-18T14:18:22.000Z"
  },
  {
    id: "PAY-303",
    orderId: "ORD-8803",
    userId: "USR-1003",
    farmerName: "Mahadev Shinde",
    amount: 12168,
    currency: "INR",
    method: "Kisan Credit BNPL (Post-Harvest)",
    razorpayPaymentId: "bnpl_loan_sbi_99201",
    razorpayOrderId: null,
    status: "captured",
    fee: 0,
    tax: 0,
    refundId: null,
    createdAt: "2026-09-20T08:15:30.000Z"
  },
  {
    id: "PAY-304",
    orderId: "ORD-8804",
    userId: "USR-1004",
    farmerName: "Laxman Thorat",
    amount: 2560,
    currency: "INR",
    method: "UPI (PhonePe)",
    razorpayPaymentId: "pay_Rp77102938",
    razorpayOrderId: "order_RpK77102",
    status: "refunded",
    fee: 0,
    tax: 0,
    refundId: "rfnd_Rp99210492",
    createdAt: "2026-09-17T11:02:45.000Z"
  },
  {
    id: "PAY-305",
    orderId: "ORD-8805",
    userId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    amount: 5393,
    currency: "INR",
    method: "Cash On Delivery (Courier Remitted)",
    razorpayPaymentId: "cod_collected_dlv_881",
    razorpayOrderId: null,
    status: "captured",
    fee: 50.00,
    tax: 9.00,
    refundId: null,
    createdAt: "2026-09-18T16:05:00.000Z"
  },
  {
    id: "PAY-306",
    orderId: "ORD-8806",
    userId: "USR-1006",
    farmerName: "Pandurang Kadam",
    amount: 5900,
    currency: "INR",
    method: "Netbanking (Bank of Maharashtra)",
    razorpayPaymentId: "pay_Rp66190281",
    razorpayOrderId: "order_RpJ66190",
    status: "captured",
    fee: 45.00,
    tax: 8.10,
    refundId: null,
    createdAt: "2026-09-19T16:47:10.000Z"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "REV-501",
    productId: "PROD-101",
    productName: "Mahyco Soybean Seeds JS-335 (30kg Bag)",
    userId: "USR-1001",
    userName: "Ram Patil",
    rating: 5,
    reviewText: "Excellent germination rate above 90%. Clean certified seeds without any broken cotyledons. Sowed in 4 acres and got uniform crop stand.",
    verifiedPurchase: true,
    moderationStatus: "approved",
    createdAt: "2026-09-10T12:00:00.000Z"
  },
  {
    id: "REV-502",
    productId: "PROD-102",
    productName: "IFFCO Urea (Neem Coated 45kg)",
    userId: "USR-1002",
    userName: "Suresh Jadhav",
    rating: 5,
    reviewText: "Genuine subsidized IFFCO bag with clear QR seal. Delivery reached our Niphad farm gate within 24 hours.",
    verifiedPurchase: true,
    moderationStatus: "approved",
    createdAt: "2026-09-12T14:30:00.000Z"
  },
  {
    id: "REV-503",
    productId: "PROD-103",
    productName: "Bayer Confidor Insecticide 250ml",
    userId: "USR-1003",
    userName: "Mahadev Shinde",
    rating: 4,
    reviewText: "Effective control against whitefly and thrips on turmeric and chillies within 48 hours of foliar spray.",
    verifiedPurchase: true,
    moderationStatus: "approved",
    createdAt: "2026-09-14T09:15:00.000Z"
  },
  {
    id: "REV-504",
    productId: "PROD-105",
    productName: "KisanKraft Portable Power Sprayer KK-P768",
    userId: "USR-1004",
    userName: "Laxman Thorat",
    rating: 2,
    reviewText: "Competitor product is available cheaper in local Solapur market. Delivery boy asked for extra unloading tip.",
    verifiedPurchase: false,
    moderationStatus: "flagged",
    moderationReason: "Unverified purchase review discussing pricing and tipping rather than product operation.",
    createdAt: "2026-09-15T11:00:00.000Z"
  },
  {
    id: "REV-505",
    productId: "PROD-104",
    productName: "Jain Drip Lateral Pipe 16mm (400m Coil)",
    userId: "USR-1005",
    userName: "Anusaya Bai Rathod",
    rating: 5,
    reviewText: "Authentic Class 2 ISI pipe with high wall thickness. No clogging even with slightly hard borewell water.",
    verifiedPurchase: true,
    moderationStatus: "approved",
    createdAt: "2026-09-16T15:45:00.000Z"
  },
  {
    id: "REV-506",
    productId: "PROD-107",
    productName: "Syngenta Fortenza Duo Seed Treatment 100ml",
    userId: "USR-1006",
    userName: "Pandurang Kadam",
    rating: 1,
    reviewText: "Spam advertisement comment promoting another local brand shop in Karad.",
    verifiedPurchase: false,
    moderationStatus: "rejected",
    moderationReason: "Commercial promotional spam / competitor advertisement.",
    createdAt: "2026-09-17T18:00:00.000Z"
  }
];

// ============================================================================
// MODULE 08: TRANSPORT LOGISTICS & FLEET OPERATIONS (SOP-08)
// Collections: vehicles, transport_bookings, transporter_settlements
// ============================================================================

export const INITIAL_VEHICLES = [
  {
    id: "VEH-801",
    transporterId: "USR-2101",
    transporterName: "Suresh Jadhav",
    transporterMobile: "+91 98220 31445",
    vehicleClass: "Mini Truck (Tata 407)",
    registrationNumber: "MH-09-KD-4521",
    district: "Kolhapur",
    homeBase: "Gadhinglaj",
    capacityTons: 2.5,
    perKmRate: 18,
    baseFare: 350,
    rcBook: {
      number: "MH09KD4521",
      photoUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "ICICI-CV-881204",
      validTill: "2027-03-14",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-KOP-2211",
      validTill: "2027-08-02",
      verified: false
    },
    status: "pending_verification",
    tripsCompleted: 47,
    rating: 4.4,
    createdAt: "2026-09-18T09:30:00.000Z"
  },
  {
    id: "VEH-802",
    transporterId: "USR-2102",
    transporterName: "Mahadev Shinde",
    transporterMobile: "+91 97300 88221",
    vehicleClass: "Bolero Pickup",
    registrationNumber: "MH-10-AB-7789",
    district: "Sangli",
    homeBase: "Miraj",
    capacityTons: 1.5,
    perKmRate: 15,
    baseFare: 300,
    rcBook: {
      number: "MH10AB7789",
      photoUrl: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "BAJAJ-CV-554310",
      validTill: "2026-11-30",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-SNG-1187",
      validTill: "2027-01-19",
      verified: true
    },
    status: "verified",
    tripsCompleted: 122,
    rating: 4.8,
    createdAt: "2026-08-12T14:00:00.000Z"
  },
  {
    id: "VEH-803",
    transporterId: "USR-2103",
    transporterName: "Ganesh Pawar",
    transporterMobile: "+91 91450 62330",
    vehicleClass: "Tractor Trolley",
    registrationNumber: "MH-11-TR-3345",
    district: "Solapur",
    homeBase: "Pandharpur",
    capacityTons: 4.0,
    perKmRate: 12,
    baseFare: 250,
    rcBook: {
      number: "MH11TR3345",
      photoUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "NEWIND-CV-712099",
      validTill: "2026-12-20",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-SLP-3390",
      validTill: "2026-10-05",
      verified: true
    },
    status: "verified",
    tripsCompleted: 88,
    rating: 4.1,
    createdAt: "2026-07-22T10:45:00.000Z"
  },
  {
    id: "VEH-804",
    transporterId: "USR-2104",
    transporterName: "Vitthal Kamble",
    transporterMobile: "+91 99750 40112",
    vehicleClass: "LCV Goods Carrier (Eicher)",
    registrationNumber: "MH-12-GL-9910",
    district: "Nashik",
    homeBase: "Dindori",
    capacityTons: 5.0,
    perKmRate: 22,
    baseFare: 400,
    rcBook: {
      number: "MH12GL9910",
      photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "HDFC-CV-109877",
      validTill: "2027-06-11",
      verified: false
    },
    fitnessCertificate: {
      number: "FC-NSK-8801",
      validTill: "2027-02-28",
      verified: true
    },
    status: "pending_verification",
    tripsCompleted: 9,
    rating: 3.9,
    createdAt: "2026-09-19T08:20:00.000Z"
  },
  {
    id: "VEH-805",
    transporterId: "USR-2105",
    transporterName: "Dnyaneshwar More",
    transporterMobile: "+91 95030 77123",
    vehicleClass: "Tempo Goods (Ashok Leyland Dost)",
    registrationNumber: "MH-13-DD-2260",
    district: "Pune",
    homeBase: "Baramati",
    capacityTons: 1.25,
    perKmRate: 14,
    baseFare: 280,
    rcBook: {
      number: "MH13DD2260",
      photoUrl: "https://images.unsplash.com/photo-1568607918870-9ddecf71275c?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "TATA-CV-302488",
      validTill: "2027-04-25",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-PUN-5512",
      validTill: "2027-09-30",
      verified: true
    },
    status: "verified",
    tripsCompleted: 210,
    rating: 4.6,
    createdAt: "2026-05-02T12:10:00.000Z"
  },
  {
    id: "VEH-806",
    transporterId: "USR-2106",
    transporterName: "Ravindra Salunkhe",
    transporterMobile: "+91 70200 11908",
    vehicleClass: "Truck 6-Wheel (Eicher Pro 2000)",
    registrationNumber: "MH-15-ZX-6634",
    district: "Ahmednagar",
    homeBase: "Shrirampur",
    capacityTons: 7.5,
    perKmRate: 28,
    baseFare: 550,
    rcBook: {
      number: "MH15ZX6634",
      photoUrl: "https://images.unsplash.com/photo-1586191582056-b7f0a16393bd?w=400&q=80",
      verified: false
    },
    commercialInsurance: {
      policyNumber: "REL-CV-665102",
      validTill: "2026-09-30",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-AHM-4410",
      validTill: "2026-10-15",
      verified: true
    },
    status: "pending_verification",
    tripsCompleted: 0,
    rating: 0,
    createdAt: "2026-09-19T17:55:00.000Z"
  },
  {
    id: "VEH-807",
    transporterId: "USR-2107",
    transporterName: "Bhausaheb Jadhav",
    transporterMobile: "+91 88880 23561",
    vehicleClass: "Mini Truck (Mahindra Loadking)",
    registrationNumber: "MH-16-PL-1098",
    district: "Satara",
    homeBase: "Karad",
    capacityTons: 3.0,
    perKmRate: 19,
    baseFare: 380,
    rcBook: {
      number: "MH16PL1098",
      photoUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "ICICI-CV-901335",
      validTill: "2027-01-08",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-STR-7709",
      validTill: "2025-11-01",
      verified: false
    },
    status: "suspended",
    tripsCompleted: 64,
    rating: 3.2,
    createdAt: "2026-04-18T09:00:00.000Z"
  },
  {
    id: "VEH-808",
    transporterId: "USR-2108",
    transporterName: "Namdev Bhosale",
    transporterMobile: "+91 94220 60845",
    vehicleClass: "Tractor Trolley",
    registrationNumber: "MH-17-TT-8842",
    district: "Kolhapur",
    homeBase: "Ichalkaranji",
    capacityTons: 4.5,
    perKmRate: 13,
    baseFare: 260,
    rcBook: {
      number: "MH17TT8842",
      photoUrl: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&q=80",
      verified: true
    },
    commercialInsurance: {
      policyNumber: "BAJAJ-CV-447210",
      validTill: "2027-05-17",
      verified: true
    },
    fitnessCertificate: {
      number: "FC-KOP-9923",
      validTill: "2027-07-22",
      verified: true
    },
    status: "verified",
    tripsCompleted: 156,
    rating: 4.3,
    createdAt: "2026-06-09T16:40:00.000Z"
  }
];

export const INITIAL_TRANSPORT_BOOKINGS = [
  {
    id: "TRB-1001",
    userId: "USR-1001",
    customerName: "Ram Patil",
    customerMobile: "+91 98220 14592",
    customerPersona: "Farmer",
    lotRef: "LOT-701",
    vehicleClass: "Mini Truck (Tata 407)",
    vehicleId: "VEH-802",
    transporterName: "Mahadev Shinde",
    pickupPoint: { village: "Shiroli", district: "Kolhapur" },
    dropPoint: { mandi: "Kolhapur APMC Yard", district: "Kolhapur" },
    distanceKm: 22,
    fareBreakdown: { baseFare: 350, perKmCharge: 396, surcharge: 0 },
    fareAmount: 746,
    paymentStatus: "paid",
    status: "in_transit",
    createdAt: "2026-09-19T07:15:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  },
  {
    id: "TRB-1002",
    userId: "USR-1002",
    customerName: "Sunita Deshmukh",
    customerMobile: "+91 97650 33221",
    customerPersona: "Farmer",
    lotRef: "LOT-704",
    vehicleClass: "Tractor Trolley",
    vehicleId: "VEH-803",
    transporterName: "Ganesh Pawar",
    pickupPoint: { village: "Pandharpur", district: "Solapur" },
    dropPoint: { mandi: "Solapur Market Yard", district: "Solapur" },
    distanceKm: 14,
    fareBreakdown: { baseFare: 250, perKmCharge: 168, surcharge: 50 },
    fareAmount: 468,
    paymentStatus: "paid",
    status: "pod_submitted",
    createdAt: "2026-09-18T16:40:00.000Z",
    pod: {
      submitted: true,
      documentUrl: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&q=80",
      submittedAt: "2026-09-18T19:05:00.000Z",
      receiverName: "Yard Supervisor, Gate 3",
      audited: false
    }
  },
  {
    id: "TRB-1003",
    userId: "USR-1003",
    customerName: "Ajinkya Raut",
    customerMobile: "+91 95030 91223",
    customerPersona: "Trader",
    lotRef: null,
    vehicleClass: "LCV Goods Carrier (Eicher)",
    vehicleId: "VEH-805",
    transporterName: "Dnyaneshwar More",
    pickupPoint: { village: "Baramati", district: "Pune" },
    dropPoint: { mandi: "Mumbai Vashi APMC", district: "Mumbai" },
    distanceKm: 268,
    fareBreakdown: { baseFare: 400, perKmCharge: 5896, surcharge: 300 },
    fareAmount: 6596,
    paymentStatus: "paid",
    status: "delivered",
    createdAt: "2026-09-17T05:50:00.000Z",
    pod: {
      submitted: true,
      documentUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80",
      submittedAt: "2026-09-17T18:30:00.000Z",
      receiverName: "Shree Trading Co., Vashi",
      audited: true
    }
  },
  {
    id: "TRB-1004",
    userId: "USR-1004",
    customerName: "Kailas Patil",
    customerMobile: "+91 70200 45567",
    customerPersona: "FPO",
    lotRef: "LOT-707",
    vehicleClass: "Truck 6-Wheel (Eicher Pro 2000)",
    vehicleId: null,
    transporterName: null,
    pickupPoint: { village: "Shrirampur", district: "Ahmednagar" },
    dropPoint: { mandi: "Pune Gultekdi APMC", district: "Pune" },
    distanceKm: 128,
    fareBreakdown: { baseFare: 550, perKmCharge: 3584, surcharge: 0 },
    fareAmount: 4134,
    paymentStatus: "pending",
    status: "requested",
    createdAt: "2026-09-20T06:30:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  },
  {
    id: "TRB-1005",
    userId: "USR-1005",
    customerName: "Manisha Shinde",
    customerMobile: "+91 99700 81145",
    customerPersona: "Farmer",
    lotRef: "LOT-703",
    vehicleClass: "Bolero Pickup",
    vehicleId: "VEH-808",
    transporterName: "Namdev Bhosale",
    pickupPoint: { village: "Ichalkaranji", district: "Kolhapur" },
    dropPoint: { mandi: "Ichalkaranji Market", district: "Kolhapur" },
    distanceKm: 8,
    fareBreakdown: { baseFare: 260, perKmCharge: 104, surcharge: 0 },
    fareAmount: 364,
    paymentStatus: "paid",
    status: "disputed",
    disputeReason: "Vehicle arrived 4 hours late; produce wilted on arrival at mandi gate. Farmer claims ₹1,200 damages.",
    disputeRaisedBy: "USR-1005",
    createdAt: "2026-09-16T11:20:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  },
  {
    id: "TRB-1006",
    userId: "USR-1006",
    customerName: "Pandurang Kadam",
    customerMobile: "+91 91450 27789",
    customerPersona: "Farmer",
    lotRef: null,
    vehicleClass: "Tractor Trolley",
    vehicleId: "VEH-803",
    transporterName: "Ganesh Pawar",
    pickupPoint: { village: "Malshiras", district: "Solapur" },
    dropPoint: { mandi: "Pandharpur Yard", district: "Solapur" },
    distanceKm: 31,
    fareBreakdown: { baseFare: 250, perKmCharge: 372, surcharge: 0 },
    fareAmount: 622,
    paymentStatus: "paid",
    status: "no_show",
    disputeReason: "Transporter failed to arrive at scheduled pickup slot; booking auto-flagged by system.",
    disputeRaisedBy: "SYSTEM",
    createdAt: "2026-09-15T09:00:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  },
  {
    id: "TRB-1007",
    userId: "USR-1002",
    customerName: "Sunita Deshmukh",
    customerMobile: "+91 97650 33221",
    customerPersona: "Farmer",
    lotRef: "LOT-702",
    vehicleClass: "Mini Truck (Tata 407)",
    vehicleId: "VEH-801",
    transporterName: "Suresh Jadhav",
    pickupPoint: { village: "Gadhinglaj", district: "Kolhapur" },
    dropPoint: { mandi: "Belgaum APMC", district: "Belgaum" },
    distanceKm: 76,
    fareBreakdown: { baseFare: 350, perKmCharge: 1368, surcharge: 100 },
    fareAmount: 1818,
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-09-14T08:10:00.000Z",
    pod: {
      submitted: true,
      documentUrl: "https://images.unsplash.com/photo-1586191582056-b7f0a16393bd?w=400&q=80",
      submittedAt: "2026-09-14T15:45:00.000Z",
      receiverName: "Belgaum Commission Agent Assn.",
      audited: true
    }
  },
  {
    id: "TRB-1008",
    userId: "USR-1003",
    customerName: "Ajinkya Raut",
    customerMobile: "+91 95030 91223",
    customerPersona: "Trader",
    lotRef: null,
    vehicleClass: "Tempo Goods (Ashok Leyland Dost)",
    vehicleId: "VEH-805",
    transporterName: "Dnyaneshwar More",
    pickupPoint: { village: "Niphad", district: "Nashik" },
    dropPoint: { mandi: "Nashik Peth Road Yard", district: "Nashik" },
    distanceKm: 24,
    fareBreakdown: { baseFare: 280, perKmCharge: 336, surcharge: 0 },
    fareAmount: 616,
    paymentStatus: "paid",
    status: "requested",
    createdAt: "2026-09-20T09:05:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  },
  {
    id: "TRB-1009",
    userId: "USR-1001",
    customerName: "Ram Patil",
    customerMobile: "+91 98220 14592",
    customerPersona: "Farmer",
    lotRef: "LOT-705",
    vehicleClass: "Bolero Pickup",
    vehicleId: "VEH-802",
    transporterName: "Mahadev Shinde",
    pickupPoint: { village: "Shiroli", district: "Kolhapur" },
    dropPoint: { mandi: "Kolhapur APMC Yard", district: "Kolhapur" },
    distanceKm: 22,
    fareBreakdown: { baseFare: 300, perKmCharge: 330, surcharge: 0 },
    fareAmount: 630,
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-09-13T07:35:00.000Z",
    pod: {
      submitted: true,
      documentUrl: "https://images.unsplash.com/photo-1568607918870-9ddecf71275c?w=400&q=80",
      submittedAt: "2026-09-13T13:20:00.000Z",
      receiverName: "Gate Pass #5521",
      audited: true
    }
  },
  {
    id: "TRB-1010",
    userId: "USR-1004",
    customerName: "Kailas Patil",
    customerMobile: "+91 70200 45567",
    customerPersona: "FPO",
    lotRef: "LOT-706",
    vehicleClass: "Truck 6-Wheel (Eicher Pro 2000)",
    vehicleId: "VEH-807",
    transporterName: "Bhausaheb Jadhav",
    pickupPoint: { village: "Karad", district: "Satara" },
    dropPoint: { mandi: "Kolhapur APMC Yard", district: "Kolhapur" },
    distanceKm: 58,
    fareBreakdown: { baseFare: 380, perKmCharge: 1102, surcharge: 0 },
    fareAmount: 1482,
    paymentStatus: "refunded",
    status: "cancelled",
    createdAt: "2026-09-12T10:00:00.000Z",
    pod: { submitted: false, documentUrl: null, audited: false }
  }
];

export const INITIAL_TRANSPORTER_SETTLEMENTS = [
  {
    id: "TST-501",
    transporterId: "USR-2102",
    transporterName: "Mahadev Shinde",
    bookingId: "TRB-1009",
    vehicleId: "VEH-802",
    tripsCount: 1,
    grossFare: 630,
    platformFeePercent: 8,
    netPayable: 580,
    podAuditStatus: "released",
    payoutMode: "UPI (HDFC XX4412)",
    payoutAmount: 580,
    signOffs: [{ adminUid: "root@agrovercity", signedAt: "2026-09-14T10:00:00.000Z" }],
    status: "paid",
    createdAt: "2026-09-13T14:00:00.000Z"
  },
  {
    id: "TST-502",
    transporterId: "USR-2103",
    transporterName: "Ganesh Pawar",
    bookingId: "TRB-1002",
    vehicleId: "VEH-803",
    tripsCount: 1,
    grossFare: 468,
    platformFeePercent: 8,
    netPayable: 431,
    podAuditStatus: "pending_audit",
    payoutMode: "Bank (SBI XX8801)",
    payoutAmount: 431,
    signOffs: [],
    status: "pending",
    createdAt: "2026-09-18T19:30:00.000Z"
  },
  {
    id: "TST-503",
    transporterId: "USR-2105",
    transporterName: "Dnyaneshwar More",
    bookingId: "TRB-1003",
    vehicleId: "VEH-805",
    tripsCount: 1,
    grossFare: 6596,
    platformFeePercent: 8,
    netPayable: 6068,
    podAuditStatus: "approved",
    payoutMode: "Bank (ICICI XX2277)",
    payoutAmount: 6068,
    signOffs: [{ adminUid: "ops.audit@agrovercity", signedAt: "2026-09-18T09:40:00.000Z" }],
    status: "approved",
    createdAt: "2026-09-17T19:00:00.000Z"
  },
  {
    id: "TST-504",
    transporterId: "USR-2102",
    transporterName: "Mahadev Shinde",
    bookingId: "TRB-1011",
    vehicleId: "VEH-802",
    tripsCount: 6,
    grossFare: 58400,
    platformFeePercent: 8,
    netPayable: 53728,
    podAuditStatus: "approved",
    payoutMode: "Bank (HDFC XX4412)",
    payoutAmount: 53728,
    signOffs: [{ adminUid: "ops.audit@agrovercity", signedAt: "2026-09-19T11:15:00.000Z" }],
    status: "approved",
    createdAt: "2026-09-19T10:30:00.000Z"
  },
  {
    id: "TST-505",
    transporterId: "USR-2108",
    transporterName: "Namdev Bhosale",
    bookingId: "TRB-1012",
    vehicleId: "VEH-808",
    tripsCount: 4,
    grossFare: 74200,
    platformFeePercent: 8,
    netPayable: 68264,
    podAuditStatus: "pending_audit",
    payoutMode: "Bank (SBI XX1092)",
    payoutAmount: 68264,
    signOffs: [],
    status: "pending",
    createdAt: "2026-09-19T18:00:00.000Z"
  },
  {
    id: "TST-506",
    transporterId: "USR-2107",
    transporterName: "Bhausaheb Jadhav",
    bookingId: "TRB-1010",
    vehicleId: "VEH-807",
    tripsCount: 1,
    grossFare: 0,
    platformFeePercent: 8,
    netPayable: 0,
    podAuditStatus: "rejected",
    payoutMode: "UPI (BOI XX6630)",
    payoutAmount: 0,
    signOffs: [],
    status: "cancelled",
    createdAt: "2026-09-12T12:00:00.000Z"
  }
];



