export interface DashboardStats {
  totalProperties: number
  totalTenants: number
  totalInvoices: number
  pendingInvoices: number
  totalRevenue: number
  pendingRevenue: number
  occupancyRate: number
  recentActivities: Activity[]
}

export interface Activity {
  id: number
  type: 'invoice' | 'tenant' | 'property' | 'meter'
  description: string
  timestamp: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}
