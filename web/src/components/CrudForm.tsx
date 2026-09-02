import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

interface Field {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
}

interface CrudFormProps {
  title: string
  endpoint: string
  fields: Field[]
  listPath: string
}

export default function CrudForm({ title, endpoint, fields, listPath }: CrudFormProps) {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      api.get(`${endpoint}/${id}`)
        .then(({ data }) => {
          const record = data.data ?? data
          const f: Record<string, string> = {}
          fields.forEach((field) => {
            f[field.name] = String(record[field.name] ?? '')
          })
          setForm(f)
        })
        .catch(() => toast.error('Gagal memuat data'))
        .finally(() => setFetching(false))
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`${endpoint}/${id}`, form)
        toast.success('Data berhasil diperbarui')
      } else {
        await api.post(endpoint, form)
        toast.success('Data berhasil ditambahkan')
      }
      navigate(listPath)
    } catch (err: any) {
      const message = err.response?.data?.message || (isEdit ? 'Gagal memperbarui data' : 'Gagal menambahkan data')
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(listPath)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? `Edit ${title}` : `Tambah ${title}`}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                value={form[field.name] ?? ''}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
              />
            ) : (
              <input
                type={field.type ?? 'text'}
                required={field.required}
                placeholder={field.placeholder}
                value={form[field.name] ?? ''}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            )}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(listPath)}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Memproses...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}
