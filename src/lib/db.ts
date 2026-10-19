import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let sslConfig: { ca?: string; rejectUnauthorized?: boolean } | undefined;

if (process.env.DB_SSL === 'true') {
  let caCert: string | undefined;

  // 1. Untuk Vercel (Production) - Membaca dari Base64 Env
  if (process.env.DB_SSL_CA_BASE64) {
    caCert = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf-8');
  }
  // 2. Untuk Lokal (Development) - Membaca dari file fisik
  else if (process.env.DB_SSL_CA) {
    // Tambahkan /*turbopackIgnore: true*/ agar Vercel tidak protes
    const caCertPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.DB_SSL_CA);
    if (fs.existsSync(caCertPath)) {
      caCert = fs.readFileSync(caCertPath, 'utf-8');
    }
  }

  if (caCert) {
    sslConfig = {
      ca: caCert,
      rejectUnauthorized: true,
    };
  }
}

const globalForPool = globalThis as unknown as { mysqlPool: mysql.Pool | undefined };

export const pool =
  globalForPool.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPool.mysqlPool = pool;
}