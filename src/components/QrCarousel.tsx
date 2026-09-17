import { QRCodeSVG } from 'qrcode.react'
import { ChevronLeft, ChevronRight, Check, Plus, Smartphone } from 'lucide-react'
import { formatInr, type PaymentChunk } from '../lib/upi'

interface QrCarouselProps {
  chunks: PaymentChunk[]
  currentIndex: number
  doneIndices: Set<number>
  onNavigate: (index: number) => void
  onToggleDone: (index: number) => void
  onReset: () => void
}

export function QrCarousel({ chunks, currentIndex, doneIndices, onNavigate, onToggleDone, onReset }: QrCarouselProps) {
  const chunk = chunks[currentIndex]
  const isDone = doneIndices.has(currentIndex)
  const totalPaid = chunks.reduce((sum, c, i) => sum + (doneIndices.has(i) ? c.amount : 0), 0)
  const total = chunks.reduce((sum, c) => sum + c.amount, 0)
  const allDone = doneIndices.size === chunks.length

  function goPrev() {
    onNavigate((currentIndex - 1 + chunks.length) % chunks.length)
  }

  function goNext() {
    onNavigate((currentIndex + 1) % chunks.length)
  }

  return (
    <div className="flex w-full max-w-md animate-fade-slide-in flex-col items-center">
      <div className="mb-5 flex items-center gap-4">
        {chunks.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous QR code"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative flex w-72 flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          {isDone && (
            <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
          )}

          {chunks.length > 1 && (
            <span className="mb-3 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
              Payment {currentIndex + 1} of {chunks.length}
            </span>
          )}

          <div className={`rounded-2xl bg-white p-4 transition ${isDone ? 'opacity-40' : ''}`}>
            <QRCodeSVG value={chunk.uri} size={192} />
          </div>

          <p className="mt-4 text-2xl font-bold text-white">{formatInr(chunk.amount)}</p>

          <a
            href={chunk.uri}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.99]"
          >
            <Smartphone className="h-4 w-4" />
            Pay in UPI app
          </a>

          <button
            type="button"
            onClick={() => onToggleDone(currentIndex)}
            className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${
              isDone
                ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Check className="h-4 w-4" />
            {isDone ? 'Marked as paid' : 'Mark as paid'}
          </button>
        </div>

        {chunks.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next QR code"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {chunks.length > 1 && (
        <div className="mb-5 flex gap-2">
          {chunks.map((c, i) => (
            <button
              key={c.index}
              type="button"
              onClick={() => onNavigate(i)}
              aria-label={`Go to payment ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-indigo-400' : 'w-2 bg-white/20 hover:bg-white/40'
              } ${doneIndices.has(i) ? 'bg-emerald-400' : ''}`}
            />
          ))}
        </div>
      )}

      <div className="mb-5 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm text-white/60">
        {allDone ? (
          <span className="font-medium text-emerald-300">All {chunks.length > 1 ? 'payments' : 'payment'} complete 🎉</span>
        ) : (
          <>
            <span className="font-medium text-white">{formatInr(totalPaid)}</span> of {formatInr(total)} paid
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
          allDone
            ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110'
            : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Plus className="h-4 w-4" />
        Generate New QR
      </button>
    </div>
  )
}
