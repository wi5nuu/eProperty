import { useEffect, useState } from 'react'
import { Droplets, Home, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import api from '../../lib/api'

interface DashboardData {
  total_houses: number
  active_houses: number
  readings_this_month: number
  pending_readings: number
  total_consumption: number
  recent_readings: any[]
  block_stats: { block: string; total: number }[]
}

export default function MeterDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get('/meter/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Rumah', value: data.total_houses, icon: Home, color: 'bg-blue-500' },
    { label: 'Aktif', value: data.active_houses, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Terbaca Bulan Ini', value: data.readings_this_month, icon: Droplets, color: 'bg-cyan-500' },
    { label: 'Menunggu', value: data.pending_readings, icon: Clock, color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Meter Air</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Ringkasan pencatatan meteran air</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white`}>
                <s.icon size={20} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{s.value.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Konsumsi Air Bulan Ini</h2>
        </div>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.total_consumption.toLocaleString()} m³</p>
      </div>

      {data.block_stats.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Statistik per Blok</h2>
          <div className="space-y-2">
            {data.block_stats.map((b) => (
              <div key={b.block} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Blok {b.block}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{b.total} rumah</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.recent_readings.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Pembacaan Terakhir</h2>
          <div className="space-y-3">
            {data.recent_readings.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{r.house?.house_code} - {r.house?.owner_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.reading_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{r.consumption} m³</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : r.status === 'disputed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
