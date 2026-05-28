import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Patient } from '@healthstream/shared'
import { useAppState } from '../../context/AppStateContext'

const PROVIDERS = ['Dr. Sarah Chen', 'Dr. Michael Patel', 'Dr. Angela Reyes', 'Dr. James Kim']
const CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'COPD',
  'Congestive Heart Failure',
  'Chronic Kidney Disease',
  'Atrial Fibrillation',
  'NSCLC',
  'Asthma',
  'Other',
]

interface NewPatientForm {
  firstName: string
  lastName: string
  dob: string
  sex: 'Male' | 'Female' | 'Other' | ''
  zip: string
  primaryCondition: string
  referringProvider: string
}

const INITIAL_FORM: NewPatientForm = {
  firstName: '',
  lastName: '',
  dob: '',
  sex: '',
  zip: '',
  primaryCondition: '',
  referringProvider: '',
}

interface NewPatientModalProps {
  onClose: () => void
}

export function NewPatientModal({ onClose }: NewPatientModalProps) {
  const { addPatient } = useAppState()
  const [form, setForm] = useState<NewPatientForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof NewPatientForm, string>>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function validate(): boolean {
    const errs: Partial<Record<keyof NewPatientForm, string>> = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.dob) errs.dob = 'Required'
    if (!form.sex) errs.sex = 'Required'
    if (!form.zip.trim() || !/^\d{5}$/.test(form.zip.trim())) errs.zip = '5-digit ZIP required'
    if (!form.primaryCondition) errs.primaryCondition = 'Required'
    if (!form.referringProvider) errs.referringProvider = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setSaving(true)

    setTimeout(() => {
      const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
      const dobFormatted = new Date(form.dob).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })

      const newPatient: Patient = {
        id: `p-new-${Date.now()}`,
        caseId: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
        initials,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dob: dobFormatted,
        sex: form.sex as 'Male' | 'Female' | 'Other',
        hccScore: parseFloat((0.8 + Math.random() * 1.5).toFixed(2)),
        primaryConcern: form.primaryCondition,
        status: 'identified',
        risk: 'medium',
        diagnosis: form.primaryCondition,
        location: { zip: form.zip.trim(), lat: 37.09, lng: -95.71 },
        primaryPhysician: form.referringProvider,
        region: 'Region 4 Clinical Hub',
        notes: [],
        careTimeline: [],
        matchedTrials: [],
        appointments: [],
        contactLog: [],
      }

      addPatient(newPatient)
      toast.success(`Patient ${form.firstName} ${form.lastName} added successfully`)
      setSaving(false)
      onClose()
    }, 400)
  }

  function field(key: keyof NewPatientForm) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }))
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
      },
    }
  }

  const inputClass = (key: keyof NewPatientForm) =>
    `w-full rounded-lg border py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:border-brand-300 focus:ring-brand-100'
    }`

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
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
            <UserPlus className="h-5 w-5 text-brand-600" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-gray-900">New Patient</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add patient to registry</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">First Name *</label>
              <input type="text" placeholder="First name" className={inputClass('firstName')} {...field('firstName')} />
              {errors.firstName && <p className="mt-1 text-[11px] text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Last Name *</label>
              <input type="text" placeholder="Last name" className={inputClass('lastName')} {...field('lastName')} />
              {errors.lastName && <p className="mt-1 text-[11px] text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* DOB + Sex */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date of Birth *</label>
              <input type="date" className={inputClass('dob')} {...field('dob')} />
              {errors.dob && <p className="mt-1 text-[11px] text-red-500">{errors.dob}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sex *</label>
              <select className={inputClass('sex')} {...field('sex')}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.sex && <p className="mt-1 text-[11px] text-red-500">{errors.sex}</p>}
            </div>
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">ZIP Code *</label>
            <input
              type="text"
              placeholder="e.g. 10001"
              maxLength={5}
              className={inputClass('zip')}
              {...field('zip')}
            />
            {errors.zip && <p className="mt-1 text-[11px] text-red-500">{errors.zip}</p>}
          </div>

          {/* Primary condition */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Primary Condition *</label>
            <select className={inputClass('primaryCondition')} {...field('primaryCondition')}>
              <option value="">Select condition…</option>
              {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.primaryCondition && <p className="mt-1 text-[11px] text-red-500">{errors.primaryCondition}</p>}
          </div>

          {/* Referring provider */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Referring Provider *</label>
            <select className={inputClass('referringProvider')} {...field('referringProvider')}>
              <option value="">Select provider…</option>
              {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
            </select>
            {errors.referringProvider && <p className="mt-1 text-[11px] text-red-500">{errors.referringProvider}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            {saving ? 'Adding…' : 'Add Patient'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
