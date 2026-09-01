import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

// Property validation schema
export const propertySchema = z.object({
  name: z.string().min(1, 'Nama properti wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  type: z.enum(['apartment', 'house', 'office', 'warehouse']),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
})

// Tenant validation schema
export const tenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant wajib diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon tidak valid'),
  property_id: z.number().positive('Property ID wajib dipilih'),
  unit_number: z.string().min(1, 'Nomor unit wajib diisi'),
})

// Invoice validation schema
export const invoiceSchema = z.object({
  tenant_id: z.number().positive('Tenant wajib dipilih'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
  description: z.string().optional(),
})

// Meter reading validation schema
export const meterReadingSchema = z.object({
  property_id: z.number().positive('Property wajib dipilih'),
  meter_type: z.enum(['water', 'electricity', 'gas']),
  current_reading: z.number().min(0, 'Pembacaan tidak boleh negatif'),
  previous_reading: z.number().min(0, 'Pembacaan tidak boleh negatif'),
  reading_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type TenantInput = z.infer<typeof tenantSchema>
export type InvoiceInput = z.infer<typeof invoiceSchema>
export type MeterReadingInput = z.infer<typeof meterReadingSchema>
