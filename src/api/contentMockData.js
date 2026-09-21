/**
 * AGROVERCITY SUPERADMIN — Module 20: Knowledge Hub, Content CMS & Live Media
 * Target Collections: agri_news, agri_channels, workshops, expert_talks, video_guides, blog_articles
 * Document ID: SOP-20
 */

export const mockAgriNews = [
  {
    id: 'news_101',
    title: 'Maharashtra Declares ₹12,000/Ha Subsidy for Micro-Irrigation in Marathwada',
    headline: 'State Agriculture Dept issues GR for drip automation & solar pump interlinking',
    summary: 'The Maharashtra Agriculture Department has announced immediate financial disbursements covering 8 drought-prone districts under the revised PMKSY guidelines.',
    content: 'Under Government Resolution (GR) No. AGRI-2026/M-112, farmers owning up to 5 hectares across Aurangabad, Jalna, Beed, and Osmanabad can claim back-ended capital subsidies directly deposited via DBT into Aadhaar-linked accounts.',
    category: 'Govt Schemes',
    tags: ['Subsidy', 'Marathwada', 'PMKSY', 'Drip Irrigation'],
    breaking: true,
    language: 'mr',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_101_marathi_narration.mp3',
    audioDurationSeconds: 145,
    author: 'Kisan Varta Desk (Pune)',
    source: 'Govt of Maharashtra Directorate of Agriculture',
    readCount: 14820,
    status: 'published',
    scheduledAt: null,
    createdAt: '2026-09-20T06:30:00Z',
    updatedAt: '2026-09-20T08:15:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'news_102',
    title: 'Yellow Stem Borer Outbreak Alert for Vidarbha Kharif Paddy Belts',
    headline: 'KVK Gadchiroli warns of 20% threshold breach; urgent pheromone trap deployment urged',
    summary: 'Entomological survey conducted across Chandrapur and Gadchiroli indicates adult moth emergence exceeding 3 moths per trap per day.',
    content: 'Farmers are advised to install 10 Scirpophaga incertulas pheromone traps per hectare. If egg masses exceed 1 per sq. meter, spray Chlorantraniliprole 18.5 SC @ 0.3 ml/L or Cartap Hydrochloride 50 SP @ 2 g/L.',
    category: 'Pest Outbreak',
    tags: ['Paddy', 'Stem Borer', 'Vidarbha', 'Pest Alert'],
    breaking: true,
    language: 'mr',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_102_marathi_pest_warning.mp3',
    audioDurationSeconds: 98,
    author: 'Dr. S. K. Shinde (Entomologist)',
    source: 'KVK Gadchiroli & ICAR-CRRI',
    readCount: 8940,
    status: 'published',
    scheduledAt: null,
    createdAt: '2026-09-19T14:10:00Z',
    updatedAt: '2026-09-19T14:10:00Z',
    userId: 'usr_admin_rahul'
  },
  {
    id: 'news_103',
    title: 'Onion APMC Laser-Grading Pilots Go Live in Lasalgaon and Pimpalgaon',
    headline: 'Automated defect sorting boosts grade-A export realizations by ₹340/quintal',
    summary: 'The new high-speed optical sorter scans up to 15 metric tonnes per hour, segmenting bulbs by size, rot percentage, and outer skin integrity.',
    content: 'Supported by APEDA and Agrovercity Infrastructure Funds, the pilot eliminates manual sorting disputes. Participating vyaparis report 98.4% grading accuracy verified by NABL accredited lab sensors.',
    category: 'Mandi Trends',
    tags: ['Onion', 'Lasalgaon', 'AI Grading', 'Export Quality'],
    breaking: false,
    language: 'hi',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_103_hindi_onion_sorting.mp3',
    audioDurationSeconds: 180,
    author: 'Sunil Jadhav (Mandi Correspondent)',
    source: 'Lasalgaon APMC Market Board',
    readCount: 6510,
    status: 'published',
    scheduledAt: null,
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-18T10:45:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'news_104',
    title: 'IMD Forecasts Unseasonal Thunderstorms in Western Ghats: Sugarcane Lodging Advisory',
    headline: 'Western Maharashtra cane growers urged to perform trash mulching and drainage clearing',
    summary: 'A low pressure depression over the Arabian Sea is projected to cause gusty winds up to 45 km/h and isolated rainfall between Sept 22-25.',
    content: 'Growers with mature Adsali sugarcane (10-12 months old) should tie opposite clumps together (clump wrapping) to prevent wind-induced root lodging and subsequent sugar recovery drop.',
    category: 'Weather Alerts',
    tags: ['Weather', 'IMD', 'Sugarcane', 'Kolhapur', 'Lodging'],
    breaking: false,
    language: 'mr',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_104_weather_advisory.mp3',
    audioDurationSeconds: 122,
    author: 'Agro-Met Division',
    source: 'India Meteorological Department (IMD Pune)',
    readCount: 11200,
    status: 'published',
    scheduledAt: null,
    createdAt: '2026-09-17T09:20:00Z',
    updatedAt: '2026-09-17T09:20:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'news_105',
    title: 'Centre Approves Direct Fertilizer Subsidy Pilot via Biometric POS 3.0',
    headline: 'Real-time soil card integration to limit excessive DAP and Urea purchase spikes',
    summary: 'The Ministry of Chemicals and Fertilizers initiates POS 3.0 nationwide rollout with mandatory soil health card reading prior to invoice creation.',
    content: 'Under POS 3.0, subsidized fertilizer quantities are calculated strictly on the basis of crop acreage and soil test deficiency records, preventing cross-border black market diversion.',
    category: 'Govt Schemes',
    tags: ['Fertilizer', 'DBT', 'Soil Card', 'Policy'],
    breaking: false,
    language: 'en',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_105_en_fertilizer_pos.mp3',
    audioDurationSeconds: 160,
    author: 'National Agri Policy Bureau',
    source: 'Ministry of Chemicals & Fertilizers',
    readCount: 4320,
    status: 'scheduled',
    scheduledAt: '2026-09-22T04:30:00Z',
    createdAt: '2026-09-16T16:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
    userId: 'usr_admin_vikram'
  },
  {
    id: 'news_106',
    title: 'Automated Solar Cold-Room Subsidies for Solapur Pomegranate Clusters',
    headline: 'NABARD credit subsidy of up to 40% announced for 10 MT micro cold chains',
    summary: 'Solapur Bhagwa pomegranate growers can now access thermal energy storage cold rooms operating 100% off-grid with zero diesel generator backup.',
    content: 'Phase 1 covers 25 FPOs across Sangola, Malshiras, and Pandharpur. Thermal Phase Change Material (PCM) maintains 4°C storage for up to 36 hours during cloudy periods.',
    category: 'Technology',
    tags: ['Solar Cold Room', 'Pomegranate', 'Solapur', 'NABARD'],
    breaking: false,
    language: 'mr',
    vernacularAudioUrl: 'https://cdn.agrovercity.in/audio/news/news_106_solapur_pomegranate.mp3',
    audioDurationSeconds: 135,
    author: 'Rohan Patil (Horticulture Cell)',
    source: 'NABARD Regional Office Pune',
    readCount: 3180,
    status: 'draft',
    scheduledAt: null,
    createdAt: '2026-09-15T11:30:00Z',
    updatedAt: '2026-09-19T09:40:00Z',
    userId: 'usr_admin_rahul'
  }
];

