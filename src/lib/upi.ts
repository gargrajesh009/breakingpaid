const MAX_CHUNK_PAISE = 1999_00

export interface PaymentChunk {
  index: number
  amount: number
  uri: string
}

/** Splits a rupee amount into chunks of at most ₹1999, since many UPI apps cap
 * single transactions at ₹2000. Works in paise to avoid float rounding drift. */
export function splitAmount(totalRupees: number): number[] {
  let remainingPaise = Math.round(totalRupees * 100)
  if (remainingPaise <= 0) return []

  const chunksPaise: number[] = []
  while (remainingPaise > MAX_CHUNK_PAISE) {
    chunksPaise.push(MAX_CHUNK_PAISE)
    remainingPaise -= MAX_CHUNK_PAISE
  }
  chunksPaise.push(remainingPaise)

  return chunksPaise.map((paise) => paise / 100)
}

export function buildUpiUri(upiId: string, payeeName: string, amount: number, note: string): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || upiId,
    am: amount.toFixed(2),
    cu: 'INR',
  })
  if (note) params.set('tn', note)
  return `upi://pay?${params.toString()}`
}

export function buildPaymentChunks(upiId: string, payeeName: string, totalRupees: number): PaymentChunk[] {
  const amounts = splitAmount(totalRupees)
  const multi = amounts.length > 1
  return amounts.map((amount, i) => ({
    index: i,
    amount,
    uri: buildUpiUri(upiId, payeeName, amount, multi ? `Payment ${i + 1} of ${amounts.length}` : ''),
  }))
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
