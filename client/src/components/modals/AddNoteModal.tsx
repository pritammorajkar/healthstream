import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Bold, Italic, List } from 'lucide-react'
import toast from 'react-hot-toast'
import type { PatientNote } from '@healthstream/shared'
import { useAppState } from '../../context/AppStateContext'

const NOTE_TYPES = [
  'Clinical Observation',
  'Administrative',
  'Follow-up Required',
  'Care Plan Update',
] as const

type NoteType = (typeof NOTE_TYPES)[number]

const MAX_CHARS = 500

interface AddNoteModalProps {
  patientId: string
  patientName: string
  onClose: () => void
}

function wrapSelection(textarea: HTMLTextAreaElement, prefix: string, suffix: string) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = textarea.value.slice(0, start)
  const selected = textarea.value.slice(start, end)
  const after = textarea.value.slice(end)
  const newValue = `${before}${prefix}${selected || 'text'}${suffix}${after}`
  return { newValue, newStart: start + prefix.length, newEnd: end + prefix.length + (selected ? 0 : 4) }
}

export function AddNoteModal({ patientId, patientName, onClose }: AddNoteModalProps) {
  const { addNote, addCareStreamEvent } = useAppState()
  const [noteType, setNoteType] = useState<NoteType>('Clinical Observation')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_CHARS - text.length

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const applyFormat = useCallback(
    (type: 'bold' | 'italic' | 'bullet') => {
      const ta = textareaRef.current
      if (!ta) return
      let newValue: string
      let newStart: number
      let newEnd: number

      if (type === 'bold') {
        const res = wrapSelection(ta, '**', '**')
        newValue = res.newValue
        newStart = res.newStart
        newEnd = res.newEnd
      } else if (type === 'italic') {
        const res = wrapSelection(ta, '_', '_')
        newValue = res.newValue
        newStart = res.newStart
        newEnd = res.newEnd
      } else {
        const start = ta.selectionStart
        const before = ta.value.slice(0, start)
        const after = ta.value.slice(start)
        const needsNewline = before.length > 0 && !before.endsWith('\n')
        newValue = `${before}${needsNewline ? '\n' : ''}• ${after}`
        newStart = start + (needsNewline ? 3 : 2)
        newEnd = newStart
      }

      if (newValue.length > MAX_CHARS) return
      setText(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(newStart, newEnd)
      })
    },
    []
  )

  function handleSave() {
    if (!text.trim()) return
    setSaving(true)

    setTimeout(() => {
      const note: PatientNote = {
        id: `note-${Date.now()}`,
        patientId,
        text: text.trim(),
        author: 'Dr. Sarah Chen',
        createdAt: new Date().toISOString(),
      }
      addNote(patientId, note)
      addCareStreamEvent({
        id: `evt-${Date.now()}`,
        type: 'info',
        title: `Note Added — ${noteType}`,
        description: `${patientName}: ${text.trim().slice(0, 60)}${text.length > 60 ? '…' : ''}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        patientId,
      })
      toast.success(`Note added for ${patientName}`)
      setSaving(false)
      onClose()
    }, 300)
  }

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
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Add Clinical Note</h2>
            <p className="text-xs text-gray-400 mt-0.5">{patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Note type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Note Type</label>
            <div className="grid grid-cols-2 gap-2">
              {NOTE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setNoteType(t)}
                  className={`rounded-lg border py-2 px-3 text-xs font-semibold text-left transition-colors ${
                    noteType === t
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Rich text area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-500">Note Content</label>
              <span className={`text-[11px] font-medium ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {remaining} chars remaining
              </span>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-3 py-1.5">
              {[
                { type: 'bold' as const, Icon: Bold, title: 'Bold (**text**)' },
                { type: 'italic' as const, Icon: Italic, title: 'Italic (_text_)' },
                { type: 'bullet' as const, Icon: List, title: 'Bullet point' },
              ].map(({ type, Icon, title }) => (
                <button
                  key={type}
                  type="button"
                  title={title}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    applyFormat(type)
                  }}
                  className="rounded p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ))}
              <span className="ml-1 h-4 w-px bg-gray-200" />
              <span className="ml-2 text-[10px] text-gray-400">**bold** · _italic_ · bullet</span>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setText(e.target.value)
              }}
              placeholder="Enter clinical note here…"
              rows={6}
              className="w-full rounded-b-lg border border-gray-200 py-3 px-3 text-sm leading-relaxed resize-none focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 font-mono"
            />
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
            onClick={handleSave}
            disabled={!text.trim() || saving}
            className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