export const mockAgriChannels = [
  {
    id: 'chan_01',
    channelName: 'Krishi Darshan 24x7 Maharashtra',
    callsign: 'KD-MAHA-LIVE',
    category: 'Krishi Darshan',
    language: 'mr',
    rtmpIngestUrl: 'rtmp://ingest.live.agrovercity.in/live-stream',
    streamKey: 'live_agri_994827103847a98bce',
    hlsPlaybackUrl: 'https://stream.agrovercity.in/hls/kd-maha-live/master.m3u8',
    status: 'live',
    activeViewers: 3840,
    peakViewersToday: 6920,
    resolution: '1080p60',
    bitrateKbps: 4500,
    chatEnabled: true,
    chatModerationLevel: 'strict',
    scheduledLiveAt: '2026-09-21T06:00:00Z',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-21T07:15:00Z',
    userId: 'usr_admin_ananya',
    chatMessages: [
      {
        id: 'msg_01',
        userId: 'farmer_881',
        userName: 'Pandurang Kadam',
        userPhone: '+91 98XXX XX412',
        message: 'Sir, cotton pink bollworm spray schedule once again please clarify for Nanded district',
        timestamp: '2026-09-21T07:18:22Z',
        moderationStatus: 'approved'
      },
      {
        id: 'msg_02',
        userId: 'farmer_409',
        userName: 'Babanrao Shinde',
        userPhone: '+91 94XXX XX891',
        message: 'Lasalgaon today medium size red onion rate reached ₹2400!',
        timestamp: '2026-09-21T07:19:04Z',
        moderationStatus: 'approved'
      },
      {
        id: 'msg_03',
        userId: 'user_troll_99',
        userName: 'Rajesh Crypto Trader',
        userPhone: '+91 91XXX XX001',
        message: 'Buy 100x coins fast click link bit.ly/agro-crypto-fake free bonus',
        timestamp: '2026-09-21T07:19:45Z',
        moderationStatus: 'flagged'
      }
    ]
  },
  {
    id: 'chan_02',
    channelName: 'Live Mandi Auction Floor: Lasalgaon & Vashi',
    callsign: 'MANDI-AUCTION-01',
    category: 'Live Mandi Auction',
    language: 'hi',
    rtmpIngestUrl: 'rtmp://ingest.live.agrovercity.in/mandi-feed',
    streamKey: 'live_mandi_7730198471bb92fe10',
    hlsPlaybackUrl: 'https://stream.agrovercity.in/hls/mandi-auction-01/master.m3u8',
    status: 'live',
    activeViewers: 2150,
    peakViewersToday: 4120,
    resolution: '720p60',
    bitrateKbps: 2800,
    chatEnabled: true,
    chatModerationLevel: 'standard',
    scheduledLiveAt: '2026-09-21T05:30:00Z',
    createdAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-09-21T07:05:00Z',
    userId: 'usr_admin_ananya',
    chatMessages: [
      {
        id: 'msg_11',
        userId: 'trader_102',
        userName: 'Ganesh Vyapari',
        userPhone: '+91 98XXX XX332',
        message: 'Nashik lot #412 onion bid started @ ₹2150/qtl. Lot purity 97%.',
        timestamp: '2026-09-21T07:14:10Z',
        moderationStatus: 'approved'
      }
    ]
  },
  {
    id: 'chan_03',
    channelName: 'Baramati KVK AgTech & Drone Demo Live',
    callsign: 'BARAMATI-AGTECH-03',
    category: 'AgTech Demo',
    language: 'mr',
    rtmpIngestUrl: 'rtmp://ingest.live.agrovercity.in/demo-live',
    streamKey: 'live_demo_3301984209fac44589',
    hlsPlaybackUrl: 'https://stream.agrovercity.in/hls/baramati-agtech/master.m3u8',
    status: 'offline',
    activeViewers: 0,
    peakViewersToday: 1840,
    resolution: '1080p60',
    bitrateKbps: 4500,
    chatEnabled: true,
    chatModerationLevel: 'standard',
    scheduledLiveAt: '2026-09-22T08:00:00Z',
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-09-20T17:00:00Z',
    userId: 'usr_admin_rahul',
    chatMessages: []
  },
  {
    id: 'chan_04',
    channelName: 'Desi Cow Dairy & Pashu Palan Guidance',
    callsign: 'PASHU-PALAN-TV',
    category: 'Expert Q&A',
    language: 'hi',
    rtmpIngestUrl: 'rtmp://ingest.live.agrovercity.in/dairy-tv',
    streamKey: 'live_dairy_55910384729cc19420',
    hlsPlaybackUrl: 'https://stream.agrovercity.in/hls/pashu-palan-tv/master.m3u8',
    status: 'maintenance',
    activeViewers: 0,
    peakViewersToday: 890,
    resolution: '720p30',
    bitrateKbps: 2000,
    chatEnabled: false,
    chatModerationLevel: 'strict',
    scheduledLiveAt: '2026-09-23T11:00:00Z',
    createdAt: '2026-04-12T09:30:00Z',
    updatedAt: '2026-09-21T06:00:00Z',
    userId: 'usr_admin_vikram',
    chatMessages: []
  }
];

