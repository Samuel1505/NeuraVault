export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

const PINATA_API_URL = 'https://api.pinata.cloud';

function getAuthHeaders(): HeadersInit {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) {
    throw new Error('NEXT_PUBLIC_PINATA_JWT is not set. Please add it to your .env.local');
  }
  return {
    Authorization: `Bearer ${jwt}`,
  };
}

/**
 * Upload a File object to Pinata IPFS
 */
export async function uploadFileToPinata(
  file: File,
  metadata: Record<string, string> = {}
): Promise<PinataResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: file.name,
    keyvalues: metadata,
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 1 });
  formData.append('pinataOptions', pinataOptions);

  const res = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata upload failed: ${err}`);
  }

  return res.json() as Promise<PinataResponse>;
}

/**
 * Upload a JSON object to Pinata IPFS
 */
export async function uploadJSONToPinata(
  data: object,
  name: string
): Promise<PinataResponse> {
  const res = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pinataMetadata: { name },
      pinataContent: data,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata JSON upload failed: ${err}`);
  }

  return res.json() as Promise<PinataResponse>;
}

/**
 * Get a public gateway URL for an IPFS hash
 */
export function getPinataGatewayUrl(ipfsHash: string): string {
  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? 'https://gateway.pinata.cloud';
  return `${gateway}/ipfs/${ipfsHash}`;
}
