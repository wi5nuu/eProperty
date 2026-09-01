import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Home, Users, Briefcase, HardHat, UserCog, LogOut, Moon, Sun, Droplets, MapPin, Building } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { divider: true, label: 'Master Data' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/suppliers', icon: Briefcase, label: 'Suppliers' },
  { to: '/contractors', icon: HardHat, label: 'Contractors' },
  { to: '/employees', icon: UserCog, label: 'Employees' },
  { divider: true, label: 'Meter Air' },
  { to: '/meter', icon: Droplets, label: 'Dashboard Meter' },
  { to: '/meter/houses', icon: Building, label: 'Data Rumah' },
  { to: '/meter/map', icon: MapPin, label: 'Peta Lokasi' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleDark = () => {
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors ${dark ? 'dark' : ''}`}>
      <div className="fixed inset-0 z-40 flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none border-r border-slate-200 dark:border-slate-700 overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">eProperty</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <X size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {navItems.map((item, i) =>
              item.divider ? (
                <div key={i} className="pt-4 pb-1 px-3">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/' || item.to === '/meter'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Menu size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div className="hidden lg:block" />
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {dark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
