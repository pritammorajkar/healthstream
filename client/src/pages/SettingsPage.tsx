import { useState } from 'react'
import { User, Bell, Info, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UserProfile, UserPreferences } from '@healthstream/shared'
import { defaultUserProfile, defaultUserPreferences } from '../data/mockData'
import { PageTransition } from '../components/common/PageTransition'

type Tab = 'profile' | 'preferences' | 'about'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'preferences', label: 'Preferences', icon: <Bell className="h-4 w-4" /> },
  { id: 'about', label: 'About', icon: <Info className="h-4 w-4" /> },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? 'bg-brand-500' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile)
  const [prefs, setPrefs] = useState<UserPreferences>(defaultUserPreferences)

  function saveProfile() {
    toast.success('Profile saved successfully')
  }

  function savePreferences() {
    toast.success('Preferences updated')
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account and application preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-brand-500' : 'text-gray-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Profile Information</h2>

              {/* Avatar preview */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
                  {profile.initials || 'SC'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{profile.fullName}</p>
                  <p className="text-xs text-gray-500">{profile.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(v) => {
                    const parts = v.trim().split(' ')
                    const initials = parts.length >= 2
                      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                      : parts[0]?.[0]?.toUpperCase() ?? ''
                    setProfile((p) => ({ ...p, fullName: v, initials }))
                  }}
                />
                <FormField
                  label="Role"
                  value={profile.role}
                  onChange={(v) => setProfile((p) => ({ ...p, role: v }))}
                />
                <FormField
                  label="Email"
                  value={profile.email}
                  type="email"
                  onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                />
                <FormField
                  label="Region"
                  value={profile.region}
                  onChange={(v) => setProfile((p) => ({ ...p, region: v }))}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Preferences</h2>

              <div className="space-y-5">
                <PreferenceRow
                  label="Email Notifications"
                  description="Receive alerts and updates via email"
                  control={
                    <Toggle
                      checked={prefs.emailNotifications}
                      onChange={(v) => setPrefs((p) => ({ ...p, emailNotifications: v }))}
                    />
                  }
                />
                <PreferenceRow
                  label="Desktop Notifications"
                  description="Show browser push notifications"
                  control={
                    <Toggle
                      checked={prefs.desktopNotifications}
                      onChange={(v) => setPrefs((p) => ({ ...p, desktopNotifications: v }))}
                    />
                  }
                />
                <PreferenceRow
                  label="Default Registry Sort"
                  description="Default sort order for the Patient Registry"
                  control={
                    <select
                      value={prefs.defaultSortOrder}
                      onChange={(e) => setPrefs((p) => ({ ...p, defaultSortOrder: e.target.value as UserPreferences['defaultSortOrder'] }))}
                      className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="hcc-desc">HCC Score ↓</option>
                      <option value="name-asc">Name A–Z</option>
                      <option value="dob-asc">Date of Birth</option>
                    </select>
                  }
                />
                <PreferenceRow
                  label="Items Per Page"
                  description="Number of rows shown per page in Registry"
                  control={
                    <select
                      value={prefs.itemsPerPage}
                      onChange={(e) => setPrefs((p) => ({ ...p, itemsPerPage: Number(e.target.value) as UserPreferences['itemsPerPage'] }))}
                      className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  }
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={savePreferences}
                  className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">About Bacancy HealthStream</h2>
              <dl className="space-y-4">
                <AboutRow label="App Version" value="v1.0.0" />
                <AboutRow label="Build" value="2026.05.28" />
                <AboutRow label="Last Synced" value="2m ago" />
                <AboutRow label="Region" value="Region 4 Clinical Hub" />
                <AboutRow label="Support Email" value="support@bacancyhealth.org" />
                <AboutRow label="License" value="Enterprise — Bacancy Technology" />
              </dl>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}

function PreferenceRow({ label, description, control }: { label: string; description: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      {control}
    </div>
  )
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-gray-50 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-semibold text-gray-800">{value}</dd>
    </div>
  )
}
