-- Neural Privacy Layer Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  data_vault_cid TEXT,
  encryption_key_cid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

-- Data records table
CREATE TABLE IF NOT EXISTS data_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL,
  ipfs_cid TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT true,
  size_bytes BIGINT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for data_records
CREATE INDEX IF NOT EXISTS idx_data_records_user ON data_records(user_id);
CREATE INDEX IF NOT EXISTS idx_data_records_type ON data_records(data_type);
CREATE INDEX IF NOT EXISTS idx_data_records_cid ON data_records(ipfs_cid);

-- Consent logs table
CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_owner_address VARCHAR(42) NOT NULL,
  researcher_address VARCHAR(42) NOT NULL,
  request_id INTEGER NOT NULL,
  data_type VARCHAR(50) NOT NULL,
  consent_level INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for consent_logs
CREATE INDEX IF NOT EXISTS idx_consent_owner ON consent_logs(data_owner_address);
CREATE INDEX IF NOT EXISTS idx_consent_researcher ON consent_logs(researcher_address);
CREATE INDEX IF NOT EXISTS idx_consent_request ON consent_logs(request_id);

-- Payment agreements table
CREATE TABLE IF NOT EXISTS payment_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id INTEGER UNIQUE NOT NULL,
  data_owner_address VARCHAR(42) NOT NULL,
  researcher_address VARCHAR(42) NOT NULL,
  amount TEXT NOT NULL,
  escrowed BOOLEAN DEFAULT false,
  released BOOLEAN DEFAULT false,
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payment_agreements
CREATE INDEX IF NOT EXISTS idx_payment_owner ON payment_agreements(data_owner_address);
CREATE INDEX IF NOT EXISTS idx_payment_researcher ON payment_agreements(researcher_address);
CREATE INDEX IF NOT EXISTS idx_payment_agreement_id ON payment_agreements(agreement_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for payment_agreements table
CREATE TRIGGER update_payment_agreements_updated_at
  BEFORE UPDATE ON payment_agreements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_agreements ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your authentication strategy)
-- For now, allow service role to access everything
CREATE POLICY "Service role can do everything on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on data_records"
  ON data_records FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on consent_logs"
  ON consent_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on payment_agreements"
  ON payment_agreements FOR ALL
  USING (true)
  WITH CHECK (true);
