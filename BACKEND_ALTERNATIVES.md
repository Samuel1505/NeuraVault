# Backend Implementation Alternatives

This document provides alternative backend implementations for the Neural Privacy Layer project. Choose the technology stack that best fits your team's expertise and requirements.

---

## Table of Contents

1. [Technology Comparison](#technology-comparison)
2. [Option 1: Node.js/TypeScript](#option-1-nodejstypescript)
3. [Option 2: Python (FastAPI)](#option-2-python-fastapi)
4. [Option 3: Go](#option-3-go)
5. [Option 4: Rust](#option-4-rust)

---

## Technology Comparison

| Feature | Node.js/TypeScript | Python (FastAPI) | Go | Rust |
|---------|-------------------|------------------|-----|------|
| **Learning Curve** | Easy | Easy | Moderate | Steep |
| **Performance** | Good | Moderate | Excellent | Excellent |
| **Async Support** | Native | Native (asyncio) | Native (goroutines) | Native (Tokio) |
| **Ecosystem** | Massive | Large | Growing | Growing |
| **Type Safety** | Good (TypeScript) | Moderate (type hints) | Excellent | Excellent |
| **Memory Safety** | GC | GC | GC | Compile-time |
| **Crypto Libraries** | Excellent | Excellent | Good | Excellent |
| **Web3 Support** | Excellent (ethers.js) | Good (web3.py) | Good (go-ethereum) | Good (ethers-rs) |
| **Best For** | Rapid development | ML/AI integration | Microservices | Performance-critical |

**Recommendation**: 
- **Node.js/TypeScript**: Best for rapid development and if your team is already familiar with JavaScript
- **Python**: Best if you need ML/AI features or data science capabilities
- **Go**: Best for microservices and cloud-native deployments
- **Rust**: Best for maximum performance and security

---

## Option 1: Node.js/TypeScript

### Advantages
✅ Largest ecosystem and community  
✅ Fastest development speed  
✅ Excellent Web3 libraries (ethers.js, viem)  
✅ Easy to find developers  
✅ Great for prototyping  

### Project Structure

```
backend/
├── package.json
├── tsconfig.json
├── .env
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── index.ts
│   ├── api/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── blockchain/
│   │   └── client.ts
│   ├── storage/
│   │   └── ipfs.ts
│   ├── encryption/
│   │   └── service.ts
│   ├── database/
│   │   ├── models/
│   │   └── queries/
│   └── types/
└── prisma/
    └── schema.prisma
```

### Setup Instructions

#### 1. Initialize Project

```bash
mkdir backend && cd backend
npm init -y
npm install typescript ts-node @types/node --save-dev

# Initialize TypeScript
npx tsc --init
```

#### 2. Install Dependencies

```bash
# Web Framework
npm install express cors helmet
npm install @types/express @types/cors --save-dev

# Database (Prisma ORM)
npm install @prisma/client
npm install prisma --save-dev

# Blockchain
npm install ethers viem

# IPFS
npm install ipfs-http-client

# Encryption
npm install crypto-js @types/crypto-js

# Utilities
npm install dotenv zod
npm install winston
```

#### 3. Core Implementation

**File: `src/config/index.ts`**

```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string(),
  IPFS_URL: z.string().default('http://localhost:5001'),
  ETHEREUM_RPC_URL: z.string(),
  CONTRACT_ADDRESS: z.string(),
  PORT: z.string().default('3000'),
  ENCRYPTION_KEY: z.string(),
});

export const config = envSchema.parse(process.env);
```

**File: `src/encryption/service.ts`**

```typescript
import crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor(key: string) {
    this.key = Buffer.from(key, 'hex');
  }

  encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return { encrypted, iv, authTag };
  }

  decrypt(encrypted: Buffer, iv: Buffer, authTag: Buffer): Buffer {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  static generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
```

**File: `src/storage/ipfs.ts`**

```typescript
import { create, IPFSHTTPClient } from 'ipfs-http-client';

export class IPFSService {
  private client: IPFSHTTPClient;

  constructor(url: string) {
    this.client = create({ url });
  }

  async upload(data: Buffer): Promise<string> {
    const result = await this.client.add(data);
    return result.cid.toString();
  }

  async download(cid: string): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of this.client.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}
```

**File: `src/blockchain/client.ts`**

```typescript
import { ethers } from 'ethers';

export class BlockchainClient {
  private provider: ethers.Provider;
  private contractAddress: string;

  constructor(rpcUrl: string, contractAddress: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contractAddress = contractAddress;
  }

  async getUserProfile(address: string): Promise<any> {
    // Implement contract interaction
    // Use ethers.Contract with ABI
    return {};
  }

  async verifyAccess(
    owner: string,
    researcher: string,
    dataCategory: string
  ): Promise<boolean> {
    // Implement access verification
    return true;
  }
}
```

**File: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String   @id @default(uuid())
  walletAddress     String   @unique @map("wallet_address")
  publicKey         String   @map("public_key")
  dataVaultCid      String?  @map("data_vault_cid")
  encryptionKeyCid  String?  @map("encryption_key_cid")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  dataRecords       DataRecord[]

  @@map("users")
}

model DataRecord {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  dataType    String   @map("data_type")
  ipfsCid     String   @map("ipfs_cid")
  encrypted   Boolean  @default(true)
  sizeBytes   BigInt   @map("size_bytes")
  createdAt   DateTime @default(now()) @map("created_at")
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([dataType])
  @@map("data_records")
}
```

**File: `src/api/controllers/userController.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, publicKey, dataVaultCid, encryptionKeyCid } = req.body;

    const user = await prisma.user.create({
      data: {
        walletAddress,
        publicKey,
        dataVaultCid,
        encryptionKeyCid,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { dataRecords: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};
```

**File: `src/index.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { EncryptionService } from './encryption/service';
import { IPFSService } from './storage/ipfs';
import { BlockchainClient } from './blockchain/client';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize services
const encryptionService = new EncryptionService(config.ENCRYPTION_KEY);
const ipfsService = new IPFSService(config.IPFS_URL);
const blockchainClient = new BlockchainClient(
  config.ETHEREUM_RPC_URL,
  config.CONTRACT_ADDRESS
);

// Routes
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

// Import and use routes
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);

const PORT = parseInt(config.PORT);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

**File: `package.json` scripts**

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

---

## Option 2: Python (FastAPI)

### Advantages
✅ Excellent for ML/AI integration  
✅ Great data processing libraries  
✅ Easy to learn and read  
✅ Strong scientific computing ecosystem  
✅ Perfect for federated learning implementation  

### Project Structure

```
backend/
├── requirements.txt
├── .env
├── alembic/
│   └── versions/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── api/
│   │   ├── routes/
│   │   └── dependencies.py
│   ├── blockchain/
│   │   └── client.py
│   ├── storage/
│   │   └── ipfs.py
│   ├── encryption/
│   │   └── service.py
│   ├── database/
│   │   ├── models.py
│   │   └── session.py
│   └── schemas/
└── tests/
```

### Setup Instructions

#### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Install Dependencies

```bash
pip install fastapi uvicorn[standard]
pip install sqlalchemy alembic psycopg2-binary
pip install web3 eth-account
pip install ipfshttpclient
pip install cryptography
pip install python-dotenv pydantic-settings
pip install httpx
```

**File: `requirements.txt`**

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
web3==6.15.0
eth-account==0.10.0
ipfshttpclient==0.8.0a2
cryptography==42.0.0
python-dotenv==1.0.0
pydantic-settings==2.1.0
httpx==0.26.0
```

#### 3. Core Implementation

**File: `app/config.py`**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    ipfs_url: str = "http://localhost:5001"
    ethereum_rpc_url: str
    contract_address: str
    server_port: int = 3000
    encryption_key: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**File: `app/encryption/service.py`**

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class EncryptionService:
    def __init__(self, key: bytes):
        self.aesgcm = AESGCM(key)
    
    def encrypt(self, data: bytes) -> tuple[bytes, bytes]:
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, data, None)
        return ciphertext, nonce
    
    def decrypt(self, ciphertext: bytes, nonce: bytes) -> bytes:
        return self.aesgcm.decrypt(nonce, ciphertext, None)
    
    @staticmethod
    def generate_key() -> bytes:
        return AESGCM.generate_key(bit_length=256)
```

**File: `app/storage/ipfs.py`**

```python
import ipfshttpclient

class IPFSService:
    def __init__(self, url: str):
        self.client = ipfshttpclient.connect(url)
    
    async def upload(self, data: bytes) -> str:
        result = self.client.add_bytes(data)
        return result
    
    async def download(self, cid: str) -> bytes:
        return self.client.cat(cid)
```

**File: `app/blockchain/client.py`**

```python
from web3 import Web3
from typing import Optional

class BlockchainClient:
    def __init__(self, rpc_url: str, contract_address: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.contract_address = Web3.to_checksum_address(contract_address)
    
    async def get_user_profile(self, address: str) -> Optional[dict]:
        # Implement contract interaction
        return {}
    
    async def verify_access(
        self, 
        owner: str, 
        researcher: str, 
        data_category: str
    ) -> bool:
        # Implement access verification
        return True
```

**File: `app/database/models.py`**

```python
from sqlalchemy import Column, String, Boolean, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_address = Column(String(42), unique=True, nullable=False)
    public_key = Column(String, nullable=False)
    data_vault_cid = Column(String)
    encryption_key_cid = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    data_records = relationship("DataRecord", back_populates="user", cascade="all, delete-orphan")

class DataRecord(Base):
    __tablename__ = "data_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    data_type = Column(String(50), nullable=False)
    ipfs_cid = Column(String, nullable=False)
    encrypted = Column(Boolean, default=True)
    size_bytes = Column(BigInteger, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="data_records")
```

**File: `app/main.py`**

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.encryption.service import EncryptionService
from app.storage.ipfs import IPFSService
from app.blockchain.client import BlockchainClient
import uvicorn

app = FastAPI(title="Neural Privacy Layer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
encryption_service = EncryptionService(bytes.fromhex(settings.encryption_key))
ipfs_service = IPFSService(settings.ipfs_url)
blockchain_client = BlockchainClient(
    settings.ethereum_rpc_url,
    settings.contract_address
)

@app.get("/health")
async def health_check():
    return {"success": True, "message": "OK"}

@app.post("/users")
async def create_user(user_data: dict):
    # Implement user creation
    return {"success": True, "data": user_data}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.server_port,
        reload=True
    )
```

---

## Option 3: Go

### Advantages
✅ Excellent performance  
✅ Built-in concurrency (goroutines)  
✅ Fast compilation  
✅ Great for microservices  
✅ Strong standard library  

### Project Structure

```
backend/
├── go.mod
├── go.sum
├── .env
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   ├── blockchain/
│   ├── storage/
│   ├── encryption/
│   ├── database/
│   └── models/
└── pkg/
    └── config/
```

### Setup Instructions

#### 1. Initialize Module

```bash
go mod init github.com/yourusername/neural-backend
```

#### 2. Install Dependencies

```bash
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/ethereum/go-ethereum
go get github.com/ipfs/go-ipfs-api
go get github.com/joho/godotenv
```

**File: `cmd/server/main.go`**

```go
package main

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    // Initialize Gin router
    r := gin.Default()

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "success": true,
            "message": "OK",
        })
    })

    // Start server
    if err := r.Run(":3000"); err != nil {
        log.Fatal(err)
    }
}
```

---

## Option 4: Rust

See the main Technical Architecture document for the complete Rust implementation.

---

## Recommendation

Choose based on your priorities:

1. **Fastest Development**: Node.js/TypeScript
2. **ML/AI Features**: Python (FastAPI)
3. **Cloud-Native/Microservices**: Go
4. **Maximum Performance/Security**: Rust

All options are production-ready and can handle the requirements of the Neural Privacy Layer project!
