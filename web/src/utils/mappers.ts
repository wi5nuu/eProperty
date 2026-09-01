export function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success',
    confirmed: 'success',
    paid: 'success',
    inactive: 'default',
    maintenance: 'warning',
    pending: 'warning',
    overdue: 'danger',
    disputed: 'danger',
  }
  return statusMap[status] || 'default'
}

export function getStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    maintenance: 'Pemeliharaan',
    pending: 'Tertunda',
    confirmed: 'Dikonfirmasi',
    disputed: 'Disengketakan',
    paid: 'Lunas',
    overdue: 'Terlambat',
  }
  return labelMap[status] || status
}

export function getPropertyTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    apartment: 'Apartemen',
    house: 'Rumah',
    office: 'Kantor',
    warehouse: 'Gudang',
  }
  return typeMap[type] || type
}

export function getMeterTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    water: 'Air',
    electricity: 'Listrik',
    gas: 'Gas',
  }
  return typeMap[type] || type
}
