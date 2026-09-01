import CrudList from '../../components/CrudList'

export default function EmployeeList() {
  return (
    <CrudList
      title="Employees"
      endpoint="/employees"
      columns={[
        { key: 'full_name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'position', label: 'Jabatan' },
        { key: 'department', label: 'Departemen' },
        { key: 'employment_status', label: 'Status' },
      ]}
      createPath="/employees/create"
      editPath={(id) => `/employees/${id}/edit`}
    />
  )
}