export const mockWorkshops = [
  {
    id: 'ws_201',
    title: 'Automated Drip Fertigation & IoT Soil Sensor Integration',
    description: 'Practical training on installing solenoid valves, Venturi injectors, EC/pH sensors, and automated mobile fertigation timers for horticulture crops.',
    instructorName: 'Dr. Rameshwar V. Tambe',
    instructorTitle: 'Principal Scientist, Dept of Irrigation & Drainage, MPKV Rahuri',
    icarAccreditationNo: 'ICAR-TRG-2026-MH-4412',
    seatsCapacity: 150,
    enrolledCount: 142,
    feeINR: 999,
    currency: 'INR',
    scheduledAt: '2026-09-26T09:30:00Z',
    durationMinutes: 240,
    meetingPlatform: 'Agrovercity Live Stream & Zoom',
    meetingUrl: 'https://live.agrovercity.in/workshops/ws_201/room',
    status: 'upcoming',
    certificateEligible: true,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'ws_202',
    title: 'High-Density Commercial Dragon Fruit Plantation & Trellising',
    description: 'Comprehensive business workshop covering soil preparation, cement pole trellising, variety selection (Red Ruby vs Royal Red), pruning, and organic foliar sprays.',
    instructorName: 'Prof. Anant K. Shingane',
    instructorTitle: 'Horticulture Specialist, College of Agriculture Pune',
    icarAccreditationNo: 'ICAR-TRG-2026-MH-3890',
    seatsCapacity: 200,
    enrolledCount: 200,
    feeINR: 1499,
    currency: 'INR',
    scheduledAt: '2026-09-28T10:00:00Z',
    durationMinutes: 180,
    meetingPlatform: 'Google Meet Enterprise',
    meetingUrl: 'https://meet.google.com/xyz-agro-meet',
    status: 'upcoming',
    certificateEligible: true,
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-09-21T05:00:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'ws_203',
    title: 'NPOP Organic Farming Certification & APEDA Export Compliance',
    description: 'Master step-by-step documentation, audit readiness, residue-free pesticide records, and cooperative cluster registration for European & Gulf export markets.',
    instructorName: 'Dr. Meenakshi Sundaram',
    instructorTitle: 'Lead Auditor, NABL & APEDA Organic Verification Board',
    icarAccreditationNo: 'ICAR-TRG-2026-ORG-1029',
    seatsCapacity: 100,
    enrolledCount: 88,
    feeINR: 2499,
    currency: 'INR',
    scheduledAt: '2026-10-04T10:30:00Z',
    durationMinutes: 300,
    meetingPlatform: 'Agrovercity Live Stream',
    meetingUrl: 'https://live.agrovercity.in/workshops/ws_203/room',
    status: 'upcoming',
    certificateEligible: true,
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
    userId: 'usr_admin_rahul'
  },
  {
    id: 'ws_204',
    title: 'Desi Gir & Sahiwal Dairy Unit Automation & A2 Ghee Processing',
    description: 'Scientific housing design, silage preparation, milking automation, FSSAI licensing, and vacuum bottle packing for direct-to-consumer premium dairy.',
    instructorName: 'Dr. Nitin D. Jagtap',
    instructorTitle: 'Director of Animal Husbandry Training, KVK Baramati',
    icarAccreditationNo: 'ICAR-TRG-2026-LVS-8831',
    seatsCapacity: 120,
    enrolledCount: 120,
    feeINR: 1999,
    currency: 'INR',
    scheduledAt: '2026-09-15T09:00:00Z',
    durationMinutes: 240,
    meetingPlatform: 'Zoom Webinar',
    meetingUrl: 'https://zoom.us/w/892019482',
    status: 'completed',
    certificateEligible: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-16T11:00:00Z',
    userId: 'usr_admin_vikram'
  }
];

