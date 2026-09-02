import { useEffect, useState } from 'react'
import { Users, Briefcase, HardHat, UserCog, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

interface Stats {
  customers: number
  suppliers: number
  contractors: number
  employees: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ customers: 0, suppliers: 0, contractors: 0, employees: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, s, ct, e] = await Promise.all([
          api.get('/customers').catch(() => ({ data: { data: [] } })),
          api.get('/suppliers').catch(() => ({ data: { data: [] } })),
          api.get('/contractors').catch(() => ({ data: { data: [] } })),
          api.get('/employees').catch(() => ({ data: { data: [] } })),
        ])
        setStats({
          customers: c.data.data?.length ?? 0,
          suppliers: s.data.data?.length ?? 0,
          contractors: ct.data.data?.length ?? 0,
          employees: e.data.data?.length ?? 0,
        })
      } catch {
        toast.error('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Customers', value: stats.customers, icon: Users, color: 'bg-blue-500' },
    { label: 'Suppliers', value: stats.suppliers, icon: Briefcase, color: 'bg-emerald-500' },
    { label: 'Contractors', value: stats.contractors, icon: HardHat, color: 'bg-amber-500' },
    { label: 'Employees', value: stats.employees, icon: UserCog, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Ringkasan data eProperty</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white`}>
                <card.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
