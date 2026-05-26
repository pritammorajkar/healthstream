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

export interface Patient {
  id: string
  initials: string
  firstName: string
  lastName: string
  dob: string                     // MM/DD/YYYY
  hccScore: number
  primaryConcern: string
  status: PatientStatus
  risk: PatientRisk
  diagnosis?: string
  staging?: string
  biomarkers?: Biomarker[]
  location?: PatientLocation
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
