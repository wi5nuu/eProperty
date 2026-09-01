export const STATUS_COLORS = {
  active: 'success',
  inactive: 'default',
  maintenance: 'warning',
  pending: 'warning',
  confirmed: 'success',
  disputed: 'danger',
  paid: 'success',
  overdue: 'danger',
} as const

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartemen' },
  { value: 'house', label: 'Rumah' },
  { value: 'office', label: 'Kantor' },
  { value: 'warehouse', label: 'Gudang' },
]

export const METER_TYPES = [
  { value: 'water', label: 'Air' },
  { value: 'electricity', label: 'Listrik' },
  { value: 'gas', label: 'Gas' },
]

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' },
  { value: 'maintenance', label: 'Pemeliharaan' },
]

export const INVOICE_STATUS = [
  { value: 'pending', label: 'Tertunda' },
  { value: 'paid', label: 'Lunas' },
  { value: 'overdue', label: 'Terlambat' },
]

export const READING_STATUS = [
  { value: 'pending', label: 'Tertunda' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'disputed', label: 'Disengketakan' },
]
