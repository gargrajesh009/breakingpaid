import { AlertTriangle, Bookmark, ShieldCheck, Trash2, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { deleteContact, findContact, getContacts, saveContact, type UpiContact } from '../lib/contacts'
import { getHandleInfo } from '../lib/upiHandles'
import { Logo } from './Logo'

const UPI_ID_PATTERN = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/

interface PaymentFormProps {
  onGenerate: (amount: number, upiId: string) => void
}

export function PaymentForm({ onGenerate }: PaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState<UpiContact[]>(() => getContacts())
  const [savingNickname, setSavingNickname] = useState<string | null>(null)

  const trimmedUpiId = upiId.trim()
  const isValidFormat = UPI_ID_PATTERN.test(trimmedUpiId)
  const handleInfo = isValidFormat ? getHandleInfo(trimmedUpiId) : null
  const existingContact = isValidFormat ? findContact(trimmedUpiId) : undefined

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const numericAmount = Number(amount)
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter a valid amount greater than ₹0')
      return
    }
    if (!isValidFormat) {
      setError('Enter a valid UPI ID, e.g. name@bank')
      return
    }

    setError('')
    onGenerate(numericAmount, trimmedUpiId)
  }

  function selectContact(contact: UpiContact) {
    setUpiId(contact.upiId)
    setSavingNickname(null)
  }

  function handleDeleteContact(id: string) {
    setContacts(deleteContact(id))
  }

  function handleSaveContact() {
    const nickname = savingNickname?.trim()
    if (!nickname) return
    setContacts(saveContact(trimmedUpiId, nickname))
    setSavingNickname(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md animate-fade-slide-in rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <Logo className="h-11 w-auto drop-shadow-lg" />
        <div>
          <h1 className="text-lg font-semibold text-white">Breaking Paid</h1>
          <p className="text-sm text-white/50">Large payments, made scannable</p>
        </div>
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-medium text-white/70">Amount (₹)</span>
        <input
          type="number"
          inputMode="decimal"
          min="1"
          step="0.01"
          placeholder="3800"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/30 outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400/30"
        />
      </label>

      <label className="mb-2 block">
        <span className="mb-1.5 block text-sm font-medium text-white/70">UPI ID</span>
        <input
          type="text"
          placeholder="name@upi"
          value={upiId}
          onChange={(e) => {
            setUpiId(e.target.value)
            setSavingNickname(null)
          }}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/30 outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400/30"
        />
      </label>

      {isValidFormat && handleInfo && (
        <div className="mb-3 flex items-start gap-1.5 text-xs">
          {handleInfo.known ? (
            <>
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span className="text-emerald-300/80">Recognized handle · {handleInfo.provider}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span className="text-amber-300/80">
                Unrecognized handle "@{handleInfo.handle}" — double-check before paying.
              </span>
            </>
          )}
        </div>
      )}

      {isValidFormat && !existingContact && savingNickname === null && (
        <button
          type="button"
          onClick={() => setSavingNickname('')}
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-indigo-300/80 transition hover:text-indigo-200"
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save as contact
        </button>
      )}

      {isValidFormat && existingContact && (
        <p className="mb-4 flex items-center gap-1.5 text-xs text-white/50">
          <Bookmark className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
          Saved as "{existingContact.nickname}"
        </p>
      )}

      {savingNickname !== null && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            placeholder="Nickname, e.g. Landlord"
            value={savingNickname}
            onChange={(e) => setSavingNickname(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSaveContact()
              }
            }}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400/60"
          />
          <button
            type="button"
            onClick={handleSaveContact}
            className="rounded-lg bg-indigo-500/80 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setSavingNickname(null)}
            aria-label="Cancel"
            className="rounded-lg p-2 text-white/40 transition hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="mb-4">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">
            Saved UPI IDs
          </span>
          <div className="flex flex-wrap gap-2">
            {contacts.map((contact) => (
              <div
                key={contact.upiId}
                className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  contact.upiId.toLowerCase() === trimmedUpiId.toLowerCase()
                    ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-200'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <button type="button" onClick={() => selectContact(contact)} className="font-medium">
                  {contact.nickname}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteContact(contact.upiId)}
                  aria-label={`Remove ${contact.nickname}`}
                  className="text-white/30 opacity-0 transition group-hover:opacity-100 hover:text-rose-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}

      {Number(amount) >= 2000 && !error && (
        <p className="mb-4 text-sm text-indigo-300/80">
          This will be split into {Math.ceil(Number(amount) / 1999)} QR codes of ₹1999 or less.
        </p>
      )}

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 active:scale-[0.99]"
      >
        Generate QR
      </button>
    </form>
  )
}
