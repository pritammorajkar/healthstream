import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  ClipboardCheck,
  Settings,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import type {
  DashboardStats,
  PatientFlow,
  Patient,
  CareStreamEvent,
  Notification,
} from '../types'

// ─── App Shell ────────────────────────────────────────────────────────────────

export interface NavLink {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

export interface CurrentUser {
  name: string
  role: string
  avatarUrl?: string
  initials: string
}

export const appBranding = {
  name: 'HealthStream',
  subtitle: 'PHM DESKTOP',
}

export const currentUser: CurrentUser = {
  name: 'Dr. Sarah Chen',
  role: 'Chief Registrar',
  avatarUrl:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=faces',
  initials: 'SC',
}

export const navLinks: NavLink[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'registry', label: 'Registry', icon: ClipboardList, href: '/registry' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, href: '/insights' },
  { id: 'tasks', label: 'Task Center', icon: ClipboardCheck, href: '/tasks' },
]

export const secondaryLinks: NavLink[] = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'support', label: 'Support', icon: HelpCircle, href: '/support' },
]

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  activeCases: 1284,
  activeCasesTrend: 12,
  closedGaps: 892,
  closedGapsGoal: 1000,
  scheduledCare: 342,
  scheduledCareWindow: 'Next 48 hours',
}

// ─── Patient Flow ──────────────────────────────────────────────────────────────

export const patientFlow: PatientFlow = {
  identified: 452,
  outreach: 312,
  carePlan: 285,
  stabilized: 196,
}

// ─── Patients ──────────────────────────────────────────────────────────────────

export const patients: Patient[] = [
  {
    id: 'p-001',
    initials: 'RJ',
    firstName: 'Robert',
    lastName: 'Johnson',
    dob: '05/12/1954',
    hccScore: 2.45,
    primaryConcern: 'CHF Exacerbation Risk',
    status: 'outreach',
    risk: 'high',
    diagnosis: 'Congestive Heart Failure',
    staging: 'Stage III',
    biomarkers: [
      { name: 'BNP', value: '1420 pg/mL', type: 'expression' },
      { name: 'eGFR', value: '42 mL/min', type: 'flag' },
    ],
    location: { zip: '30301', lat: 33.749, lng: -84.388 },
  },
  {
    id: 'p-002',
    initials: 'MS',
    firstName: 'Maria',
    lastName: 'Santos',
    dob: '11/22/1962',
    hccScore: 1.82,
    primaryConcern: 'HbA1c > 9.0',
    status: 'care-plan',
    risk: 'medium',
    diagnosis: 'Type 2 Diabetes Mellitus',
    biomarkers: [
      { name: 'HbA1c', value: '9.4%', type: 'expression' },
      { name: 'eGFR', value: '61 mL/min', type: 'flag' },
    ],
    location: { zip: '90210', lat: 34.0901, lng: -118.4065 },
  },
  {
    id: 'p-003',
    initials: 'DW',
    firstName: 'David',
    lastName: 'Washington',
    dob: '03/08/1948',
    hccScore: 3.12,
    primaryConcern: 'COPD Exacerbation',
    status: 'identified',
    risk: 'high',
    diagnosis: 'Chronic Obstructive Pulmonary Disease',
    staging: 'GOLD III',
    biomarkers: [
      { name: 'FEV1', value: '38% predicted', type: 'expression' },
      { name: 'SpO2', value: '91%', type: 'flag' },
    ],
    location: { zip: '60601', lat: 41.8827, lng: -87.6233 },
  },
  {
    id: 'p-004',
    initials: 'LT',
    firstName: 'Linda',
    lastName: 'Thompson',
    dob: '07/30/1958',
    hccScore: 1.34,
    primaryConcern: 'Hypertension Management',
    status: 'stabilized',
    risk: 'low',
    diagnosis: 'Essential Hypertension',
    biomarkers: [
      { name: 'BP', value: '142/88 mmHg', type: 'flag' },
      { name: 'LDL', value: '118 mg/dL', type: 'expression' },
    ],
    location: { zip: '77001', lat: 29.7604, lng: -95.3698 },
  },
  {
    id: 'p-005',
    initials: 'JR',
    firstName: 'James',
    lastName: 'Rivera',
    dob: '09/14/1965',
    hccScore: 2.08,
    primaryConcern: 'CKD Stage 3b Monitoring',
    status: 'outreach',
    risk: 'high',
    diagnosis: 'Chronic Kidney Disease',
    staging: 'Stage 3b',
    biomarkers: [
      { name: 'eGFR', value: '32 mL/min', type: 'flag' },
      { name: 'Creatinine', value: '2.1 mg/dL', type: 'expression' },
      { name: 'UACR', value: '285 mg/g', type: 'expression' },
    ],
    location: { zip: '10001', lat: 40.7484, lng: -73.9967 },
  },
]

// ─── Care Stream Events ────────────────────────────────────────────────────────

export const careStreamEvents: CareStreamEvent[] = [
  {
    id: 'evt-001',
    type: 'success',
    title: 'Robert Miller Stabilized',
    description: 'Transitioned from High Risk to Managed Care cohort.',
    timestamp: '10:24 AM',
    patientId: 'p-miller',
  },
  {
    id: 'evt-002',
    type: 'critical',
    title: 'Post-Discharge Call',
    description: 'Alice Green due for 24-hour follow-up call.',
    timestamp: '9:15 AM',
    patientId: 'p-green',
  },
  {
    id: 'evt-003',
    type: 'info',
    title: 'Care Plan Updated',
    description: 'James Rivera\'s CKD care plan revised by Dr. Patel.',
    timestamp: '8:47 AM',
    patientId: 'p-005',
  },
  {
    id: 'evt-004',
    type: 'success',
    title: 'Gap Closed — Mammogram',
    description: 'Linda Thompson completed annual screening. Gap resolved.',
    timestamp: '8:02 AM',
    patientId: 'p-004',
  },
]

// ─── Notifications ─────────────────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  {
    id: 'n-001',
    type: 'alert',
    title: 'High-Risk Patient Flagged',
    description: 'Robert Johnson\'s BNP level has risen to 1,420 pg/mL. Immediate outreach recommended.',
    time: '10:31 AM',
    read: false,
  },
  {
    id: 'n-002',
    type: 'alert',
    title: 'Missed Follow-Up',
    description: 'Alice Green did not answer her 24-hour post-discharge call. Escalation required.',
    time: '9:50 AM',
    read: false,
  },
  {
    id: 'n-003',
    type: 'info',
    title: 'Care Plan Revised',
    description: 'Dr. Patel updated James Rivera\'s CKD care plan. Review the new medication schedule.',
    time: '8:47 AM',
    read: false,
  },
  {
    id: 'n-004',
    type: 'success',
    title: 'Gap Closed',
    description: 'Linda Thompson completed her annual mammogram screening. Care gap resolved.',
    time: '8:02 AM',
    read: true,
  },
  {
    id: 'n-005',
    type: 'info',
    title: 'Registry Sync Complete',
    description: 'Region 4 Clinical Hub data synced successfully. 1,284 active cases updated.',
    time: 'Yesterday',
    read: true,
  },
]
