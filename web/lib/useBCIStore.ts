"use client";

import { useState, useEffect, useCallback } from 'react';
import { MOCK_BCI_RECORDS } from './mockData';
import type { BCIRecord, PurchaseRecord } from '@/types/bci';
import {
  getUploadedRecords,
  getPurchaseCounts,
  getMyPurchases,
  incrementPurchaseCount,
  addMyPurchase,
  hasPurchased,
  fakeTxHash,
} from './store';

/** ETH → USD rough conversion rate used across the app */
export const ETH_USD_RATE = 3500;

function buildRecords(): BCIRecord[] {
  const uploaded = getUploadedRecords();
  const counts = getPurchaseCounts();

  const all = [...uploaded, ...MOCK_BCI_RECORDS];

  return all.map((r) => {
    const realCount = counts[r.id] ?? r.purchaseCount ?? 0;
    const isSold =
      typeof r.maxPurchases === 'number' && realCount >= r.maxPurchases;
    return {
      ...r,
      purchaseCount: realCount,
      status: isSold ? 'sold' : r.status === 'sold' ? 'available' : r.status,
    } satisfies BCIRecord;
  });
}

export function useBCIStore() {
  const [records, setRecords] = useState<BCIRecord[]>(() => MOCK_BCI_RECORDS);
  const [myPurchases, setMyPurchases] = useState<PurchaseRecord[]>([]);

  const refresh = useCallback(() => {
    setRecords(buildRecords());
    setMyPurchases(getMyPurchases());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('nv_store_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nv_store_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  /** Simulate a blockchain purchase, persist state, return the PurchaseRecord */
  const purchase = useCallback(
    async (record: BCIRecord): Promise<PurchaseRecord> => {
      // Simulate tx delay
      await new Promise((res) => setTimeout(res, 2200));

      const purchaseRecord: PurchaseRecord = {
        recordId: record.id,
        title: record.title,
        type: record.type,
        price: record.price,
        ipfsHash: record.ipfsHash,
        metaIpfsHash: record.metaIpfsHash,
        ownerName: record.ownerName,
        purchasedAt: new Date().toISOString(),
        txHash: fakeTxHash(),
      };

      incrementPurchaseCount(record.id);
      addMyPurchase(purchaseRecord);
      refresh();

      return purchaseRecord;
    },
    [refresh]
  );

  const isPurchased = useCallback((recordId: string) => hasPurchased(recordId), []);

  return { records, myPurchases, purchase, isPurchased, refresh };
}
