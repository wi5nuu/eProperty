import CrudForm from '../../components/CrudForm'

export default function EmployeeForm() {
  return (
    <CrudForm
      title="Employee"
      endpoint="/employees"
      listPath="/employees"
      fields={[
        { name: 'full_name', label: 'Nama Lengkap', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'position', label: 'Jabatan', required: true },
        { name: 'department', label: 'Departemen' },
        { name: 'employment_status', label: 'Status Karyawan' },
      ]}
    />
  )
}
