import CrudList from '../../components/CrudList'

export default function SupplierList() {
  return (
    <CrudList
      title="Suppliers"
      endpoint="/suppliers"
      columns={[
        { key: 'name', label: 'Nama' },
        { key: 'contact_person', label: 'Kontak Person' },
        { key: 'phone', label: 'Telepon' },
        { key: 'email', label: 'Email' },
      ]}
      createPath="/suppliers/create"
      editPath={(id) => `/suppliers/${id}/edit`}
    />
  )
}
