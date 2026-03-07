export type BCIType = 'EEG' | 'fMRI' | 'ECoG' | 'MEG' | 'EMG' | 'fNIRS';
export type BCIStatus = 'available' | 'restricted' | 'pending';

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
  uploadedAt: string;
  verified: boolean;
  downloads: number;
  status: BCIStatus;
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
  requirements: BCIRequirements;
}
