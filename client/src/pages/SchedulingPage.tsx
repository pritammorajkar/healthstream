import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Clock, User2, LayoutGrid, List, Bell, CheckCircle2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AppointmentType, AppointmentDuration, Appointment } from '@healthstream/shared'
import { useAppState } from '../context/AppStateContext'
import { PageTransition } from '../components/common/PageTransition'
import { Avatar } from '../components/common/Avatar'

const PROVIDERS = ['Dr. Sarah Chen', 'Dr. Michael Patel', 'Dr. Angela Reyes', 'Dr. James Kim']
const APPT_TYPES: AppointmentType[] = [
  'Follow-up Visit',
  'Lab Review',
  'Care Plan Review',
  'Specialist Referral',
  'Telehealth Call',
]
const DURATIONS: AppointmentDuration[] = [15, 30, 45, 60]
const ALL_SLOTS = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '4:00 PM']
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEK_HOURS = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM – 6 PM

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

function formatDisplayDate(dateStr: string): string {
  const { year, month, day } = parseDate(dateStr)
  return `${MONTHS[month]} ${day}, ${year}`
}

function getWeekDays(year: number, month: number, day: number): Date[] {
  const date = new Date(year, month, day)
  const dayOfWeek = date.getDay()
  const sunday = new Date(date)
  sunday.setDate(day - dayOfWeek)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return d
  })
}

interface SuccessModalProps {
  appointment: Appointment
  patientName: string
  patientEmail: string
  onClose: () => void
}

