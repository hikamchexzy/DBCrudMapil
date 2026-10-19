'use client';

import { useState } from 'react';
import { hapusBarang, updateBarang } from '@/app/actions';
import { Barang } from '@/types/barang';
import { Pencil, Trash2, Check, X, CalendarDays } from 'lucide-react';

export default function ItemBarang({ barang }: { barang: Barang }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNama, setEditNama] = useState(barang.nama);
  const [editHarga, setEditHarga] = useState(barang.harga.toString());

  // Format tanggal
  const tanggal = new Date(barang.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  async function handleHapus() {
    if (confirm(`Yakin ingin menghapus "${barang.nama}"?`)) {
      const result = await hapusBarang(barang.id);
      if (!result.status) alert(result.message);
    }
  }

  async function handleSimpanEdit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama', editNama);
    formData.append('harga', editHarga);

    const result = await updateBarang(barang.id, formData);
    if (result.status) {
      setIsEditing(false);
    } else {
      alert(result.message);
    }
  }

  function handleBatal() {
    setIsEditing(false);
    setEditNama(barang.nama);
    setEditHarga(barang.harga.toString());
  }

  // TAMPILAN SAAT MODE EDIT
  if (isEditing) {
    return (
      <tr className="bg-blue-50/50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="text"
            value={editNama}
            onChange={(e) => setEditNama(e.target.value)}
            className="w-full border border-blue-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            step="0.01"
            value={editHarga}
            onChange={(e) => setEditHarga(e.target.value)}
            className="w-full border border-blue-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </td>
        <td className="px-6 py-4 text-slate-500 text-sm">
          {tanggal}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSimpanEdit}
              className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
              title="Simpan"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleBatal}
              className="p-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg transition-colors"
              title="Batal"
            >
              <X size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // TAMPILAN NORMAL
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-medium text-slate-800">{barang.nama}</span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Rp {barang.harga.toLocaleString('id-ID')}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays size={14} />
          {tanggal}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Barang"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleHapus}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Barang"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}