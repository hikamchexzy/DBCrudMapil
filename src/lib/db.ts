import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

let ssl: { ca?: string; rejectUnauthorized: boolean } | undefined;

if (process.env.DB_SSL === 'true') {
  let ca: string | undefined;

  if (process.env.DB_SSL_CA_BASE64) {
    ca = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8');
  } else if (process.env.DB_SSL_CA) {
    const caPath = path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
      process.env.DB_SSL_CA,
    );
    ca = fs.readFileSync(caPath, 'utf8');
  }

  ssl = { ca, rejectUnauthorized: true };
}

const globalForPool = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export const pool =
  globalForPool.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPool.mysqlPool = pool;
}