export const mockWorkshopRosters = {
  ws_201: [
    {
      id: 'rst_101',
      workshopId: 'ws_201',
      farmerId: 'usr_fm_1042',
      farmerName: 'Tukaram Ramdas Gaikwad',
      farmerPhone: '+91 98XXX XX312',
      aadhaarMasked: 'XXXX-XXXX-4192',
      district: 'Ahmednagar',
      registeredAt: '2026-09-08T11:20:00Z',
      amountPaidINR: 999,
      paymentStatus: 'captured',
      attended: true,
      certificateIssued: true,
      certificateId: 'CERT-ICAR-2026-0941'
    },
    {
      id: 'rst_102',
      workshopId: 'ws_201',
      farmerId: 'usr_fm_1088',
      farmerName: 'Sanjay Bapurao Kute',
      farmerPhone: '+91 94XXX XX781',
      aadhaarMasked: 'XXXX-XXXX-8821',
      district: 'Solapur',
      registeredAt: '2026-09-10T14:10:00Z',
      amountPaidINR: 999,
      paymentStatus: 'captured',
      attended: false,
      certificateIssued: false,
      certificateId: null
    },
    {
      id: 'rst_103',
      workshopId: 'ws_201',
      farmerId: 'usr_fm_1192',
      farmerName: 'Manohar Vishwanath Gorde',
      farmerPhone: '+91 97XXX XX902',
      aadhaarMasked: 'XXXX-XXXX-2301',
      district: 'Nashik',
      registeredAt: '2026-09-12T09:40:00Z',
      amountPaidINR: 999,
      paymentStatus: 'captured',
      attended: true,
      certificateIssued: true,
      certificateId: 'CERT-ICAR-2026-0942'
    },
    {
      id: 'rst_104',
      workshopId: 'ws_201',
      farmerId: 'usr_fm_1250',
      farmerName: 'Kavita Dnyandev Shinde',
      farmerPhone: '+91 98XXX XX114',
      aadhaarMasked: 'XXXX-XXXX-6612',
      district: 'Pune',
      registeredAt: '2026-09-15T16:05:00Z',
      amountPaidINR: 999,
      paymentStatus: 'refunded',
      attended: false,
      certificateIssued: false,
      certificateId: null
    }
  ],
  ws_202: [
    {
      id: 'rst_201',
      workshopId: 'ws_202',
      farmerId: 'usr_fm_2210',
      farmerName: 'Rajendra Anandrao Mohite',
      farmerPhone: '+91 98XXX XX445',
      aadhaarMasked: 'XXXX-XXXX-9901',
      district: 'Satara',
      registeredAt: '2026-09-06T10:15:00Z',
      amountPaidINR: 1499,
      paymentStatus: 'captured',
      attended: false,
      certificateIssued: false,
      certificateId: null
    },
    {
      id: 'rst_202',
      workshopId: 'ws_202',
      farmerId: 'usr_fm_2218',
      farmerName: 'Vikas Prabhakar Deshmukh',
      farmerPhone: '+91 99XXX XX882',
      aadhaarMasked: 'XXXX-XXXX-5523',
      district: 'Sangli',
      registeredAt: '2026-09-07T12:30:00Z',
      amountPaidINR: 1499,
      paymentStatus: 'captured',
      attended: false,
      certificateIssued: false,
      certificateId: null
    }
  ]
};

