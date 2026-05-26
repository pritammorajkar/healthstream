import { useState } from 'react'
import { Zap } from 'lucide-react'
import type { Patient } from '../../types'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { EmptyState } from '../common/EmptyState'
import { hccColor } from '../../utils/hccColor'
import { PatientActionMenu } from './PatientActionMenu'

interface HighImpactRegistryProps {
  patients: Patient[]
  loading?: boolean
  isSearching?: boolean
  totalCount?: number
}

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export function HighImpactRegistry({
  patients,
  loading = false,
  isSearching = false,
  totalCount = 0,
}: HighImpactRegistryProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-lg font-bold text-gray-900 mr-auto">High-Impact Registry</h2>
        {isSearching ? (
          <Badge
            label={`${patients.length} of ${totalCount} patients`}
            className="bg-blue-50 text-[#1B3F8B]"
          />
        ) : (
          <>
            <Badge label="URGENT REVIEW" className="bg-red-100 text-red-600" />
            <Badge label="8 PENDING" className="bg-gray-100 text-gray-600" />
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['PATIENT', 'HCC SCORE', 'PRIMARY CONCERN', 'ACTIONS'].map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2 first:pl-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    title={isSearching ? 'No patients match your search' : 'No high-impact patients'}
                    description={
                      isSearching
                        ? 'Try a different name or patient ID.'
                        : 'No patients requiring urgent review at this time.'
                    }
                  />
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pl-0 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={patient.initials} />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-gray-400">DOB: {patient.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold ${hccColor(patient.hccScore)}`}
                    >
                      {patient.hccScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{patient.primaryConcern}</td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === patient.id ? null : patient.id)
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-[#2D6A4F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#245a42] transition-colors"
                      >
                        Action <Zap className="h-3.5 w-3.5 fill-white" />
                      </button>
                      {openMenuId === patient.id && (
                        <PatientActionMenu
                          patientName={`${patient.firstName} ${patient.lastName}`}
                          onClose={() => setOpenMenuId(null)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
