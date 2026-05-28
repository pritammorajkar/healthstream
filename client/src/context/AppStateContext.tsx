import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  Patient,
  PatientStatus,
  PatientNote,
  CareStreamEvent,
  Task,
  Appointment,
  ContactLog,
} from '@healthstream/shared'
import {
  patients as initialPatients,
  careStreamEvents as initialEvents,
  mockTasks as initialTasks,
} from '../data/mockData'

interface AppStateContextValue {
  patients: Patient[]
  careStreamEvents: CareStreamEvent[]
  tasks: Task[]
  addNote: (patientId: string, note: PatientNote) => void
  updatePatientStatus: (patientId: string, status: PatientStatus) => void
  addCareStreamEvent: (event: CareStreamEvent) => void
  addPatient: (patient: Patient) => void
  addTask: (task: Task) => void
  addContactLog: (patientId: string, log: ContactLog) => void
  addAppointment: (patientId: string, appt: Appointment) => void
  cancelAppointment: (patientId: string, apptId: string) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [careStreamEvents, setCareStreamEvents] = useState<CareStreamEvent[]>(initialEvents)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  function addNote(patientId: string, note: PatientNote) {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, notes: [...(p.notes ?? []), note] } : p))
    )
  }

  function updatePatientStatus(patientId: string, status: PatientStatus) {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, status } : p)))
  }

  function addCareStreamEvent(event: CareStreamEvent) {
    setCareStreamEvents((prev) => [event, ...prev])
  }

  function addPatient(patient: Patient) {
    setPatients((prev) => [patient, ...prev])
  }

  function addTask(task: Task) {
    setTasks((prev) => [task, ...prev])
  }

  function addContactLog(patientId: string, log: ContactLog) {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, contactLog: [...(p.contactLog ?? []), log] } : p
      )
    )
  }

  function addAppointment(patientId: string, appt: Appointment) {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, appointments: [...(p.appointments ?? []), appt] } : p
      )
    )
  }

  function cancelAppointment(patientId: string, apptId: string) {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              appointments: (p.appointments ?? []).map((a) =>
                a.id === apptId ? { ...a, status: 'cancelled' as const } : a
              ),
            }
          : p
      )
    )
  }

  return (
    <AppStateContext.Provider
      value={{
        patients,
        careStreamEvents,
        tasks,
        addNote,
        updatePatientStatus,
        addCareStreamEvent,
        addPatient,
        addTask,
        addContactLog,
        addAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
