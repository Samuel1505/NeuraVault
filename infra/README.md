# Neural Privacy Layer - Backend API

Node.js/TypeScript backend API for the Neural Privacy Layer BCI Data Sovereignty Protocol.

## Features

- ✅ **Supabase Database**: PostgreSQL database with typed client
- ✅ **Pinata IPFS**: Decentralized storage for BCI data
- ✅ **Blockchain Integration**: Ethers.js integration with deployed contracts
- ✅ **AES-256-GCM Encryption**: Secure data encryption before IPFS upload
- ✅ **Express API**: RESTful API with helmet and cors
- ✅ **Winston Logging**: Structured logging with file and console transports
- ✅ **TypeScript**: Full type safety

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Pinata Account**: Get API keys from [pinata.cloud](https://pinata.cloud)
3. **Ethereum RPC**: Infura, Alchemy, or other provider
4. **Node.js**: v18 or higher

## Setup

### 1. Install Dependencies

```bash
cd infra
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and keys from Settings > API

### 3. Configure Pinata

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys and create a new key
3. Copy the API Key, Secret Key, and JWT

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required variables**:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `PINATA_API_KEY`: Pinata API key
- `PINATA_SECRET_KEY`: Pinata secret key
- `PINATA_JWT`: Pinata JWT token
- `ETHEREUM_RPC_URL`: Ethereum RPC endpoint
- `IDENTITY_REGISTRY_ADDRESS`: Deployed IdentityRegistry contract
- `CONSENT_MANAGER_ADDRESS`: Deployed ConsentManager contract
- `PAYMENT_DISTRIBUTOR_ADDRESS`: Deployed PaymentDistributor contract
- `ENCRYPTION_KEY`: Generate with `openssl rand -hex 32`
- `JWT_SECRET`: Random secret for JWT signing

### 5. Deploy Smart Contracts

Before running the backend, deploy your contracts to testnet:

```bash
cd ..
npx hardhat ignition deploy ignition/modules/NeuralPrivacy.ts --network sepolia
```

Copy the deployed contract addresses to your `.env` file.

## Running the Server

### Development Mode

```bash
npm run dev
```

Server will start on `http://localhost:3000` with hot reload.

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns service status for database, IPFS, and blockchain.

### User Management

**Register User**:
```bash
POST /api/users/register
Content-Type: application/json

{
  "wallet_address": "0x...",
  "public_key": "0x...",
  "data_vault_cid": "Qm...",  // optional
  "encryption_key_cid": "Qm..."  // optional
}
```

**Get User**:
```bash
GET /api/users/:walletAddress
```

### Data Management

**Upload Data**:
```bash
POST /api/data/upload
Content-Type: application/json

{
  "user_id": "uuid",
  "data_type": "EEG",
  "data": "<base64-encoded-data>",
  "encrypt": true
}
```

Returns IPFS CID and database record.

## Project Structure

```
infra/
├── src/
│   ├── index.ts                    # Main Express app
│   ├── config/
│   │   └── index.ts                # Environment config with Zod
│   ├── database/
│   │   └── client.ts               # Supabase client
│   ├── storage/
│   │   └── pinata.service.ts       # Pinata IPFS service
│   ├── encryption/
│   │   └── encryption.service.ts   # AES-256-GCM encryption
│   ├── blockchain/
│   │   └── client.ts               # Ethers.js provider
│   └── utils/
│       └── logger.ts               # Winston logger
├── logs/                           # Log files
├── supabase-schema.sql             # Database schema
├── .env.example                    # Environment template
└── package.json
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Check TypeScript
npm run build
```

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## Security

- All data is encrypted with AES-256-GCM before IPFS upload
- Wallet signature verification (to be implemented)
- Helmet.js for HTTP security headers
- CORS enabled for frontend integration
- Environment variables for sensitive data

## Next Steps

1. Add wallet signature authentication middleware
2. Implement remaining API routes (consent, payments)
3. Add blockchain event listeners
4. Create comprehensive tests
5. Add rate limiting
6. Implement caching layer

## License

MIT
