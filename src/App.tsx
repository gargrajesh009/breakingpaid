import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { HowToUseModal } from './components/HowToUseModal'
import { InstallAppButton } from './components/InstallAppButton'
import { PaymentForm } from './components/PaymentForm'
import { QrCarousel } from './components/QrCarousel'
import { buildPaymentChunks, type PaymentChunk } from './lib/upi'

function App() {
  const [chunks, setChunks] = useState<PaymentChunk[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [doneIndices, setDoneIndices] = useState<Set<number>>(new Set())
  const [showHowTo, setShowHowTo] = useState(false)

  function handleGenerate(amount: number, upiId: string) {
    setChunks(buildPaymentChunks(upiId, upiId, amount))
    setCurrentIndex(0)
    setDoneIndices(new Set())
  }

  function handleToggleDone(index: number) {
    setDoneIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleReset() {
    setChunks([])
    setCurrentIndex(0)
    setDoneIndices(new Set())
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <InstallAppButton />

      <button
        type="button"
        onClick={() => setShowHowTo(true)}
        className="fixed right-4 top-4 z-40 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 active:scale-95 sm:right-6 sm:top-6"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        How to use
      </button>

      {chunks.length === 0 ? (
        <PaymentForm onGenerate={handleGenerate} />
      ) : (
        <QrCarousel
          chunks={chunks}
          currentIndex={currentIndex}
          doneIndices={doneIndices}
          onNavigate={setCurrentIndex}
          onToggleDone={handleToggleDone}
          onReset={handleReset}
        />
      )}

      <HowToUseModal open={showHowTo} onClose={() => setShowHowTo(false)} />
    </main>
  )
}

export default App