export const mockExpertTalks = [
  {
    id: 'talk_301',
    title: 'Pest Resistance Management in Bt Cotton & Pink Bollworm Trap Tactics',
    scientistName: 'Dr. Hemantrao B. Borase',
    scientistDesignation: 'Head of Agronomy & Entomology',
    kvkOrInstitute: 'MPKV Rahuri Agricultural University',
    specialization: 'Plant Protection & Entomology',
    dateScheduled: '2026-09-24T15:00:00Z',
    durationMinutes: 90,
    status: 'scheduled',
    recordingUrl: null,
    zoomWebinarId: '882-9910-4412',
    questionsCount: 4,
    farmerQuestions: [
      {
        id: 'q_01',
        farmerName: 'Narayan Jadhav',
        farmerLocation: 'Jalgaon, MH',
        question: 'Is Emamectin Benzoate 5 SG safe to tank-mix with Boron 20% during boll development stage?',
        priority: 'high',
        status: 'approved',
        submittedAt: '2026-09-20T08:14:00Z'
      },
      {
        id: 'q_02',
        farmerName: 'Dnyaneshwar Shinde',
        farmerLocation: 'Yavatmal, MH',
        question: 'Light traps or solar delta pheromone traps: which offers better cost per acre for 10-acre block?',
        priority: 'high',
        status: 'approved',
        submittedAt: '2026-09-20T10:25:00Z'
      },
      {
        id: 'q_03',
        farmerName: 'Vikas More',
        farmerLocation: 'Wardha, MH',
        question: 'What is the exact waiting period between Neem Oil 10,000 ppm spray and harvesting?',
        priority: 'normal',
        status: 'pending_triage',
        submittedAt: '2026-09-21T06:15:00Z'
      },
      {
        id: 'q_04',
        farmerName: 'Santosh Kale',
        farmerLocation: 'Amravati, MH',
        question: 'Can you recommend any unauthorized seed packet from Gujarat sellers?',
        priority: 'normal',
        status: 'rejected',
        submittedAt: '2026-09-21T06:40:00Z'
      }
    ],
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'talk_302',
    title: 'Soil Salinity Reclamation with Gypsum & Subsurface Drainage Systems',
    scientistName: 'Dr. Archana S. Joshi',
    scientistDesignation: 'Chief Soil Scientist',
    kvkOrInstitute: 'ICAR-Central Soil Salinity Research Institute (CSSRI)',
    specialization: 'Soil Science & Drainage Engineering',
    dateScheduled: '2026-09-29T11:00:00Z',
    durationMinutes: 120,
    status: 'scheduled',
    recordingUrl: null,
    zoomWebinarId: '912-4419-8821',
    questionsCount: 2,
    farmerQuestions: [
      {
        id: 'q_11',
        farmerName: 'Balu Patil',
        farmerLocation: 'Kolhapur, MH',
        question: 'My sugarcane soil pH is 8.8 with electrical conductivity 3.2 dS/m. How many bags of agricultural gypsum per acre required?',
        priority: 'high',
        status: 'approved',
        submittedAt: '2026-09-19T14:20:00Z'
      },
      {
        id: 'q_12',
        farmerName: 'Rameshwar Pawar',
        farmerLocation: 'Sangli, MH',
        question: 'Is corrugated perforated PVC pipe long-lasting compared to cement tiles for sub-surface trench?',
        priority: 'normal',
        status: 'pending_triage',
        submittedAt: '2026-09-20T11:00:00Z'
      }
    ],
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-09-19T15:00:00Z',
    userId: 'usr_admin_rahul'
  }
];

