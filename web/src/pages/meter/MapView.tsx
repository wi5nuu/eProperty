import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Loader2, Home, Droplets, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import 'leaflet/dist/leaflet.css'

interface MapHouse {
  id: number
  house_code: string
  owner_name: string
  address: string
  block: string
  latitude: number
  longitude: number
  status: string
}

const createIcon = (status: string) => {
  const color = status === 'active' ? '#22c55e' : '#94a3b8'
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M3 21V7l9-4 9 4v14H3zm2-2h14V9l-7-3.1L5 9v10z"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

export default function MapView() {
  const [houses, setHouses] = useState<MapHouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filterBlock, setFilterBlock] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/meter/houses/map')
      .then(({ data }) => setHouses(data.data ?? []))
      .catch(() => {
        setError(true)
        toast.error('Gagal memuat data peta')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filterBlock
    ? houses.filter(h => h.block === filterBlock && h.latitude && h.longitude)
    : houses.filter(h => h.latitude && h.longitude)
  const blocks = [...new Set(houses.map(h => h.block).filter(Boolean))].sort()

  const center: [number, number] = filtered.length > 0
    ? [filtered[0].latitude, filtered[0].longitude]
    : [-6.2088, 106.8456]

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle size={48} className="text-amber-500" />
        <p className="text-slate-600 dark:text-slate-300">Gagal memuat data peta</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Coba Lagi</button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Peta Lokasi Rumah</h1>
        <select
          value={filterBlock}
          onChange={(e) => setFilterBlock(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">Semua Blok</option>
          {blocks.map(b => <option key={b} value={b}>Blok {b}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((house) => (
            <Marker
              key={house.id}
              position={[house.latitude, house.longitude]}
              icon={createIcon(house.status)}
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-bold text-blue-600">{house.house_code}</p>
                  <p className="font-medium">{house.owner_name}</p>
                  <p className="text-slate-500 text-xs">{house.address}</p>
                  {house.block && <p className="text-xs">Blok {house.block}</p>}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/meter/houses/${house.id}/readings`)}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Riwayat
                    </button>
                    <button
                      onClick={() => navigate(`/meter/houses/${house.id}/reading`)}
                      className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600"
                    >
                      Pencacatan
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block" /> Aktif
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-slate-400 rounded-full inline-block" /> Nonaktif
        </span>
        <span>{filtered.length} rumah ditampilkan</span>
      </div>
    </div>
  )
}