function SuccessModal({ appointment, patientName, patientEmail, onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-medical-teal/10 border-b border-medical-teal/20 px-6 py-5 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-medical-teal shrink-0" strokeWidth={2} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Appointment Confirmed</h2>
            <p className="text-sm text-gray-500 mt-0.5">Confirmation email sent to patient</p>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm space-y-3 mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Email Preview</p>
            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-400">To: <span className="text-gray-700 font-medium">{patientEmail}</span></p>
              <p className="text-xs text-gray-400 mt-1">Subject: <span className="text-gray-700 font-medium">Appointment Confirmation — {appointment.type}</span></p>
            </div>
            <p className="text-gray-700 font-medium">Dear {patientName},</p>
            <p className="text-gray-600 leading-relaxed">
              Your appointment has been confirmed. Please find the details below:
            </p>
            <div className="rounded-lg bg-white border border-gray-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-brand-500 shrink-0" />
                <span><span className="font-semibold">Date:</span> {formatDisplayDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-brand-500 shrink-0" />
                <span><span className="font-semibold">Time:</span> {appointment.time} ({appointment.duration} min)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User2 className="h-4 w-4 text-brand-500 shrink-0" />
                <span><span className="font-semibold">Provider:</span> {appointment.provider}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <List className="h-4 w-4 text-brand-500 shrink-0" />
                <span><span className="font-semibold">Type:</span> {appointment.type}</span>
              </div>
            </div>
            {appointment.reminders.twentyFourHour && (
              <p className="text-xs text-gray-500">
                ✓ Reminder will be sent 24 hours before your appointment.
              </p>
            )}
            {appointment.reminders.oneHour && (
              <p className="text-xs text-gray-500">
                ✓ Reminder will be sent 1 hour before your appointment.
              </p>
            )}
            <p className="text-gray-600">
              If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            </p>
            <p className="text-gray-700 font-medium">Bacancy HealthStream Care Team</p>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}

interface CancelDialogProps {
  appointment: Appointment
  onConfirm: () => void
  onCancel: () => void
}

function CancelDialog({ appointment, onConfirm, onCancel }: CancelDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cancel Appointment</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to cancel the <strong>{appointment.type}</strong> on{' '}
          <strong>{formatDisplayDate(appointment.date)}</strong> at {appointment.time}?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Keep Appointment
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
}

export function SchedulingPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { patients, addAppointment, cancelAppointment } = useAppState()

  const patient = patients.find((p) => p.id === patientId)

  const today = new Date()
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [apptType, setApptType] = useState<AppointmentType>('Follow-up Visit')
  const [provider, setProvider] = useState(PROVIDERS[0])
  const [duration, setDuration] = useState<AppointmentDuration>(30)
  const [notes, setNotes] = useState('')
  const [reminderDay, setReminderDay] = useState(true)
  const [reminderHour, setReminderHour] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showSuccess) setShowSuccess(false)
        if (cancelTarget) setCancelTarget(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showSuccess, cancelTarget])

  const patientAppointments = patient?.appointments ?? []

  const bookedSlotsForDate = useCallback(
    (dateStr: string) =>
      patientAppointments
        .filter((a) => a.date === dateStr && a.status !== 'cancelled')
        .map((a) => a.time),
    [patientAppointments]
  )

  // ── Calendar grid ─────────────────────────────────────────────────────────────
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function isPast(day: number) {
    const d = new Date(currentYear, currentMonth, day)
    d.setHours(23, 59, 59)
    return d < today
  }

  function isToday(day: number) {
    return (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      day === today.getDate()
    )
  }

  function hasAvailableSlot(day: number): boolean {
    if (isPast(day)) return false
    const ds = formatDate(currentYear, currentMonth, day)
    const booked = bookedSlotsForDate(ds)
    return ALL_SLOTS.some((s) => !booked.includes(s))
  }

  function navMonth(dir: 1 | -1) {
    let m = currentMonth + dir
    let y = currentYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setCurrentMonth(m)
    setCurrentYear(y)
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  function selectDay(day: number) {
    if (isPast(day)) return
    const ds = formatDate(currentYear, currentMonth, day)
    setSelectedDate(ds)
    setSelectedSlot(null)
  }

  // ── Week view ─────────────────────────────────────────────────────────────────
  const weekDays = selectedDate
    ? (() => { const { year, month, day } = parseDate(selectedDate); return getWeekDays(year, month, day) })()
    : getWeekDays(today.getFullYear(), today.getMonth(), today.getDate())

  function isWeekDayPast(d: Date) {
    const copy = new Date(d); copy.setHours(23, 59, 59)
    return copy < today
  }

  function getWeekApptAtHour(d: Date, hour: number): Appointment | undefined {
    const ds = formatDate(d.getFullYear(), d.getMonth(), d.getDate())
    return patientAppointments.find((a) => {
      if (a.date !== ds || a.status === 'cancelled') return false
      const h = parseInt(a.time)
      const isPM = a.time.includes('PM') && h !== 12
      return (isPM ? h + 12 : h) === hour
    })
  }

  // ── Booking ───────────────────────────────────────────────────────────────────
  function confirmBooking() {
    if (!selectedDate || !selectedSlot || !patient) return

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: patient.id,
      date: selectedDate,
      time: selectedSlot,
      type: apptType,
      provider,
      duration,
      notes: notes.trim() || undefined,
      reminders: { twentyFourHour: reminderDay, oneHour: reminderHour },
      status: 'confirmed',
    }
    addAppointment(patient.id, newAppt)
    setConfirmedAppt(newAppt)
    setShowSuccess(true)
    setSelectedDate(null)
    setSelectedSlot(null)
    setNotes('')
  }

  function handleCancelConfirm() {
    if (!cancelTarget || !patient) return
    cancelAppointment(patient.id, cancelTarget.id)
    setCancelTarget(null)
    toast('Appointment cancelled', {
      icon: '🗑️',
      style: { background: '#fee2e2', color: '#dc2626' },
    })
  }

  function handleSuccessClose() {
    setShowSuccess(false)
    navigate(`/registry/${patientId}`)
  }

  if (!patient) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Patient not found.</p>
        </div>
      </PageTransition>
    )
  }

  const selectedBooked = selectedDate ? bookedSlotsForDate(selectedDate) : []
  const canConfirm = !!selectedDate && !!selectedSlot
  const upcomingAppts = patientAppointments
    .filter((a) => a.status !== 'cancelled' && a.date >= formatDate(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Care</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {patient.firstName} {patient.lastName} · {patient.primaryConcern}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Avatar initials={patient.initials} />
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
            <p className="text-xs text-gray-400">DOB: {patient.dob}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Left column ── */}
        <div className="space-y-4">
          {/* Appointment type + provider */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Appointment Type</label>
                <select
                  value={apptType}
                  onChange={(e) => setApptType(e.target.value as AppointmentType)}
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  {APPT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar card */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navMonth(-1)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-base font-bold text-gray-900">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button onClick={() => navMonth(1)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* View toggle */}
            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setViewMode('month')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${viewMode === 'month' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${viewMode === 'week' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <List className="h-3.5 w-3.5" /> Week
                </button>
              </div>
            </div>

            {viewMode === 'month' ? (
              <>
                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarCells.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />
                    const ds = formatDate(currentYear, currentMonth, day)
                    const past = isPast(day)
                    const todayDay = isToday(day)
                    const available = hasAvailableSlot(day)
                    const isSelected = selectedDate === ds

                    return (
                      <button
                        key={day}
                        onClick={() => selectDay(day)}
                        disabled={past}
                        className={[
                          'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all',
                          past ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                          !past && available && !isSelected ? 'hover:bg-brand-50 hover:text-brand-600' : '',
                          isSelected ? 'bg-brand-500 text-white shadow-md' : '',
                          todayDay && !isSelected ? 'ring-2 ring-brand-400 ring-offset-1 font-bold text-brand-600' : '',
                          !past && available && !isSelected && !todayDay ? 'text-gray-800' : '',
                          !past && !available && !isSelected ? 'text-gray-400' : '',
                        ].join(' ')}
                      >
                        {day}
                        {!past && available && !isSelected && (
                          <span className="absolute mt-7 h-1 w-1 rounded-full bg-brand-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              /* Week view */
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] text-xs">
                  <div />
                  {weekDays.map((d) => {
                    const ds = formatDate(d.getFullYear(), d.getMonth(), d.getDate())
                    const isSel = selectedDate === ds
                    const isTd = ds === formatDate(today.getFullYear(), today.getMonth(), today.getDate())
                    return (
                      <button
                        key={ds}
                        onClick={() => !isWeekDayPast(d) && setSelectedDate(ds)}
                        disabled={isWeekDayPast(d)}
                        className={[
                          'flex flex-col items-center pb-2 pt-1 rounded-t-lg transition-colors',
                          isWeekDayPast(d) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-50',
                          isSel ? 'bg-brand-500 text-white hover:bg-brand-500' : '',
                          isTd && !isSel ? 'ring-2 ring-brand-400' : '',
                        ].join(' ')}
                      >
                        <span className={isSel ? 'text-brand-100' : 'text-gray-400'}>{DAYS_OF_WEEK[d.getDay()]}</span>
                        <span className={`font-bold ${isSel ? 'text-white' : 'text-gray-800'}`}>{d.getDate()}</span>
                      </button>
                    )
                  })}
                  {WEEK_HOURS.map((hour) => (
                    <>
                      <div key={`h-${hour}`} className="text-right pr-2 text-gray-400 py-2 text-[11px]">
                        {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                      </div>
                      {weekDays.map((d) => {
                        const appt = getWeekApptAtHour(d, hour)
                        const past = isWeekDayPast(d)
                        return (
                          <div
                            key={`${d.toDateString()}-${hour}`}
                            className={`border-t border-gray-50 py-1 px-0.5 min-h-[32px] ${past ? 'bg-gray-50' : ''}`}
                          >
                            {appt && (
                              <div className="rounded bg-brand-100 text-brand-700 px-1 py-0.5 text-[10px] font-semibold leading-tight truncate">
                                {appt.type.split(' ')[0]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time slots */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl bg-white border border-gray-100 shadow-sm p-5"
              >
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  Available Slots — {formatDisplayDate(selectedDate)}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {ALL_SLOTS.map((slot) => {
                    const booked = selectedBooked.includes(slot)
                    const selected = selectedSlot === slot
                    return (
                      <button
                        key={slot}
                        onClick={() => !booked && setSelectedSlot(slot)}
                        disabled={booked}
                        className={[
                          'rounded-lg border py-2 px-1 text-xs font-semibold transition-all',
                          booked
                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            : selected
                            ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50',
                        ].join(' ')}
                      >
                        {booked ? (
                          <span className="flex flex-col items-center gap-0.5">
                            <span>{slot}</span>
                            <span className="text-[10px] font-normal">Booked</span>
                          </span>
                        ) : (
                          slot
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Booking summary */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Booking Summary</h3>

            {selectedDate && selectedSlot ? (
              <div className="rounded-lg bg-brand-50 border border-brand-100 p-4 mb-4 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User2 className="h-4 w-4 text-brand-500 shrink-0" />
                  <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <List className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{apptType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User2 className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{provider}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{formatDisplayDate(selectedDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{selectedSlot}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 p-4 mb-4 text-center text-sm text-gray-400">
                Select a date and time slot
              </div>
            )}

            {/* Duration */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`rounded-lg border py-1.5 text-xs font-semibold transition-colors ${duration === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'}`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this appointment…"
                rows={3}
                className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm resize-none focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Reminders */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Reminders</label>
              <div className="space-y-2">
                {([
                  { label: '24 hour reminder', value: reminderDay, set: setReminderDay },
                  { label: '1 hour reminder', value: reminderHour, set: setReminderHour },
                ] as const).map(({ label, value, set }) => (
                  <label key={label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-gray-400" />
                      {label}
                    </span>
                    <button
                      type="button"
                      onClick={() => set(!value)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${value ? 'bg-brand-500' : 'bg-gray-200'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={confirmBooking}
              disabled={!canConfirm}
              className="w-full rounded-lg bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Confirm Booking
            </button>
          </div>

          {/* Existing appointments */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Upcoming Appointments</h3>
            {upcomingAppts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-2">
                {upcomingAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="rounded-lg border border-gray-100 p-3 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{appt.type}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyles[appt.status]}`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDisplayDate(appt.date)} · {appt.time} · {appt.duration} min</p>
                    <p className="text-xs text-gray-400 mt-0.5">{appt.provider}</p>
                    {appt.status !== 'cancelled' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setSelectedDate(appt.date)
                            setApptType(appt.type)
                            setProvider(appt.provider)
                            setDuration(appt.duration)
                          }}
                          className="flex-1 rounded border border-brand-200 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelTarget(appt)}
                          className="flex-1 rounded border border-red-200 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSuccess && confirmedAppt && (
          <SuccessModal
            appointment={confirmedAppt}
            patientName={`${patient.firstName} ${patient.lastName}`}
            patientEmail={patient.email ?? 'patient@email.com'}
            onClose={handleSuccessClose}
          />
        )}
        {cancelTarget && (
          <CancelDialog
            appointment={cancelTarget}
            onConfirm={handleCancelConfirm}
            onCancel={() => setCancelTarget(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