export const mockVideoGuides = [
  {
    id: 'vid_401',
    title: 'Precision Micro-Sprinkler Installation for Garlic & Onion Nurseries',
    description: 'Complete step-by-step masterclass demonstrating nozzle pressure calibration, overlap calculation, and filter maintenance.',
    translations: {
      mr: {
        title: 'लसूण आणि कांदा रोपवाटिकेसाठी सूक्ष्म तुषार सिंचन पद्धती',
        description: 'नोजल दाब नियमन, पाण्याचा समतोल शिडकाव आणि स्क्रीन फिल्टर स्वच्छतेचे संपूर्ण प्रात्यक्षिक.'
      },
      hi: {
        title: 'लहसुन और प्याज की नर्सरी में माइक्रो-स्प्रिंकलर लगाने की सटीक विधि',
        description: 'नोजल प्रेशर कैलिब्रेशन और फिल्टर मेंटेनेंस का संपूर्ण वीडियो गाइड।'
      },
      en: {
        title: 'Precision Micro-Sprinkler Installation for Garlic & Onion Nurseries',
        description: 'Complete step-by-step masterclass demonstrating nozzle pressure calibration and filter maintenance.'
      }
    },
    category: 'Irrigation & Fertigation',
    videoUrl: 'https://cdn.agrovercity.in/videos/tutorials/micro_sprinkler_guide.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a00?w=600&auto=format&fit=crop&q=60',
    durationSeconds: 840,
    viewCount: 42100,
    likeCount: 2890,
    status: 'published',
    tags: ['Micro Irrigation', 'Onion', 'Nursery', 'Water Saving'],
    featured: true,
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'vid_402',
    title: 'Biological Trichoderma & Pseudomonas Seed Treatment Formula',
    description: 'Prevent damping-off, root rot, and Fusarium wilt in pulses and vegetables using bio-inoculants without chemical scorching.',
    translations: {
      mr: {
        title: 'ट्रायकोडर्मा व स्यूडोमोनास जैविक बीजप्रक्रिया कृती',
        description: 'कडधान्य आणि भाजीपाल्यामध्ये मूळकुज, मर रोग रोखण्यासाठी जैविक बुरशीनाशक वापरण्याची अचूक पद्धत.'
      },
      hi: {
        title: 'ट्राइकोडर्मा और स्यूडोमोनास से जैविक बीज उपचार की सरल विधि',
        description: 'दलहनी फसलों में उकठा और जड़ सड़न रोकने हेतु जैविक कल्चर का सही इस्तेमाल।'
      },
      en: {
        title: 'Biological Trichoderma & Pseudomonas Seed Treatment Formula',
        description: 'Prevent damping-off and root rot in pulses using bio-inoculants.'
      }
    },
    category: 'Crop Protection',
    videoUrl: 'https://cdn.agrovercity.in/videos/tutorials/bio_seed_treatment.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=60',
    durationSeconds: 615,
    viewCount: 28750,
    likeCount: 1940,
    status: 'published',
    tags: ['Bio Control', 'Trichoderma', 'Seed Treatment', 'Organic'],
    featured: false,
    createdAt: '2026-08-25T11:30:00Z',
    updatedAt: '2026-09-15T09:10:00Z',
    userId: 'usr_admin_rahul'
  },
  {
    id: 'vid_403',
    title: 'Drone Foliar Spraying: Flight Height, Battery Swapping & Drift Control',
    description: 'Operational SOP for DGCA-certified drone pilots spraying nano urea and micronutrients over cotton and sugarcane crops.',
    translations: {
      mr: {
        title: 'शेती ड्रोन फवारणी: उंची नियोजन, बॅटरी व्यवस्थापन व अचूक वापर',
        description: 'कापूस व ऊस पिकांवर नॅनो युरिया फवारणी करताना हवेचा वेग व ड्रॉपलेट साईझ नियंत्रित ठेवण्याची नियमावली.'
      },
      hi: {
        title: 'कृषि ड्रोन छिड़काव: ऊंचाई, बैटरी प्रबंधन और हवा का बहाव नियंत्रण',
        description: 'कपास और गन्ने पर नैनो यूरिया छिड़काव की प्रमाणित तकनीक।'
      },
      en: {
        title: 'Drone Foliar Spraying: Flight Height, Battery Swapping & Drift Control',
        description: 'Operational SOP for DGCA-certified drone pilots spraying micronutrients.'
      }
    },
    category: 'Farm Mechanization',
    videoUrl: 'https://cdn.agrovercity.in/videos/tutorials/drone_spray_sop.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=60',
    durationSeconds: 1020,
    viewCount: 15400,
    likeCount: 1210,
    status: 'under_review',
    tags: ['Agri Drone', 'Mechanization', 'Nano Urea', 'Safety SOP'],
    featured: false,
    createdAt: '2026-09-14T14:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z',
    userId: 'usr_admin_vikram'
  }
];

