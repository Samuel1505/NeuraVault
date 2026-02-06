import crypto from 'crypto';

export class EncryptionService {
    private algorithm = 'aes-256-gcm';
    private key: Buffer;

    constructor(keyHex: string) {
        this.key = Buffer.from(keyHex, 'hex');
    }

    /**
     * Encrypt data using AES-256-GCM
     * @param data Buffer to encrypt
     * @returns Object containing encrypted data, IV, and auth tag
     */
    encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
        const iv = crypto.randomBytes(12); // 96-bit IV for GCM
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return { encrypted, iv, authTag };
    }

    /**
     * Decrypt data using AES-256-GCM
     * @param encrypted Encrypted buffer
     * @param iv Initialization vector
     * @param authTag Authentication tag
     * @returns Decrypted buffer
     */
    decrypt(encrypted: Buffer, iv: Buffer, authTag: Buffer): Buffer {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);

        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }

    /**
     * Encrypt and encode to base64 for easy storage
     * @param data Buffer to encrypt
     * @returns Base64 encoded string with IV and auth tag
     */
    encryptToString(data: Buffer): string {
        const { encrypted, iv, authTag } = this.encrypt(data);

        // Combine: IV (12 bytes) + authTag (16 bytes) + encrypted data
        const combined = Buffer.concat([iv, authTag, encrypted]);
        return combined.toString('base64');
    }

    /**
     * Decrypt from base64 encoded string
     * @param encryptedString Base64 encoded encrypted data
     * @returns Decrypted buffer
     */
    decryptFromString(encryptedString: string): Buffer {
        const combined = Buffer.from(encryptedString, 'base64');

        // Extract: IV (12 bytes) + authTag (16 bytes) + encrypted data
        const iv = combined.subarray(0, 12);
        const authTag = combined.subarray(12, 28);
        const encrypted = combined.subarray(28);

        return this.decrypt(encrypted, iv, authTag);
    }

    /**
     * Generate a new encryption key
     * @returns 64-character hex string (32 bytes)
     */
    static generateKey(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Derive key from password using PBKDF2
     * @param password User password
     * @param salt Salt (should be stored with encrypted data)
     * @returns Derived key as hex string
     */
    static deriveKeyFromPassword(password: string, salt: Buffer): string {
        return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
    }

    /**
     * Generate a random salt
     * @returns Salt buffer
     */
    static generateSalt(): Buffer {
        return crypto.randomBytes(16);
    }
}
