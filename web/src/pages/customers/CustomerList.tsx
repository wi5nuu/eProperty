import CrudList from '../../components/CrudList'

export default function CustomerList() {
  return (
    <CrudList
      title="Customers"
      endpoint="/customers"
      columns={[
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Telepon' },
        { key: 'address', label: 'Alamat' },
      ]}
      createPath="/customers/create"
      editPath={(id) => `/customers/${id}/edit`}
    />
  )
}
