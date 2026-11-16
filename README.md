# 🏢 ENTERPRISE RECRUITMENT MANAGEMENT SYSTEM (RMS / ATS)

> Nền tảng tuyển dụng doanh nghiệp & Hệ thống theo dõi ứng viên (Applicant Tracking System - ATS) chuyên nghiệp, bảo mật và chuẩn hóa quy trình tuyển dụng.

---

## 🌟 1. Tổng quan Kiến trúc 3 Khu vực Độc lập

Hệ thống được thiết kế theo đúng đề xuất nghiệp vụ tiêu chuẩn, phân tách 3 cổng thông tin riêng biệt nhưng sử dụng chung nền tảng cơ sở dữ liệu:

1. 🌐 **Public Careers Website**: 
   - Trang chủ giới thiệu thương hiệu tuyển dụng (Employer Branding), văn hóa công ty và chế độ phúc lợi.
   - Danh sách tin tuyển dụng với bộ lọc đa tiêu chí (Phòng ban, Cấp bậc, Địa điểm, Mức lương).
   - Trang chi tiết công việc (Job Description) và cửa sổ nộp hồ sơ trực tuyến.
2. 👤 **Candidate Portal**:
   - Trang cá nhân của ứng viên (Candidate Dashboard).
   - **Interactive Tracking Timeline**: Theo dõi tiến độ hồ sơ qua từng vòng (*Đã tiếp nhận* ➔ *Sàng lọc CV* ➔ *Phỏng vấn kỹ thuật* ➔ *Đề nghị nhận việc* ➔ *Kết quả*).
   - Quản lý CV cá nhân (Snapshot lưu trữ tại thời điểm nộp đơn), kỹ năng, kinh nghiệm và học vấn.
   - Xem lịch phỏng vấn và truy cập phòng họp Google Meet trực tuyến.
3. 🛡️ **Admin / ATS Portal**:
   - **Dashboard Analytics**: Thống kê KPI, tỷ lệ chuyển đổi qua các vòng, thời gian hoàn tất tuyển dụng (*Time-to-fill*).
   - **Kanban Pipeline**: Kéo thả và chuyển trạng thái ứng viên giữa các cột với bộ quy tắc nghiệp vụ nghiêm ngặt (*Validate Offer trước khi Hired, bắt buộc nhập lý do khi Reject*).
   - **Quản lý tin tuyển dụng**: Vòng đời tin đăng `DRAFT` ➔ `PENDING_APPROVAL` ➔ `PUBLISHED` ➔ `CLOSED`.
   - **Quản lý & Đánh giá phỏng vấn**: Lên lịch phỏng vấn và chấm điểm theo 4 tiêu chí chuẩn hóa (*Chuyên môn, Giao tiếp, Giải quyết vấn đề, Làm việc nhóm; kết luận PASS/FAIL*).

---

## 🛠️ 2. Công nghệ Kỹ thuật sử dụng

| Tầng | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.3.x | Modular Monolith, Spring Data JPA, Hibernate |
| **Security** | Spring Security 6, JWT | Phân quyền 5 vai trò (RBAC), Stateless Session |
| **Database** | PostgreSQL 16 | Relational DB, Unique constraint `(candidate_id, job_id)` |
| **Cache & Queue** | Redis 7 | Caching, Rate limiting, OTP |
| **Storage** | MinIO / S3 | Lưu trữ CV an toàn, bảo vệ link tải bằng RBAC |
| **Frontend** | React 18, TypeScript, Vite | Tailwind CSS, Lucide Icons, Clean Architecture |
| **Tài liệu API** | SpringDoc OpenAPI 3 / Swagger | `/api/v1/swagger-ui.html` |
| **Hạ tầng** | Docker Compose | Đóng gói sẵn Postgres, Redis, MinIO, MailHog |

---

## 👥 3. Hệ thống Phân quyền (RBAC 5 Roles)

Tài khoản mặc định được tích hợp sẵn:

| Vai trò | Email đăng nhập | Mật khẩu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `admin@recruitment.com` | `password123` | Quản trị toàn bộ hệ thống, phân quyền, cấu hình |
| **HR_MANAGER** | `hr.manager@recruitment.com` | `password123` | Duyệt tin tuyển dụng, xem báo cáo KPI, quyết định Offer |
| **RECRUITER** | `recruiter@recruitment.com` | `password123` | Tạo tin nháp, sàng lọc CV, kéo thả Kanban, lên lịch phỏng vấn |
| **INTERVIEWER** | `techlead@recruitment.com` | `password123` | Xem ứng viên được phân công, chấm điểm phiếu phỏng vấn |
| **CANDIDATE** | `candidate@example.com` | `password123` | Quản lý CV, nộp hồ sơ, xem timeline tiến độ, tham gia Meet |

---

## 🚀 4. Hướng dẫn Khởi chạy Hệ thống

### Bước 1: Khởi động Hạ tầng Docker (PostgreSQL, Redis, MinIO, MailHog)
Mở terminal tại thư mục gốc của dự án (`c:\Recruitment manage`):
```bash
docker-compose up -d
```
- **PostgreSQL**: `localhost:5432` (db: `recruitment_db`, user: `postgres`, pass: `postgrespassword`)
- **MinIO Console**: `http://localhost:9001` (user: `minioadmin`, pass: `minioadminpassword`)
- **MailHog UI**: `http://localhost:8025` (Xem các email thông báo mời phỏng vấn & tiếp nhận hồ sơ)

---

### Bước 2: Chạy Backend Spring Boot
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080/api/v1`
- Swagger UI tài liệu tương tác: `http://localhost:8080/api/v1/swagger-ui.html`

---

### Bước 3: Chạy Frontend React (Vite)
```bash
cd frontend
npm install
npm run dev
```
- Mở trình duyệt tại: `http://localhost:5173`
- Trên thanh điều hướng trên cùng, bạn có thể bấm chuyển nhanh giữa **1. Public Website**, **2. Candidate Portal**, và **3. Admin / ATS Portal**, hoặc dùng menu chọn vai trò trực tiếp để trải nghiệm toàn diện hệ thống.

