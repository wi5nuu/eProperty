import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

interface Reading {
  id: number
  reading_date: string
  previous_reading: number
  current_reading: number
  consumption: number
  photo_before: string
  photo_after: string
  reader_name: string
  notes: string
  status: string
  house: { house_code: string; owner_name: string }
}

export default function ReadingHistory() {
  const { houseId } = useParams()
  const navigate = useNavigate()
  const [readings, setReadings] = useState<Reading[]>([])
  const [house, setHouse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [photoModal, setPhotoModal] = useState<{ before: string; after: string } | null>(null)

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const [houseRes, readingsRes] = await Promise.all([
        api.get(`/meter/houses/${houseId}`),
        api.get(`/meter/houses/${houseId}/history`, { params: { page: p, per_page: 10 } }),
      ])
      setHouse(houseRes.data.data ?? houseRes.data)
      setReadings(readingsRes.data.data ?? [])
      setPage(readingsRes.data.current_page || 1)
      setLastPage(readingsRes.data.last_page || 1)
    } catch {
      toast.error('Gagal memuat riwayat')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [houseId])

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    if (s === 'disputed') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/meter/houses')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Riwayat Pembacaan</h1>
          {house && <p className="text-sm text-slate-500 dark:text-slate-400">{house.house_code} - {house.owner_name}</p>}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
      ) : readings.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">Belum ada riwayat pembacaan</div>
      ) : (
        <>
          <div className="space-y-3">
            {readings.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{r.reading_date}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Oleh: {r.reader_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r.status)}`}>{r.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sebelum</p>
                    <p className="font-bold text-slate-900 dark:text-white">{r.previous_reading}</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sesudah</p>
                    <p className="font-bold text-slate-900 dark:text-white">{r.current_reading}</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xs text-blue-600 dark:text-blue-400">Pakai</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{r.consumption} m³</p>
                  </div>
                </div>
                {(r.photo_before || r.photo_after) && (
                  <button
                    onClick={() => setPhotoModal({ before: r.photo_before, after: r.photo_after })}
                    className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Camera size={14} /> Lihat Foto
                  </button>
                )}
                {r.notes && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">{r.notes}</p>}
              </div>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => { setPage(p => p - 1); load(page - 1) }}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">Halaman {page} dari {lastPage}</span>
              <button
                onClick={() => { setPage(p => p + 1); load(page + 1) }}
                disabled={page >= lastPage}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => navigate(`/meter/houses/${houseId}/reading`)}
        className="fixed bottom-6 right-6 sm:static w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full sm:rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-medium"
      >
        <span className="hidden sm:inline">Tambah Pembacaan</span>
        <span className="sm:hidden text-2xl">+</span>
      </button>

      {photoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPhotoModal(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 max-w-lg w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-2 gap-3">
              {photoModal.before && (
                <div>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-1">Sebelum</p>
                  <img src={`/${photoModal.before}`} alt="Before" className="w-full rounded-xl" />
                </div>
              )}
              {photoModal.after && (
                <div>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-1">Sesudah</p>
                  <img src={`/${photoModal.after}`} alt="After" className="w-full rounded-xl" />
                </div>
              )}
            </div>
            <button onClick={() => setPhotoModal(null)} className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}
