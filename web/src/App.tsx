import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import CustomerForm from './pages/customers/CustomerForm'
import SupplierList from './pages/suppliers/SupplierList'
import SupplierForm from './pages/suppliers/SupplierForm'
import ContractorList from './pages/contractors/ContractorList'
import ContractorForm from './pages/contractors/ContractorForm'
import EmployeeList from './pages/employees/EmployeeList'
import EmployeeForm from './pages/employees/EmployeeForm'
import MeterDashboard from './pages/meter/MeterDashboard'
import HouseList from './pages/meter/HouseList'
import HouseForm from './pages/meter/HouseForm'
import ReadingForm from './pages/meter/ReadingForm'
import ReadingHistory from './pages/meter/ReadingHistory'
import MapView from './pages/meter/MapView'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/create" element={<CustomerForm />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/create" element={<SupplierForm />} />
        <Route path="suppliers/:id/edit" element={<SupplierForm />} />
        <Route path="contractors" element={<ContractorList />} />
        <Route path="contractors/create" element={<ContractorForm />} />
        <Route path="contractors/:id/edit" element={<ContractorForm />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/create" element={<EmployeeForm />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
        <Route path="meter" element={<MeterDashboard />} />
        <Route path="meter/houses" element={<HouseList />} />
        <Route path="meter/houses/create" element={<HouseForm />} />
        <Route path="meter/houses/:id/edit" element={<HouseForm />} />
        <Route path="meter/houses/:houseId/readings" element={<ReadingHistory />} />
        <Route path="meter/houses/:houseId/reading" element={<ReadingForm />} />
        <Route path="meter/map" element={<MapView />} />
      </Route>
    </Routes>
  )
}
