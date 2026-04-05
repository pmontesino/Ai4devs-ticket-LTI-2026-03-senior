import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function getKey(): Buffer {
  const rawSecret = process.env.AES_SECRET || 'replace_with_32_byte_secret_key';
  return crypto.createHash('sha256').update(rawSecret).digest();
}

export function encryptField(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const parts = value.split(':');
  if (parts.length !== 2) {
    return undefined;
  }

  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}
