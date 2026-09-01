# Arsitektur awal

## Keputusan fondasi

- **Runtime:** Laravel 12, PHP 8.2 (versi PHP lokal yang tersedia). Naikkan ke PHP 8.3 sebelum production agar dapat memakai Laravel 13 bila seluruh dependency telah lulus pengujian.
- **Deployment:** satu container per service; setiap service dapat restart dan deploy sendiri.
- **Data:** PostgreSQL, satu database per service. Tidak ada foreign key lintas database dan tidak ada query langsung ke database service lain.
- **Gateway:** Nginx sebagai edge gateway. Ia menerapkan timeout 2/10 detik, satu percobaan upstream, dan passive circuit breaking (`max_fails`/`fail_timeout`). Circuit breaker aktif di pemanggil service ditambahkan saat service mulai melakukan HTTP call.
- **Identitas:** `identity-service` menerbitkan JWT berumur pendek berisi user, role, dan permission. Service bisnis memverifikasi tanda tangan JWT secara lokal; request normal tidak membuat service bisnis tergantung pada availability identity-service.
- **Asinkron:** RabbitMQ adalah transport event. Gunakan transactional outbox per service: perubahan bisnis dan record outbox ditulis dalam satu transaksi lokal, publisher menerbitkan event, lalu consumer melakukan deduplikasi memakai `event_id`.

## Konsistensi finansial

Jangan memakai two-phase commit atau transaksi database lintas service. Purchasing menyimpan perubahan lokal serta event `PurchaseOrderApproved` melalui outbox. Finance service mengonsumsi event secara idempoten dan membuat posting journal dengan `source_event_id` unik. Bila posting gagal, workflow masuk status `posting_pending` dan diretry; pembatalan dibuat sebagai jurnal pembalik, bukan menghapus jurnal yang telah diposting. Ini adalah saga orkestrasi berbasis event dengan audit trail immutable.

## Batas service target

| Bounded context | Database pemilik | Integrasi utama |
| --- | --- | --- |
| Identity & Security | identity_db | JWT, role/permission |
| Finance (GL, AR, AP, Cash Book, Fixed Asset, Budget, COGS) | finance_db | Event transaksi; jurnal immutable |
| Customer | customer_db | Referensi customer via ID/API |
| Supplier | supplier_db | Referensi supplier via ID/API |
| Purchasing | purchasing_db | Saga ke Finance, Inventory, Supplier |
| Inventory | inventory_db | Event receipt/issue/valuation |
| Estate Management | estate_db | Event property/unit/tenant |
| Contractor Management | contractor_db | API contractor/project |
| Employee Center | employee_db | API pegawai |
| Reporting / Print | reporting_db atau object storage | Read model dari event; bukan sumber data bisnis |

`Print-Out` bukan business service transaksional; jadikan reporting/rendering service yang hanya membaca projection atau snapshot yang dikirim event.

