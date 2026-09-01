# Kontrak API awal

Semua endpoint eksternal melalui gateway `http://localhost:8081`. Format error mengikuti respons JSON Laravel. UUID request dapat dilacak melalui header `X-Request-Id` yang dibuat gateway.

## Identity service

| Method | Gateway path | Tujuan |
| --- | --- | --- |
| `POST` | `/api/v1/identity/auth/login` | Menukar email dan password menjadi JWT 15 menit. Dibatasi 5 percobaan/menit per kombinasi email/IP. |
| `GET` | `/api/v1/identity/auth/me` | Memeriksa token dan mengembalikan claim. |
| `GET` | `/api/v1/identity/health` | Health check identity service. |

Contoh login:

```json
{"email":"admin@eproperty.local","password":"ChangeMe123!"}
```

Kredensial tersebut hanya seed development. Ganti `INITIAL_ADMIN_PASSWORD` sebelum menjalankan Docker di lingkungan selain lokal.

## Employee service

Semua endpoint membutuhkan `Authorization: Bearer <JWT>` dan permission terkait.

| Method | Gateway path | Permission |
| --- | --- | --- |
| `GET` | `/api/v1/employees` | `employees.read` |
| `POST` | `/api/v1/employees` | `employees.create` |
| `GET` | `/api/v1/employees/{id}` | `employees.read` |
| `PUT` | `/api/v1/employees/{id}` | `employees.update` |
| `DELETE` | `/api/v1/employees/{id}` | `employees.delete` |
| `GET` | `/api/v1/employees/health` | - |

Payload pegawai minimum:

```json
{"employee_number":"EMP-001","full_name":"Siti Aminah","employment_status":"active"}
```

## Rollback database

Karena proyek ini belum memiliki data produksi, rollback schema service dapat dilakukan di service terkait dengan `php artisan migrate:rollback`. Setelah ada data operasional, rollout harus memakai migration additif, backup tervalidasi, dan rollback berbasis kompensasi—bukan penghapusan data atau downgrade schema otomatis.
