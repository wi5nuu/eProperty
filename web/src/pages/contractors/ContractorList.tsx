import CrudList from '../../components/CrudList'

export default function ContractorList() {
  return (
    <CrudList
      title="Contractors"
      endpoint="/contractors"
      columns={[
        { key: 'company_name', label: 'Perusahaan' },
        { key: 'contact_person', label: 'Kontak Person' },
        { key: 'phone', label: 'Telepon' },
        { key: 'email', label: 'Email' },
        { key: 'specialization', label: 'Spesialisasi' },
      ]}
      createPath="/contractors/create"
      editPath={(id) => `/contractors/${id}/edit`}
    />
  )
}
