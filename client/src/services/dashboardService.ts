import type { DashboardStats, PatientFlow, Patient, CareStreamEvent } from '@healthstream/shared'
import {
  dashboardStats,
  patientFlow,
  patients,
  careStreamEvents,
} from '../data/mockData'

// Simulates a network round-trip. Each function maps to a Phase 2 API endpoint
// (see CLAUDE.md §API Endpoints). Swap the mock return for a real fetch call
// when the Express backend is ready — return types stay the same.
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// Phase 2: GET /api/dashboard/stats
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300)
  return dashboardStats
}

// Phase 2: GET /api/dashboard/patient-flow
export async function getPatientFlow(): Promise<PatientFlow> {
  await delay(300)
  return patientFlow
}

// Phase 2: GET /api/patients
export async function getPatients(): Promise<Patient[]> {
  await delay(300)
  return patients
}

// Phase 2: GET /api/care-stream
export async function getCareStreamEvents(): Promise<CareStreamEvent[]> {
  await delay(300)
  return careStreamEvents
}
