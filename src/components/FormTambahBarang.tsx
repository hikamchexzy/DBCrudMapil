'use client';
import { tambahBarang } from '@/app/actions';
import { useRef } from 'react';
import { PlusCircle } from 'lucide-react';

export default function FormTambahBarang() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await tambahBarang(formData);
    if (result.status) {
      formRef.current?.reset();
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Tambah Barang Baru</h3>
      </div>
      
      <form ref={formRef} action={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex flex-col flex-1 w-full">
          <label htmlFor="nama" className="text-sm font-medium text-slate-700 mb-1.5">Nama Barang</label>
          <input 
            type="text" 
            name="nama" 
            id="nama" 
            required 
            className="border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            placeholder="Contoh: Kopi Kapal Api"
          />
        </div>
        <div className="flex flex-col w-full md:w-64">
          <label htmlFor="harga" className="text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
          <input 
            type="number" 
            name="harga" 
            id="harga" 
            step="0.01" 
            required 
            className="border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            placeholder="0"
          />
        </div>
        <button 
          type="submit" 
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all font-medium flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Simpan
        </button>
      </form>
    </div>
  );
}