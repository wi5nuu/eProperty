import CrudForm from '../../components/CrudForm'

export default function CustomerForm() {
  return (
    <CrudForm
      title="Customer"
      endpoint="/customers"
      listPath="/customers"
      fields={[
        { name: 'name', label: 'Nama', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Telepon' },
        { name: 'address', label: 'Alamat', type: 'textarea' },
      ]}
    />
  )
}