export const mockBlogArticles = [
  {
    id: 'blog_501',
    title: 'Zero-Tillage Wheat Sowing into Happy Seeder Paddy Stubble: A Farmer Case Study',
    slug: 'zero-tillage-happy-seeder-wheat-case-study',
    excerpt: 'How a 12-member farmer cluster in Punjab saved ₹3,200 per acre in diesel and reduced carbon emissions while reaping 22.4 qtl/acre yields.',
    contentMarkdown: 'Direct drilling of wheat into anchored rice residue using the tractor-mounted Happy Seeder completely eliminates the need for field burning. Soil organic carbon improved by 0.18% over 3 continuous seasons.',
    translations: {
      mr: {
        title: 'हॅपी सीडर तंत्रज्ञानाने भाताच्या अवशेषात गव्हाची विनामशागत पेरणी',
        excerpt: 'डिझेल खर्चात एकरी ₹३,२०० बचत आणि जमिनीतील सेंद्रिय कर्बात लक्षणीय वाढ साधणारा शेतकरी अनुभव.'
      },
      hi: {
        title: 'हैप्पी सीडर से पराली जलाए बिना गेहूं की सीधी बुवाई: व्यावहारिक सफलता',
        excerpt: 'डीजल खर्च में भारी कमी और 22 क्विंटल प्रति एकड़ पैदावार का किसान मॉडल।'
      },
      en: {
        title: 'Zero-Tillage Wheat Sowing into Happy Seeder Paddy Stubble: A Farmer Case Study',
        excerpt: 'Cluster study saving ₹3,200/acre in diesel while improving soil organic carbon.'
      }
    },
    category: 'Success Stories',
    authorName: 'Dr. Gurpreet Singh Sandhu',
    authorRole: 'Senior Agronomist, PAU Ludhiana',
    readTimeMinutes: 7,
    coverImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=60',
    status: 'published',
    publishedAt: '2026-09-10T10:00:00Z',
    tags: ['Zero Tillage', 'Wheat', 'Happy Seeder', 'Soil Carbon'],
    viewCount: 12400,
    createdAt: '2026-09-08T09:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
    userId: 'usr_admin_ananya'
  },
  {
    id: 'blog_502',
    title: 'Understanding PM-KUSUM Component B: Off-Grid Solar Pumping Subsidies Decoded',
    slug: 'pm-kusum-component-b-solar-pump-subsidy-guide',
    excerpt: 'Detailed analysis of CFA (Central Financial Assistance) 30% + State share 30% and bank term loan structure for 3 HP, 5 HP, and 7.5 HP surface pumps.',
    contentMarkdown: 'Component B of PM-KUSUM provides direct capital grants for replacement of existing diesel pumps in off-grid rural farming zones. Priority is provided to small and marginal farmers owning verified 7/12 land records.',
    translations: {
      mr: {
        title: 'पीएम कुसुम योजना भाग-ब: सौर कृषी पंप अनुदान सविस्तर विश्लेषण',
        excerpt: '३ एचपी, ५ एचपी व ७.५ एचपी सौर पंपांसाठी केंद्र व राज्य अनुदानाची संपूर्ण माहिती व अर्ज प्रक्रिया.'
      },
      hi: {
        title: 'पीएम-कुसुम योजना घटक-बी: सोलर पंप सब्सिडी की सम्पूर्ण गाइड',
        excerpt: 'डीजल पंपों को सौर ऊर्जा में बदलने के लिए 60% तक सरकारी अनुदान का संपूर्ण विवरण।'
      },
      en: {
        title: 'Understanding PM-KUSUM Component B: Off-Grid Solar Pumping Subsidies Decoded',
        excerpt: 'Detailed analysis of Central Financial Assistance and State subsidies for solar pumps.'
      }
    },
    category: 'Policy & Subsidies',
    authorName: 'Adv. Sharadrao Patil',
    authorRole: 'Agri Legal & Energy Policy Consultant',
    readTimeMinutes: 9,
    coverImageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=60',
    status: 'published',
    publishedAt: '2026-09-12T14:30:00Z',
    tags: ['PM KUSUM', 'Solar Pump', 'Subsidies', 'Renewable Energy'],
    viewCount: 18900,
    createdAt: '2026-09-11T12:00:00Z',
    updatedAt: '2026-09-12T14:30:00Z',
    userId: 'usr_admin_rahul'
  }
];

