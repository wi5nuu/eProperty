# Roadmap implementasi domain

Proyek ini dibuat dari nol, sehingga urutan berikut adalah urutan pembangunan, bukan migrasi strangler fig.

| Modul/domain | Coupling | Urutan | Alasan |
| --- | ---: | ---: | --- |
| Security | Fondasi | 1 | Menyediakan identitas dan otorisasi tanpa dependency bisnis. |
| Employee Center | Rendah | 2 | Data pegawai dapat berdiri sendiri dan memvalidasi gateway/JWT/database terpisah. |
| Contractor Management | Rendah-sedang | 3 | Dapat memakai pola service Employee tanpa posting jurnal awal. |
| Customer Center | Sedang | 4 | Menjadi master data untuk AR dan Estate. |
| Supplier Center | Sedang | 5 | Menjadi master data untuk AP dan Purchasing. |
| Estate Management | Sedang | 6 | Tetapkan lifecycle unit/property/tenant sebelum invoice. |
| Inventory | Sedang-tinggi | 7 | Tetapkan item, unit of measure, dan valuasi sebelum Purchasing/COGS. |
| Purchasing | Tinggi | 8 | Memulai saga Procurement-to-Finance setelah master data siap. |
| Finance (GL/AR/AP/Cash/FA/Budget/COGS) | Sangat tinggi | 9 | Dibangun sebagai satu bounded context terlebih dahulu demi atomicity dan audit. |
| Reporting / Print | Read-only | 10 | Dibangun dari projection event, tidak mengakses database service lain. |

## Informasi bisnis yang wajib ditentukan sebelum Finance

- chart of accounts, periode fiskal, mata uang, dan aturan pembulatan;
- aturan approval, pencadangan anggaran, serta delegation of authority;
- lifecycle property, kontrak tenant, invoice, pembayaran, retur, dan depresiasi;
- aturan pajak Indonesia yang berlaku untuk entitas pengguna;
- format laporan/audit dan retention policy.

