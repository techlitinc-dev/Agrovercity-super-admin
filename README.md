# AGROVERCITY Superadmin Console

Enterprise React JS Superadmin console with implementation of:
- **Module 01: Authentication, RBAC, Sessions & Security (`SOP-01`)**
- **Module 02: User Management & Persona Engine (`SOP-02`)**
- **Module 03: KYC Verification & Document Vault (`SOP-03`)**
- **Module 04: Mandi Prices, Vyapari Live Rates & Approvals (`SOP-04`)**
- **Module 05: Produce Lots & B2B Trading (`SOP-05`)**

Based on specifications in [`docs/superadmin-instructions/`](file:///C:/ShuBhanGi/Agro-super-admin/Agro-super-admin-main/docs/superadmin-instructions/).

---

## 📦 Module 05: Produce Lots & B2B Trading (`SOP-05`)
- **Target Collections**: `market_lots`, `deals`, `procurements`, `buyer_ledgers`, `audit_logs`
- **Route / Path**: `/admin/lots`
- **Key Capabilities**:
  - **Produce Lots Oversight (`market_lots`)**: High-density grid of farmer harvested produce lots with photos, quantity, reserve price, assayer quality parameters (moisture %, foreign matter %, grain size), and live highest bids.
  - **Electronic Weighbridge Slip Attestation**: Cross-references farmer declared volume with Dharam Kanta electronic weight slips (gross, tare, net weight in kg/quintals) and calculates tolerance variance.
  - **B2B Deals & Escrow Hold (`deals`)**: Tracks contracts between farmers, procuring buyers, and commission agents (arhatiyas) with dedicated bank escrow protection (ICICI/HDFC/Axis Agro Escrow).
  - **Dispute Mediation & Arbitration Console**: Binding arbitration console supporting 100% farmer escrow release, laboratory quality docking adjustments, or contract cancellation with full buyer refund.
  - **Trader Procurement Ledgers (`procurements`)**: Monitors daily procurement volumes, weighbridge receipts, and payment deadlines.
  - **Buyer Credit & Udhaar Risk Engine (`buyer_ledgers`)**: APMC trader licensure tracking, credit utilization progress bars, overdue alerts, and seasonal credit limit adjustments.
  - **Fraudulent Listing Takedowns (`SuspendLotModal`)**: Suspends counterfeit or duplicate listings with mandatory administrative justification logged to `audit_logs`.

---

## 🌾 Module 04: Mandi Prices, Vyapari Live Rates & Approvals (`SOP-04`)
- **Target Collections**: `mandi_prices`, `vyapari_rates`, `mandi_history`, `audit_logs`
- **Route / Path**: `/admin/mandi`
- **Key Capabilities**:
  - **2-Hourly Partner Trader Rates Approvals**: Real-time review queue for vyapari submitted bids ('Aaj ke Bhav').
  - **Automated Sanity Band Validation (±15%)**: Automatic dynamic detection of predatory low bids (`deviation < -15%`) and inflated high bids (`deviation > +15%`) relative to official Agmarknet modal benchmarks.
  - **Visual Sanity Corridor Slider**: Visual corridor bar showing lower limit (-15%), Agmarknet modal benchmark, upper limit (+15%), and trader's offered price pin.
  - **Net-Profit Realization Calculator**: Calculates farmer net payout after freight deductions and APMC 0.5% user cess/weighbridge charges:
    $$\text{Net Farmer Realization} = \text{Offered Rate} - \text{Freight} - (\text{Offered Rate} \times 0.005)$$
  - **Central Agmarknet & eNAM Benchmarks View**: Synced modal, min, max prices, daily arrival tonnage (MT), and gateway latency across 8 major APMCs (Indore, Lasalgaon, Kota, Rajkot, etc.).
  - **Manual Rate Override Modal**: Administrative tool to override market modal rates when government API feeds are broken or experiencing 504 gateway timeouts, with mandatory audit logging.
  - **Reject Rate Workflow**: Preset compliance reasons and mandatory justification transmitted to trader's mobile app.
  - **Data Export & Batch Actions**: 1-click batch approvals and CSV/JSON data export.

---

## 🛠️ Features & SOP-01 Compliance

### 1. Screen Component Architecture
- **Header Banner**: Institutional wireframe banner with live module identifier (`SOP-01`), admin user pill (`[ Admin User: root@agrovercity ]`), and interactive **RBAC Role Switcher** to test Super Admin, Support Operator, and Financial Auditor permissions.
- **Top Metric Bar (4 KPI Cards)**:
  - Total Active Records & Live Sessions count
  - Pending Action & Locked Out Accounts
  - Today's Auth Volume (Phone OTP + MPIN success rate)
  - Flagged Security Anomalies (TOR exit nodes, failed attempt spikes)
- **Search & Filter Controls**:
  - Full-text search across Name, Mobile, Firebase UID, and ID
  - Status filter (`verified`, `pending`, `flagged`, `locked`, `suspended`)
  - Persona filter (`Farmer`, `Produce Buyer`, `Transporter`, `FPO Lead`, `Equipment Owner`, `Agri-Expert`)
  - Date Range filter (`24h`, `7d`, `30d`, `all`)
  - Export to CSV & Export to JSON with DPDP masking
- **Primary High-Density Data Grid**:
  - Multi-row selection with bulk actions
  - Sortable columns (ID, Name, Status, Created At)
  - Key Attributes display: Device counts, Live session status, MPIN & 2FA chips, DPDP masked Aadhaar
  - Action buttons: `[View / Inspect]`, `[Reset MPIN]`, `[Revoke Sessions]`, `[Status Toggle]`
  - Wireframe paginator: "Showing 1 - 10 of 8 records" with Prev/Next
- **Action Drawer (Slide-Over Modal)**:
  - **Identity & Auth**: Firebase UID, masked Aadhaar (`XXXX-XXXX-1234`), persona tags, timestamps
  - **Sessions & Devices**: Multi-device sessions (`sessions` and `devices` collections) with individual session termination
  - **Auth Tokens**: JWT access and refresh token inspection (`auth_tokens` collection)
  - **Guardrails & 2FA**: Toggle switches for 2FA, MPIN requirement, and Biometrics (FIDO2)
  - **Audit Trail**: Real-time immutable log of all admin modifications for this user
  - **Raw JSON Inspector**: Full enveloped document viewer with 1-click clipboard copy
- **Confirmation Dialogs**:
  - Mandatory administrative reason entry (minimum 8 characters) for audit trail compliance before committing destructive operations.
- **Emergency OTP Dispatch Modal**:
  - Visual display of generated 6-digit emergency OTP with 15-minute validity countdown.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

## 🔒 RBAC Permission Matrix

| Operation | Super Admin (`admin: true`) | Support Operator | Financial Auditor |
|---|:---:|:---:|:---:|
| View Directory & Logs | ✅ | ✅ | ✅ |
| Force MPIN Reset (Temporary OTP) | ✅ | ✅ | ❌ |
| Terminate Device Session | ✅ | ❌ | ❌ |
| Revoke All Sessions & Refresh Tokens | ✅ | ❌ | ❌ |
| Update Status (Suspend / Lock) | ✅ | ❌ | ❌ |
| Toggle 2FA / Security Flags | ✅ | ❌ | ❌ |
| Export Data (CSV / JSON) | ✅ | ✅ | ✅ |
