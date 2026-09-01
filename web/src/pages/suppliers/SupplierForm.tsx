import CrudForm from '../../components/CrudForm'

export default function SupplierForm() {
  return (
    <CrudForm
      title="Supplier"
      endpoint="/suppliers"
      listPath="/suppliers"
      fields={[
        { name: 'name', label: 'Nama Perusahaan', required: true },
        { name: 'contact_person', label: 'Kontak Person', required: true },
        { name: 'phone', label: 'Telepon' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'address', label: 'Alamat', type: 'textarea' },
      ]}
    />
  )
}
