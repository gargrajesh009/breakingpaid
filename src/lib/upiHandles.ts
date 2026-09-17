/** Known NPCI-registered UPI handle suffixes, mapped to the PSP/bank they belong to.
 * This is a heuristic sanity check, not authoritative verification — there is no free
 * public API that confirms a VPA is real and active. An unrecognized handle just means
 * "double-check this," not "this is invalid." List isn't exhaustive. */
export const KNOWN_UPI_HANDLES: Record<string, string> = {
  okhdfcbank: 'Google Pay (HDFC)',
  okicici: 'Google Pay (ICICI)',
  oksbi: 'Google Pay (SBI)',
  okaxis: 'Google Pay (Axis)',
  okyesbank: 'Google Pay (Yes Bank)',
  ybl: 'PhonePe (Yes Bank)',
  ibl: 'PhonePe (IndusInd)',
  axl: 'PhonePe (Axis)',
  jio: 'PhonePe/JioPay',
  paytm: 'Paytm',
  pty: 'Paytm',
  pthdfc: 'Paytm (HDFC)',
  apl: 'Amazon Pay (ICICI)',
  yapl: 'Amazon Pay (Yes Bank)',
  upi: 'BHIM',
  sbi: 'State Bank of India',
  hdfcbank: 'HDFC Bank',
  icici: 'ICICI Bank',
  axisbank: 'Axis Bank',
  kotak: 'Kotak Mahindra Bank',
  kmb: 'Kotak Mahindra Bank',
  kmbl: 'Kotak Mahindra Bank',
  idbi: 'IDBI Bank',
  indus: 'IndusInd Bank',
  indusind: 'IndusInd Bank',
  federal: 'Federal Bank',
  fbl: 'Federal Bank',
  cnrb: 'Canara Bank',
  unionbank: 'Union Bank of India',
  unionbankofindia: 'Union Bank of India',
  pnb: 'Punjab National Bank',
  boi: 'Bank of India',
  barodampay: 'Bank of Baroda',
  bandhan: 'Bandhan Bank',
  rbl: 'RBL Bank',
  yesbank: 'Yes Bank',
  citi: 'Citibank',
  citibank: 'Citibank',
  hsbc: 'HSBC',
  sc: 'Standard Chartered',
  dbs: 'DBS Bank',
  idfcbank: 'IDFC First Bank',
  jiopay: 'JioPay',
  freecharge: 'Freecharge',
  airtel: 'Airtel Payments Bank',
  cub: 'City Union Bank',
  sib: 'South Indian Bank',
  psb: 'Punjab & Sind Bank',
  dcb: 'DCB Bank',
  equitas: 'Equitas Small Finance Bank',
  ujjivan: 'Ujjivan Small Finance Bank',
}

export function getHandleInfo(upiId: string): { handle: string; known: boolean; provider?: string } {
  const handle = upiId.split('@')[1]?.toLowerCase() ?? ''
  const provider = KNOWN_UPI_HANDLES[handle]
  return { handle, known: Boolean(provider), provider }
}
