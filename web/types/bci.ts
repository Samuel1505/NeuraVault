export type BCIType = 'EEG' | 'fMRI' | 'ECoG' | 'MEG' | 'EMG' | 'fNIRS';
export type BCIStatus = 'available' | 'restricted' | 'pending' | 'sold';

export interface BCIRequirements {
  minEthBalance: string;
  institutionRequired: boolean;
  purposeRequired: string;
  walletVerification: boolean;
}

export interface BCIRecord {
  id: string;
  title: string;
  type: BCIType;
  description: string;
  longDescription: string;
  dataPoints: number;
  duration: string;
  samplingRate: string;
  channels: number;
  price: string;
  priceUSD: string;
  owner: string;
  ownerName: string;
  requirements: BCIRequirements;
  tags: string[];
  ipfsHash: string;
  metaIpfsHash?: string;
  uploadedAt: string;
  verified: boolean;
  downloads: number;
  status: BCIStatus;
  /** Max number of unique purchases allowed (undefined = unlimited) */
  maxPurchases?: number;
  /** Current number of purchases made */
  purchaseCount: number;
}

export interface BCIUploadForm {
  file: File | null;
  title: string;
  description: string;
  type: BCIType | '';
  channels: string;
  samplingRate: string;
  duration: string;
  price: string;
  tags: string;
  ownerName: string;
  maxPurchases: string;
  requirements: BCIRequirements;
}

export interface PurchaseRecord {
  recordId: string;
  title: string;
  type: BCIType;
  price: string;
  ipfsHash: string;
  metaIpfsHash?: string;
  ownerName: string;
  purchasedAt: string;
  txHash: string;
}
