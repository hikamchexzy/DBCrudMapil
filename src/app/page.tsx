import { connection } from 'next/server'; // 1. Tambahkan import ini
import { getDaftarBarang } from './actions';
import FormTambahBarang from '@/components/FormTambahBarang';
import ItemBarang from '@/components/ItemBarang';
import { Barang } from '@/types/barang';
import { Package, Wallet } from 'lucide-react';

// 2. HAPUS baris: export const dynamic = 'force-dynamic';

export default async function Home() {
  // 3. Tambahkan baris ini untuk memaksa render dinamis
  await connection(); 

  const daftarBarang: Barang[] = await getDaftarBarang();
  const totalNilai = daftarBarang.reduce((sum, item) => sum + Number(item.harga), 0);;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER & STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Barang</p>
              <h2 className="text-2xl font-bold text-slate-800">{daftarBarang.length} Item</h2>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 md:col-span-2">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Estimasi Nilai</p>
              <h2 className="text-2xl font-bold text-slate-800">
                Rp {totalNilai.toLocaleString('id-ID')}
              </h2>
            </div>
          </div>
        </div>

        {/* FORM TAMBAH */}
        <FormTambahBarang />

        {/* TABEL DATA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Daftar Harga Barang</h2>
            <p className="text-sm text-slate-500">Kelola data dan pantau harga barang Anda.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Nama Barang</th>
                  <th className="px-6 py-4 font-semibold">Harga</th>
                  <th className="px-6 py-4 font-semibold">Tanggal Ditambahkan</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarBarang.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Belum ada data barang. Silakan tambahkan barang baru.
                    </td>
                  </tr>
                ) : (
                  daftarBarang.map((barang) => (
                    <ItemBarang key={barang.id} barang={barang} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}