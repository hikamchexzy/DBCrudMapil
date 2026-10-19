'use server';

import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// CREATE
export async function tambahBarang(formData: FormData) {
  const nama = formData.get('nama') as string;
  const harga = parseFloat(formData.get('harga') as string);

  if (!nama || isNaN(harga)) {
    return { status: false, message: 'Nama dan harga wajib diisi dengan benar.' };
  }

  try {
    await pool.execute('INSERT INTO barang (nama, harga) VALUES (?, ?)', [nama, harga]);
    revalidatePath('/'); // Segarkan data di halaman utama
    return { status: true, message: 'Barang berhasil ditambahkan.' };
  } catch (error) {
    return { status: false, message: 'Gagal menambahkan barang.' };
  }
}

// READ (bisa juga dilakukan langsung di Server Component)
export async function getDaftarBarang() {
  const [rows] = await pool.query('SELECT * FROM barang ORDER BY created_at DESC');
  return rows as any[];
}

// UPDATE
export async function updateBarang(id: number, formData: FormData) {
  const nama = formData.get('nama') as string;
  const harga = parseFloat(formData.get('harga') as string);

  try {
    await pool.execute('UPDATE barang SET nama = ?, harga = ? WHERE id = ?', [nama, harga, id]);
    revalidatePath('/');
    return { status: true, message: 'Barang berhasil diperbarui.' };
  } catch (error) {
    return { status: false, message: 'Gagal memperbarui barang.' };
  }
}

// DELETE
export async function hapusBarang(id: number) {
  try {
    await pool.execute('DELETE FROM barang WHERE id = ?', [id]);
    revalidatePath('/');
    return { status: true, message: 'Barang berhasil dihapus.' };
  } catch (error) {
    return { status: false, message: 'Gagal menghapus barang.' };
  }
}

