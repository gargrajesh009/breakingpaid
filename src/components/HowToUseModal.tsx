import { Bookmark, IndianRupee, QrCode, ShieldCheck, X } from 'lucide-react'
import { useEffect } from 'react'

interface HowToUseModalProps {
  open: boolean
  onClose: () => void
}

const steps = [
  {
    icon: IndianRupee,
    title: 'Step 1 · Enter the amount',
    body: "Type in the total you want to pay. If it's ₹2000 or more, a preview right below the field tells you exactly how many QR codes it'll be split into (each capped at ₹1999).",
  },
  {
    icon: ShieldCheck,
    title: 'Step 2 · Enter the UPI ID',
    body: "We check that the handle after the @ (like okhdfcbank or ybl) matches a known bank or app, as a quick sanity check. This isn't real verification — a UPI ID can only truly be confirmed valid by your bank's app when you actually scan and pay.",
  },
  {
    icon: Bookmark,
    title: 'Step 3 · Save UPI IDs (optional)',
    body: "Give a UPI ID a nickname and save it so you don't have to retype it next time. Saved IDs stay only in your browser's local storage, until you clear your cache — we never save or send any of your info anywhere.",
  },
  {
    icon: QrCode,
    title: 'Step 4 · Generate & pay',
    body: 'Hit Generate QR. If the payment was split, use the arrow buttons or dots to move between QR codes and scan each with your UPI app. Mark each one as paid to track progress with a green check.',
  },
]

export function HowToUseModal({ open, onClose }: HowToUseModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl animate-fade-slide-in rounded-3xl border border-white/10 bg-[#12141f] p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">How to use Breaking Paid</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                <Icon className="h-4.5 w-4.5 text-white" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.99]"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
