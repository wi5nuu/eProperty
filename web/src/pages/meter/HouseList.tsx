import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit3, Trash2, MapPin, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

interface House {
  id: number
  house_code: string
  address: string
  rt: string
  rw: string
  block: string
  owner_name: string
  phone: string
  meter_number: string
  status: string
}

export default function HouseList() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterBlock, setFilterBlock] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 100 }
      if (search) params.search = search
      if (filterBlock) params.block = filterBlock
      const { data } = await api.get('/meter/houses', { params })
      setHouses(data.data ?? data)
    } catch {
      toast.error('Gagal memuat data rumah')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search, filterBlock])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    try {
      await api.delete(`/meter/houses/${id}`)
      toast.success('Berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus data')
    }
  }

  const blocks = [...new Set(houses.map(h => h.block).filter(Boolean))].sort()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Rumah</h1>
        <button
          onClick={() => navigate('/meter/houses/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Tambah Rumah
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode rumah, nama, alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterBlock}
          onChange={(e) => setFilterBlock(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Semua Blok</option>
          {blocks.map(b => <option key={b} value={b}>Blok {b}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : houses.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">Tidak ada data rumah</div>
      ) : (
        <div className="grid gap-3">
          {houses.map((house) => (
            <div key={house.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{house.house_code}</span>
                    {house.block && <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">Blok {house.block}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${house.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {house.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{house.owner_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{house.address}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {house.rt && <span>RT {house.rt}</span>}
                    {house.rw && <span>RW {house.rw}</span>}
                    {house.meter_number && <span>No. Meter: {house.meter_number}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => navigate(`/meter/houses/${house.id}/readings`)}
                    className="p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20 transition-all"
                    title="Riwayat Pembacaan"
                  >
                    <Droplets size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/meter/houses/${house.id}/edit`)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(house.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Droplets({ size, ...props }: { size: number } & any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 14.69c1.44 0 2.6-1.16 2.6-2.62 0-.75-.38-1.45-1.14-2.03S12.95 8.4 12.77 7.72c-.16.9-.78 1.81-1.54 2.4s-1.14 1.28-1.14 2.03c0 1.46 1.16 2.62 2.6 2.62z" />
      <path d="M17 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17.29 6.75 17 5.3c-.29 1.45-1.14 2.84-2.29 3.76S13 11.1 13 12.25c0 2.22 1.8 4.05 4 4.05z" />
    </svg>
  )
}
