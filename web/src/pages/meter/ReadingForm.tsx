import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

interface House {
  id: number
  house_code: string
  owner_name: string
  meter_number: string
  latest_reading?: { current_reading: number }
}

export default function ReadingForm() {
  const { houseId } = useParams()
  const navigate = useNavigate()
  const [house, setHouse] = useState<House | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoBefore, setPhotoBefore] = useState<File | null>(null)
  const [photoAfter, setPhotoAfter] = useState<File | null>(null)
  const [previewBefore, setPreviewBefore] = useState<string>('')
  const [previewAfter, setPreviewAfter] = useState<string>('')
  const [form, setForm] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    previous_reading: '',
    current_reading: '',
    reader_name: '',
    notes: '',
  })

  useEffect(() => {
    if (houseId) {
      api.get(`/meter/houses/${houseId}`)
        .then(({ data }) => {
          const h = data.data ?? data
          setHouse(h)
          if (h.latest_reading) {
            setForm(f => ({ ...f, previous_reading: String(h.latest_reading.current_reading) }))
          }
        })
        .catch(() => toast.error('Gagal memuat data rumah'))
    }
  }, [houseId])

  const handlePhoto = (file: File, type: 'before' | 'after') => {
    if (type === 'before') {
      setPhotoBefore(file)
      setPreviewBefore(URL.createObjectURL(file))
    } else {
      setPhotoAfter(file)
      setPreviewAfter(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('house_id', houseId!)
      fd.append('reading_date', form.reading_date)
      fd.append('previous_reading', form.previous_reading)
      fd.append('current_reading', form.current_reading)
      fd.append('reader_name', form.reader_name)
      if (form.notes) fd.append('notes', form.notes)
      if (photoBefore) fd.append('photo_before', photoBefore)
      if (photoAfter) fd.append('photo_after', photoAfter)

      await api.post('/meter/readings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Pembacaan berhasil disimpan')
      navigate(`/meter/houses/${houseId}/readings`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pembacaan')
    } finally {
      setLoading(false)
    }
  }

  if (!house) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pembacaan Meter</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{house.house_code} - {house.owner_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Pembacaan</label>
            <input
              type="date"
              required
              value={form.reading_date}
              onChange={(e) => setForm({ ...form, reading_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sebelumnya (m³)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.previous_reading}
                onChange={(e) => setForm({ ...form, previous_reading: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sekarang (m³)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.current_reading}
                onChange={(e) => setForm({ ...form, current_reading: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {form.previous_reading && form.current_reading && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Pemakaian: <span className="font-bold">{(Number(form.current_reading) - Number(form.previous_reading)).toFixed(2)} m³</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Petugas</label>
            <input
              type="text"
              required
              value={form.reader_name}
              onChange={(e) => setForm({ ...form, reader_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Nama petugas pencacat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Catatan</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Opsional"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera size={18} className="text-blue-500" />
            Foto Meteran
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sebelum</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-400 transition-all overflow-hidden">
                {previewBefore ? (
                  <img src={previewBefore} alt="Before" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Camera size={24} className="mx-auto text-slate-400 mb-1" />
                    <span className="text-xs text-slate-400">Tap untuk foto</span>
                  </div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0], 'before')} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sesudah</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-400 transition-all overflow-hidden">
                {previewAfter ? (
                  <img src={previewAfter} alt="After" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Camera size={24} className="mx-auto text-slate-400 mb-1" />
                    <span className="text-xs text-slate-400">Tap untuk foto</span>
                  </div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0], 'after')} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
            {loading ? 'Menyimpan...' : 'Simpan Pembacaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
