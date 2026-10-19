// src/lib/db.ts
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Baca CA certificate untuk SSL Aiven
const caCertPath = path.resolve(process.cwd(), process.env.DB_SSL_CA || './certs/ca.pem');
let sslConfig: { ca?: string; rejectUnauthorized?: boolean } | undefined;

if (process.env.DB_SSL === 'true' && fs.existsSync(caCertPath)) {
  sslConfig = {
    ca: fs.readFileSync(caCertPath, 'utf-8'),
    rejectUnauthorized: true, // Wajib untuk Aiven agar verifikasi SSL berjalan[reference:9]
  };
}

// Singleton pool untuk menghindari kebocoran koneksi di serverless/dev
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
    connectionLimit: 10, // Batasi koneksi untuk menghindari kehabisan slot di Aiven[reference:10]
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPool.mysqlPool = pool;
}