export const mockContentAuditLogs = [
  {
    id: 'aud_cnt_01',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Super Admin)',
    timestamp: '2026-09-21T06:45:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'BAN_CHAT_USER',
    entityId: 'chan_01',
    entityName: 'Krishi Darshan 24x7 Maharashtra',
    collection: 'agri_channels',
    previousState: 'user_active',
    newState: 'user_banned_permanent',
    reason: 'Spamming fraudulent cryptocurrency phishing links across live chat. User UID: user_troll_99 banned permanently per IT rules.'
  },
  {
    id: 'aud_cnt_02',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Super Admin)',
    timestamp: '2026-09-20T17:15:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'REGENERATE_STREAM_KEY',
    entityId: 'chan_02',
    entityName: 'Live Mandi Auction Floor: Lasalgaon & Vashi',
    collection: 'agri_channels',
    previousState: 'key_revoked',
    newState: 'key_generated_active',
    reason: 'Routine quarterly security rotation of RTMP ingest credentials for OB-Van uplink transmitter.'
  },
  {
    id: 'aud_cnt_03',
    adminUid: 'usr_admin_vikram',
    adminName: 'Vikram Mehta (Chief Risk Officer)',
    timestamp: '2026-09-20T14:30:00Z',
    ipAddress: '10.0.4.18',
    actionType: 'PUBLISH_BREAKING_NEWS',
    entityId: 'news_101',
    entityName: 'Maharashtra Declares ₹12,000/Ha Subsidy for Micro-Irrigation',
    collection: 'agri_news',
    previousState: 'scheduled',
    newState: 'published_breaking',
    reason: 'Official Maharashtra GR issued at 14:00. Breaking news tag enabled with Marathi voiceover narration push.'
  },
  {
    id: 'aud_cnt_04',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Super Admin)',
    timestamp: '2026-09-18T11:20:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'ISSUE_ICAR_CERTIFICATES',
    entityId: 'ws_204',
    entityName: 'Desi Gir & Sahiwal Dairy Unit Automation',
    collection: 'workshops',
    previousState: 'completed_pending_certs',
    newState: 'certificates_dispatched',
    reason: '120 participant attendance verified through biometric logs and quiz marks > 70%. Batch dispatched with ICAR digital watermark.'
  },
  {
    id: 'aud_cnt_05',
    adminUid: 'usr_admin_rahul',
    adminName: 'Rahul Shinde (Support Operator)',
    timestamp: '2026-09-17T16:40:00Z',
    ipAddress: '10.0.4.22',
    actionType: 'TRIAGE_FARMER_QUESTION',
    entityId: 'talk_301',
    entityName: 'Pest Resistance Management in Bt Cotton',
    collection: 'expert_talks',
    previousState: 'pending_triage',
    newState: 'approved_high_priority',
    reason: 'Approved farmer Narayan Jadhav question regarding tank-mix safety of Emamectin Benzoate with Boron for live webinar broadcast.'
  }
];

export const mockContentSummary = {
  totalActiveContent: 48,
  totalNewsArticles: 19,
  liveChannelsCount: 2,
  totalLiveViewers: 5990,
  activeWorkshops: 4,
  enrolledFarmersCount: 550,
  workshopRevenueINR: 678450,
  expertTalksScheduled: 3,
  farmerQuestionsPendingTriage: 8,
  flaggedChatMessages: 3,
  videoGuidesPublished: 14,
  blogArticlesPublished: 12
};
