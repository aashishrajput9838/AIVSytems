import { useState } from 'react'

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  description = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-5"
      >
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="mt-5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (isSubmitting) return
              setIsSubmitting(true)
              try {
                await onConfirm?.()
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="px-3 py-2 rounded-md bg-black text-white hover:bg-amber-600 hover:text-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}



