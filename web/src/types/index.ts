export interface Property {
  id: number
  name: string
  address: string
  type: 'apartment' | 'house' | 'office' | 'warehouse'
  status: 'active' | 'inactive' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: number
  name: string
  email: string
  phone: string
  property_id: number
  unit_number: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  tenant_id: number
  amount: number
  due_date: string
  paid_at?: string
  status: 'pending' | 'paid' | 'overdue'
  description?: string
  created_at: string
  updated_at: string
}

export interface MeterReading {
  id: number
  property_id: number
  meter_type: 'water' | 'electricity' | 'gas'
  current_reading: number
  previous_reading: number
  consumption: number
  reading_date: string
  status: 'pending' | 'confirmed' | 'disputed'
  photo_before?: string
  photo_after?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
