export interface UpiContact {
  upiId: string
  nickname: string
}

const STORAGE_KEY = 'splitpay:contacts'

export function getContacts(): UpiContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(contacts: UpiContact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

export function saveContact(upiId: string, nickname: string): UpiContact[] {
  const contacts = getContacts().filter((c) => c.upiId.toLowerCase() !== upiId.toLowerCase())
  contacts.unshift({ upiId, nickname: nickname.trim() || upiId })
  persist(contacts)
  return contacts
}

export function deleteContact(upiId: string): UpiContact[] {
  const contacts = getContacts().filter((c) => c.upiId.toLowerCase() !== upiId.toLowerCase())
  persist(contacts)
  return contacts
}

export function findContact(upiId: string): UpiContact | undefined {
  return getContacts().find((c) => c.upiId.toLowerCase() === upiId.toLowerCase())
}
