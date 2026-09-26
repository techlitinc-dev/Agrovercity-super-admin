// Admin Staff & Module Delegation Service for AGROVERCITY Superadmin
// Implements Staff Hierarchy: Superadmin ➔ Admins ➔ DEOs (Data Entry Operators)
// Tracks delegated module permissions across 26 platform modules

import { ALL_MODULES_MAP } from '../lib/navigationConfig';

const STAFF_STORAGE_KEY = 'agrovercity_superadmin_staff';

export const INITIAL_STAFF = [
  {
    id: "STAFF-001",
    name: "Dr. Vikram Deshmukh",
    email: "vikram.deshmukh@agrovercity.in",
    mobile: "+91 98221 00101",
    role: "Superadmin",
    department: "Executive & Platform Governance",
    zone: "State HQ (Pune)",
    status: "active",
    delegatedModules: Object.keys(ALL_MODULES_MAP), // All 26 modules
    permissions: {
      canApprove: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canDelegate: true
    },
    createdAt: "2026-08-01T09:00:00.000Z",
    lastActiveAt: "2026-09-25T05:30:00.000Z"
  },
  {
    id: "STAFF-002",
    name: "Rajesh Shinde",
    email: "rajesh.shinde@agrovercity.in",
    mobile: "+91 98223 44551",
    role: "Admin",
    department: "Agri-Commerce & Market Operations",
    zone: "Western Zone (Kolhapur APMC)",
    status: "active",
    delegatedModules: ['04', '05', '06', '07', '18'],
    permissions: {
      canApprove: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canDelegate: false
    },
    createdAt: "2026-08-15T11:20:00.000Z",
    lastActiveAt: "2026-09-24T16:45:00.000Z"
  },
  {
    id: "STAFF-003",
    name: "Sunita Ghorpade",
    email: "sunita.ghorpade@agrovercity.in",
    mobile: "+91 94220 78119",
    role: "Admin",
    department: "Land Records & Revenue Liaison",
    zone: "Central Division (Nashik)",
    status: "active",
    delegatedModules: ['08', '09', '10', '16', '17'],
    permissions: {
      canApprove: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canDelegate: false
    },
    createdAt: "2026-08-20T10:15:00.000Z",
    lastActiveAt: "2026-09-25T04:10:00.000Z"
  },
  {
    id: "STAFF-004",
    name: "Anil Kadam",
    email: "anil.kadam@agrovercity.in",
    mobile: "+91 97654 32190",
    role: "DEO",
    department: "APMC Daily Ticker Operations",
    zone: "Kolhapur APMC Yard",
    status: "active",
    delegatedModules: ['04'],
    permissions: {
      canApprove: false,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canDelegate: false
    },
    createdAt: "2026-09-01T08:30:00.000Z",
    lastActiveAt: "2026-09-25T05:15:00.000Z"
  },
  {
    id: "STAFF-005",
    name: "Pooja Bhosale",
    email: "pooja.bhosale@agrovercity.in",
    mobile: "+91 98901 23456",
    role: "DEO",
    department: "7/12 & 8A Digitization Cell",
    zone: "Sangli Tehsil Office",
    status: "active",
    delegatedModules: ['16'],
    permissions: {
      canApprove: false,
      canEdit: true,
      canDelete: false,
      canExport: false,
      canDelegate: false
    },
    createdAt: "2026-09-05T09:45:00.000Z",
    lastActiveAt: "2026-09-24T14:20:00.000Z"
  },
  {
    id: "STAFF-006",
    name: "Mahesh Deshpande",
    email: "mahesh.deshpande@agrovercity.in",
    mobile: "+91 98811 77665",
    role: "Admin",
    department: "Kisan Finance & PMFBY Claims",
    zone: "Marathwada Division (Chhatrapati Sambhajinagar)",
    status: "active",
    delegatedModules: ['14', '15', '24', '25'],
    permissions: {
      canApprove: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canDelegate: false
    },
    createdAt: "2026-08-25T14:10:00.000Z",
    lastActiveAt: "2026-09-25T03:40:00.000Z"
  }
];

function getStoredStaff() {
  const data = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_STAFF;
  }
}

function saveStaff(staffList) {
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
}

export const adminStaffService = {
  async listStaff({ query = '', role = 'all', module = 'all', status = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let staff = getStoredStaff();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      staff = staff.filter((s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.mobile && s.mobile.includes(q)) ||
        (s.department && s.department.toLowerCase().includes(q)) ||
        (s.zone && s.zone.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q))
      );
    }

    if (role !== 'all') {
      staff = staff.filter((s) => s.role.toLowerCase() === role.toLowerCase());
    }

    if (module !== 'all') {
      staff = staff.filter((s) => s.delegatedModules && s.delegatedModules.includes(module));
    }

    if (status !== 'all') {
      staff = staff.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    return {
      success: true,
      data: {
        staff,
        total: staff.length
      }
    };
  },

  async addStaff(staffData) {
    await new Promise((r) => setTimeout(r, 100));
    const staffList = getStoredStaff();
    const newId = `STAFF-${String(staffList.length + 1).padStart(3, '0')}`;
    const newStaff = {
      id: newId,
      name: staffData.name.trim(),
      email: staffData.email.trim(),
      mobile: staffData.mobile.trim(),
      role: staffData.role || 'Admin',
      department: staffData.department || 'Operations',
      zone: staffData.zone || 'Maharashtra State',
      status: staffData.status || 'active',
      delegatedModules: staffData.delegatedModules || [],
      permissions: {
        canApprove: !!staffData.permissions?.canApprove,
        canEdit: staffData.permissions?.canEdit !== undefined ? !!staffData.permissions.canEdit : true,
        canDelete: !!staffData.permissions?.canDelete,
        canExport: staffData.permissions?.canExport !== undefined ? !!staffData.permissions.canExport : true,
        canDelegate: staffData.role === 'Superadmin'
      },
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    staffList.unshift(newStaff);
    saveStaff(staffList);

    return {
      success: true,
      message: `Staff member ${newStaff.name} created successfully with role ${newStaff.role}`,
      staff: newStaff
    };
  },

  async updateStaff(id, updates) {
    await new Promise((r) => setTimeout(r, 80));
    const staffList = getStoredStaff();
    const index = staffList.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }

    staffList[index] = {
      ...staffList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveStaff(staffList);
    return {
      success: true,
      message: `Staff member ${staffList[index].name} updated successfully`,
      staff: staffList[index]
    };
  },

  async toggleStatus(id) {
    await new Promise((r) => setTimeout(r, 80));
    const staffList = getStoredStaff();
    const index = staffList.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }

    const currentStatus = staffList[index].status;
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    staffList[index].status = newStatus;
    staffList[index].updatedAt = new Date().toISOString();

    saveStaff(staffList);
    return {
      success: true,
      message: `Staff member status changed to ${newStatus}`,
      staff: staffList[index]
    };
  },

  async deleteStaff(id) {
    await new Promise((r) => setTimeout(r, 80));
    let staffList = getStoredStaff();
    staffList = staffList.filter((s) => s.id !== id);
    saveStaff(staffList);
    return {
      success: true,
      message: 'Staff member removed from delegation hierarchy'
    };
  },

  async resetToDefaultSeed() {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
    return { success: true };
  }
};
