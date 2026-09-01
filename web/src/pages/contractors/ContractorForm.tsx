import CrudForm from '../../components/CrudForm'

export default function ContractorForm() {
  return (
    <CrudForm
      title="Contractor"
      endpoint="/contractors"
      listPath="/contractors"
      fields={[
        { name: 'company_name', label: 'Nama Perusahaan', required: true },
        { name: 'contact_person', label: 'Kontak Person', required: true },
        { name: 'phone', label: 'Telepon' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'specialization', label: 'Spesialisasi' },
        { name: 'address', label: 'Alamat', type: 'textarea' },
      ]}
    />
  )
}
