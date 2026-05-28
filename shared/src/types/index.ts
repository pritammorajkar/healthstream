export interface DashboardStats {
  activeCases: number
  activeCasesTrend: number        // percentage, e.g. 12 = +12%
  closedGaps: number
  closedGapsGoal: number
  scheduledCare: number
  scheduledCareWindow: string     // e.g. "Next 48 hours"
}

export interface PatientFlow {
  identified: number
  outreach: number
  carePlan: number
  stabilized: number
}

export type PatientStatus = 'identified' | 'outreach' | 'care-plan' | 'stabilized'
export type PatientRisk = 'high' | 'medium' | 'low'
export type BiomarkerType = 'mutation' | 'expression' | 'flag'

export interface Biomarker {
  name: string
  value: string
  type: BiomarkerType
}

export interface PatientLocation {
  zip: string
  lat: number
  lng: number
}

export interface PatientNote {
  id: string
  patientId: string
  text: string
  author: string
  createdAt: string   // ISO date string
}

export interface ClinicalTrial {
  id: string
  name: string
  phase: string
  location: string
  matchPercentage: number
  sponsor: string
  status: 'recruiting' | 'active' | 'completed'
}

export interface ScoreBreakdown {
  diagnosis: number
  biomarker: number
  location: number
}

export interface ClinicalTrialFull {
  id: string
  title: string
  description: string
  phase: string
  location: string
  coordinates: { lat: number; lng: number }
  distance: number
  matchScore: number
  scoreBreakdown: ScoreBreakdown
  inclusionCriteria: string[]
  exclusionCriteria: string[]
  principalInvestigator: string
  enrollmentStatus: 'recruiting' | 'active' | 'completed' | 'closed'
}

export interface TrialMatchHistory {
  trialId: string
  trialTitle: string
  matchScore: number
  date: string
  outcome: 'enrolled' | 'not-eligible' | 'withdrawn'
}

export interface Patient {
  id: string
  caseId?: string
  initials: string
  firstName: string
  lastName: string
  dob: string                     // MM/DD/YYYY
  sex?: 'Male' | 'Female' | 'Other'
  hccScore: number
  primaryConcern: string
  status: PatientStatus
  risk: PatientRisk
  diagnosis?: string
  staging?: string
  biomarkers?: Biomarker[]
  location?: PatientLocation
  notes?: PatientNote[]
  matchedTrials?: ClinicalTrial[]
  matchedTrialsHistory?: TrialMatchHistory[]
  careTimeline?: CareTimelineEvent[]
  phone?: string
  email?: string
  region?: string
  primaryPhysician?: string
  appointments?: Appointment[]
  contactLog?: ContactLog[]
}

export interface CareTimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'appointment' | 'lab' | 'medication' | 'milestone' | 'alert'
}

export type CareStreamEventType = 'success' | 'critical' | 'info'

export interface CareStreamEvent {
  id: string
  type: CareStreamEventType
  title: string
  description: string
  timestamp: string               // e.g. "10:24 AM"
  patientId?: string
}

export interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export type NotificationType = 'alert' | 'info' | 'success'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  read: boolean
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  patientId: string
  patientName: string
  patientInitials: string
  dueDate: string                 // YYYY-MM-DD
  priority: TaskPriority
  assignedTo: string
  notes?: string
  status: TaskStatus
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export interface InsightsStats {
  totalPatients: number
  avgHccScore: number
  careGapsClosed: number
  stabilizationRate: number       // percentage 0-100
}

export interface PatientFlowWeek {
  week: string
  identified: number
  outreach: number
  carePlan: number
  stabilized: number
}

export interface RiskDistribution {
  name: string
  value: number
  color: string
}

export interface CareGapMonth {
  month: string
  closed: number
  goal: number
}

export interface HccBucket {
  range: string
  count: number
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentType =
  | 'Follow-up Visit'
  | 'Lab Review'
  | 'Care Plan Review'
  | 'Specialist Referral'
  | 'Telehealth Call'

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled'
export type AppointmentDuration = 15 | 30 | 45 | 60

export interface Appointment {
  id: string
  patientId: string
  date: string                    // YYYY-MM-DD
  time: string                    // e.g. "9:00 AM"
  type: AppointmentType
  provider: string
  duration: AppointmentDuration
  notes?: string
  reminders: { twentyFourHour: boolean; oneHour: boolean }
  status: AppointmentStatus
}

// ─── Contact Log ───────────────────────────────────────────────────────────────

export type ContactMethod = 'Phone Call' | 'Email' | 'In-Person' | 'Video Call'
export type ContactOutcome = 'Reached Patient' | 'No Answer' | 'Left Voicemail' | 'Patient Declined'

export interface ContactLog {
  id: string
  patientId: string
  method: ContactMethod
  outcome: ContactOutcome
  note?: string
  date: string                    // ISO date string
  loggedBy: string
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  fullName: string
  role: string
  email: string
  region: string
  initials: string
}

export interface UserPreferences {
  emailNotifications: boolean
  desktopNotifications: boolean
  defaultSortOrder: 'hcc-desc' | 'name-asc' | 'dob-asc'
  itemsPerPage: 10 | 25 | 50
}
