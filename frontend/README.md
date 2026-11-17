# RecruitPro Enterprise Frontend Architecture

Hệ thống Frontend xây dựng trên **React 18 + TypeScript + Vite + Tailwind CSS**, áp dụng kiến trúc **Feature-Driven Architecture (Vertical Slice)** chuẩn Enterprise.

---

## 1. Cấu trúc thư mục chuẩn

```
frontend/
│
├── public/
│
├── src/
│   ├── api/                         # Cấu hình HTTP & Interceptors dùng chung
│   │   ├── axiosClient.ts
│   │   ├── interceptors.ts
│   │   └── apiError.ts
│   │
│   ├── assets/                      # Tài nguyên tĩnh
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                  # Component dùng chung toàn hệ thống
│   │   ├── ui/                      # Giao diện cơ bản (Button, Input, Modal, Table, Pagination)
│   │   ├── common/                  # Tiện ích giao diện (Loading, EmptyState, ErrorBoundary)
│   │   └── feedback/                # Thông báo & phản hồi (Toast, ConfirmDialog)
│   │
│   ├── config/                      # Cấu hình ứng dụng tập trung
│   │   ├── env.ts
│   │   ├── app.config.ts
│   │   └── queryClient.ts
│   │
│   ├── features/                    # Các module nghiệp vụ tự đóng gói (Feature-Driven)
│   │   ├── auth/                    # Xác thực & phiên đăng nhập
│   │   ├── attendance/              # Chấm công & điểm danh
│   │   ├── branches/                # Chi nhánh & cơ sở
│   │   ├── candidates/              # Ứng viên & Talent Pool
│   │   ├── applications/            # Nộp hồ sơ & Kanban ATS
│   │   ├── jobs/                    # Quản lý tin tuyển dụng
│   │   ├── departments/             # Quản lý phòng ban
│   │   ├── dashboard/               # Thống kê KPI & phễu tuyển dụng
│   │   ├── interviews/              # Lịch phỏng vấn & đánh giá
│   │   └── employees/               # Hồ sơ nhân sự cốt lõi (HRM)
│   │
│   ├── layouts/                     # Bố cục giao diện theo Portal
│   │   ├── PublicLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── CandidateLayout.tsx
│   │   └── Footer.tsx
│   │
│   ├── router/                      # Quản lý điều hướng tập trung
│   │   ├── index.tsx
│   │   ├── public.routes.tsx
│   │   ├── admin.routes.tsx
│   │   ├── candidate.routes.tsx
│   │   └── guards/
│   │       ├── ProtectedRoute.tsx
│   │       └── RoleGuard.tsx
│   │
│   ├── store/                       # Global state
│   │   ├── index.ts
│   │   └── slices/
│   │
│   ├── styles/                      # CSS & Variables dùng chung
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── global.css
│   │
│   ├── types/                       # TypeScript definitions dùng chung
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                       # Hàm tiện ích dùng chung
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── validators.ts
│   │
│   ├── App.tsx                      # Root Application
│   ├── AppBootstrap.tsx             # Bootstrap Providers Wrapper
│   ├── index.css                    # Tailwind CSS Base
│   └── main.tsx                     # Vite Entry Point
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 2. Quy định trách nhiệm từng thư mục

| Thư mục | Chỉ nên chứa |
| :--- | :--- |
| `components/` | Các component giao diện của riêng feature |
| `api/` | Hàm gọi API Backend (sử dụng `axiosClient`) |
| `hooks/` | Custom React Hooks phục vụ nghiệp vụ |
| `types/` | Interface, Type, DTO của nghiệp vụ |
| `utils/` | Hàm xử lý dữ liệu thuần (pure functions) |
| `[Feature]Page.tsx` | Ghép nối các components thành trang hoàn chỉnh |
| `[Feature]Page.css` | CSS riêng scoped cho trang nghiệp vụ đó |
| `mock*.ts` | Dữ liệu giả lập phục vụ phát triển, demo và test offline |

---

## 3. Các nguyên tắc cốt lõi (Core Principles)

1. **Không viết Axios Request trực tiếp trong Component**: Toàn bộ lời gọi HTTP phải nằm trong `api/[feature]Api.ts`.
2. **Không viết toàn bộ nghiệp vụ trong Page**: `Page.tsx` là nơi kết nối router params và điều phối components con, không ôm đồm logic hiển thị chi tiết.
3. **Component chỉ phục vụ một nghiệp vụ thì nằm trong feature đó**: Tránh làm phình to `components/` dùng chung.
4. **API, Hooks, Types, Utils được bổ sung theo mức độ phát triển**: Áp dụng quy mô feature từ Nhỏ (`Page + CSS`), Trung bình (`Page + CSS + Components`) đến Lớn (`Page + Components + API + Types + Hooks`).
5. **Thành phần thực sự dùng chung mới đưa ra thư mục cấp `src`**: Giữ tính đóng gói (encapsulation) cao nhất cho từng nghiệp vụ.
