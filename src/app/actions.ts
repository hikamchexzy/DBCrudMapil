'use server';

import { pool } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

interface BarangRow extends RowDataPacket {
  id: number;
  nama: string;
  harga: number | string;
  created_at: Date | string;
  updated_at: Date | string;
}

function parseBarangFormData(
  formData: FormData,
): { nama: string; harga: number } | null {
  const namaValue = formData.get('nama');
  const hargaValue = formData.get('harga');

  if (
    typeof namaValue !== 'string' ||
    typeof hargaValue !== 'string' ||
    !namaValue.trim() ||
    !hargaValue.trim()
  ) {
    return null;
  }

  const harga = Number(hargaValue);
  if (!Number.isFinite(harga) || harga < 0) {
    return null;
  }

  return { nama: namaValue.trim(), harga };
}

function toDateString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

// CREATE
export async function tambahBarang(formData: FormData) {
  const barang = parseBarangFormData(formData);
  if (!barang) {
    return { status: false, message: 'Nama dan harga wajib diisi dengan benar.' };
  }

  try {
    await pool.execute('INSERT INTO barang (nama, harga) VALUES (?, ?)', [
      barang.nama,
      barang.harga,
    ]);
  } catch (error) {
    console.error('Gagal menambahkan barang:', error);
    return { status: false, message: 'Gagal menambahkan barang.' };
  }

  revalidatePath('/');
  return { status: true, message: 'Barang berhasil ditambahkan.' };
}

// READ (bisa juga dilakukan langsung di Server Component)
export async function getDaftarBarang() {
  const [rows] = await pool.query<BarangRow[]>(
    'SELECT * FROM barang ORDER BY created_at DESC',
  );

  return rows.map((row) => ({
    id: row.id,
    nama: row.nama,
    harga: Number(row.harga),
    created_at: toDateString(row.created_at),
    updated_at: toDateString(row.updated_at),
  }));
}

// UPDATE
export async function updateBarang(id: number, formData: FormData) {
  const barang = parseBarangFormData(formData);
  if (!barang || !Number.isSafeInteger(id) || id < 1) {
    return { status: false, message: 'Data barang tidak valid.' };
  }

  try {
    await pool.execute(
      'UPDATE barang SET nama = ?, harga = ? WHERE id = ?',
      [barang.nama, barang.harga, id],
    );
  } catch (error) {
    console.error('Gagal memperbarui barang:', error);
    return { status: false, message: 'Gagal memperbarui barang.' };
  }

  revalidatePath('/');
  return { status: true, message: 'Barang berhasil diperbarui.' };
}

// DELETE
export async function hapusBarang(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) {
    return { status: false, message: 'ID barang tidak valid.' };
  }

  try {
    await pool.execute('DELETE FROM barang WHERE id = ?', [id]);
  } catch (error) {
    console.error('Gagal menghapus barang:', error);
    return { status: false, message: 'Gagal menghapus barang.' };
  }

  revalidatePath('/');
  return { status: true, message: 'Barang berhasil dihapus.' };
}
