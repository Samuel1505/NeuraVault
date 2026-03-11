import type { BCIRecord, PurchaseRecord } from '@/types/bci';

const UPLOADED_KEY = 'nv_uploaded_records';
const PURCHASE_COUNTS_KEY = 'nv_purchase_counts';
const MY_PURCHASES_KEY = 'nv_my_purchases';

/* ── Uploaded Records (owner uploads) ─────────────────────── */

export function getUploadedRecords(): BCIRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(UPLOADED_KEY);
    return data ? (JSON.parse(data) as BCIRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveUploadedRecord(record: BCIRecord): void {
  const existing = getUploadedRecords();
  // Avoid duplicates by id
  const filtered = existing.filter((r) => r.id !== record.id);
  localStorage.setItem(UPLOADED_KEY, JSON.stringify([record, ...filtered]));
  // Emit storage event so other tabs / components can react
  window.dispatchEvent(new Event('nv_store_updated'));
}

/* ── Purchase Counts (for all records, mock + uploaded) ────── */

export function getPurchaseCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(PURCHASE_COUNTS_KEY);
    return data ? (JSON.parse(data) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function incrementPurchaseCount(recordId: string): number {
  const counts = getPurchaseCounts();
  const next = (counts[recordId] ?? 0) + 1;
  counts[recordId] = next;
  localStorage.setItem(PURCHASE_COUNTS_KEY, JSON.stringify(counts));
  window.dispatchEvent(new Event('nv_store_updated'));
  return next;
}

/* ── My Purchases (researcher session) ────────────────────── */

export function getMyPurchases(): PurchaseRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MY_PURCHASES_KEY);
    return data ? (JSON.parse(data) as PurchaseRecord[]) : [];
  } catch {
    return [];
  }
}

export function addMyPurchase(purchase: PurchaseRecord): void {
  const existing = getMyPurchases();
  // Prevent duplicate entries for the same record
  const filtered = existing.filter((p) => p.recordId !== purchase.recordId);
  localStorage.setItem(MY_PURCHASES_KEY, JSON.stringify([purchase, ...filtered]));
  window.dispatchEvent(new Event('nv_store_updated'));
}

export function hasPurchased(recordId: string): boolean {
  return getMyPurchases().some((p) => p.recordId === recordId);
}

/** Generate a fake-looking tx hash for simulated purchases */
export function fakeTxHash(): string {
  const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  return `0x${Array.from({ length: 16 }, hex).join('')}`;
}
