export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/identity/auth/login',
  AUTH_ME: '/identity/auth/me',
  AUTH_LOGOUT: '/identity/auth/logout',

  // Properties
  PROPERTIES: '/property/properties',
  PROPERTY_BY_ID: (id: number) => `/property/properties/${id}`,

  // Tenants
  TENANTS: '/tenant/tenants',
  TENANT_BY_ID: (id: number) => `/tenant/tenants/${id}`,

  // Invoices
  INVOICES: '/billing/invoices',
  INVOICE_BY_ID: (id: number) => `/billing/invoices/${id}`,
  INVOICE_PAY: (id: number) => `/billing/invoices/${id}/pay`,

  // Meter Readings
  METER_READINGS: '/meter-reading/readings',
  METER_READING_BY_ID: (id: number) => `/meter-reading/readings/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/property/dashboard/stats',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (id: number) => `/properties/${id}`,
  TENANTS: '/tenants',
  TENANT_DETAIL: (id: number) => `/tenants/${id}`,
  INVOICES: '/invoices',
  INVOICE_DETAIL: (id: number) => `/invoices/${id}`,
  METERS: '/meters',
  METER_DETAIL: (id: number) => `/meters/${id}`,
  SETTINGS: '/settings',
} as const

export const STORAGE_KEYS = {
  AUTH: 'eproperty-auth',
  THEME: 'eproperty-theme',
} as const
