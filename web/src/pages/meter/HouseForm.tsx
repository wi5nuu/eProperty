import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function HouseForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [form, setForm] = useState({
    house_code: '',
    address: '',
    rt: '',
    rw: '',
    block: '',
    owner_name: '',
    phone: '',
    meter_number: '',
    latitude: '',
    longitude: '',
    status: 'active',
  })

  useEffect(() => {
    if (isEdit) {
      api.get(`/meter/houses/${id}`)
        .then(({ data }) => {
          const h = data.data ?? data
          setForm({
            house_code: h.house_code || '',
            address: h.address || '',
            rt: h.rt || '',
            rw: h.rw || '',
            block: h.block || '',
            owner_name: h.owner_name || '',
            phone: h.phone || '',
            meter_number: h.meter_number || '',
            latitude: h.latitude || '',
            longitude: h.longitude || '',
            status: h.status || 'active',
          })
        })
        .catch(() => toast.error('Gagal memuat data'))
        .finally(() => setFetching(false))
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.latitude) delete payload.latitude
      if (!payload.longitude) delete payload.longitude

      if (isEdit) {
        await api.put(`/meter/houses/${id}`, payload)
        toast.success('Berhasil diperbarui')
      } else {
        await api.post('/meter/houses', payload)
        toast.success('Berhasil ditambahkan')
      }
      navigate('/meter/houses')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
  }

  const fields: Array<{ name: string; label: string; required?: boolean; placeholder?: string; type?: string; step?: string }> = [
    { name: 'house_code', label: 'Kode Rumah', required: true, placeholder: 'R-001' },
    { name: 'owner_name', label: 'Nama Pemilik', required: true },
    { name: 'address', label: 'Alamat', required: true },
    { name: 'block', label: 'Blok', placeholder: 'A' },
    { name: 'rt', label: 'RT', placeholder: '001' },
    { name: 'rw', label: 'RW', placeholder: '001' },
    { name: 'phone', label: 'Telepon', placeholder: '08xxx' },
    { name: 'meter_number', label: 'Nomor Meter', placeholder: 'W-001' },
    { name: 'latitude', label: 'Latitude', placeholder: '-6.2088', type: 'number', step: 'any' },
    { name: 'longitude', label: 'Longitude', placeholder: '106.8456', type: 'number', step: 'any' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/meter/houses')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Rumah' : 'Tambah Rumah'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
            <input
              type="text"
              required={f.required}
              placeholder={f.placeholder}
              value={(form as any)[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/meter/houses')} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}
