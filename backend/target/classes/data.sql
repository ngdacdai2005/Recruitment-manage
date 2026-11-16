-- Initial Seed Data for Recruitment Management System

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_SUPER_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_HR_MANAGER', 'Trưởng phòng nhân sự, duyệt tin & quản lý quy trình tuyển dụng'),
(3, 'ROLE_RECRUITER', 'Chuyên viên tuyển dụng, sàng lọc CV và điều phối ứng viên'),
(4, 'ROLE_INTERVIEWER', 'Người phỏng vấn chuyên môn, chấm điểm phỏng vấn'),
(5, 'ROLE_CANDIDATE', 'Ứng viên tìm kiếm việc làm và theo dõi hồ sơ')
ON CONFLICT (id) DO NOTHING;

-- 2. Users (Password: Admin@123 for all default accounts - BCrypt hashed: $2a$10$wN3rX7ZgMqmPz0nQ6yv8quK3Z3pT8v6sO5hY9mX1cR2eF4gH6jK7.)
-- BCrypt for "password123": $2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, is_active) VALUES
(1, 'admin@recruitment.com', '$2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK', 'Nguyễn Quản Trị', '0901234567', 1, TRUE),
(2, 'hr.manager@recruitment.com', '$2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK', 'Trần Thị Thu Hà (HR Manager)', '0912345678', 2, TRUE),
(3, 'recruiter@recruitment.com', '$2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK', 'Lê Tuyển Dụng', '0923456789', 3, TRUE),
(4, 'techlead@recruitment.com', '$2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK', 'Phạm Công Nghệ (Tech Lead)', '0934567890', 4, TRUE),
(5, 'candidate@example.com', '$2a$10$eAccYoNOHEqgkVE8aGY2Te3Lz6i0pWbLcD8f1sVf11GqX/9sXg6vK', 'Đỗ Văn Ứng Viên', '0945678901', 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Departments
INSERT INTO departments (id, name, code, description, manager_id, is_active) VALUES
(1, 'Công nghệ thông tin', 'IT', 'Phát triển phần mềm, hạ tầng kỹ thuật và AI', 4, TRUE),
(2, 'Tiếp thị & Truyền thông', 'MKT', 'Marketing, Branding và tăng trưởng khách hàng', 2, TRUE),
(3, 'Kinh doanh & Phát triển', 'SALES', 'Tìm kiếm khách hàng doanh nghiệp B2B và mở rộng thị trường', 2, TRUE),
(4, 'Nhân sự & Hành chính', 'HR', 'Tuyển dụng, đào tạo, văn hóa nội bộ và chế độ phúc lợi', 2, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Jobs
INSERT INTO jobs (id, department_id, title, slug, job_level, employment_type, location, salary_min, salary_max, is_salary_negotiable, experience_years, quantity, description, requirements, benefits, deadline, status, created_by) VALUES
(1, 1, 'Senior Java Backend Engineer (Spring Boot / Microservices)', 'senior-java-backend-engineer', 'Senior', 'Full-time', 'Hà Nội (Hybrid)', 30000000, 50000000, FALSE, '3-5 năm', 3, 
'Tham gia thiết kế và xây dựng các hệ thống Core Backend tải lớn với Spring Boot, PostgreSQL và Kafka. Tối ưu hóa hiệu năng, bảo mật và khả năng mở rộng của hệ thống.', 
'- Tối thiểu 3 năm kinh nghiệm lập trình Java, thành thạo Spring Boot, Spring Security, JPA/Hibernate.
- Nắm vững kiến trúc Microservices, Docker, Redis, Message Broker (Kafka/RabbitMQ).
- Tư duy Clean Architecture, CI/CD, viết Unit/Integration Tests tốt.', 
'- Mức lương hấp dẫn từ 30–50 triệu VNĐ + Thưởng dự án & tháng 13.
- Chế độ bảo hiểm sức khỏe cao cấp cho nhân viên và người thân.
- Review lương 2 lần/năm, làm việc hybrid 2 ngày WFH/tuần.', 
'2026-12-31', 'PUBLISHED', 2),

(2, 1, 'Frontend Developer (React / TypeScript / Next.js)', 'frontend-developer-react-ts', 'Middle', 'Full-time', 'Hà Nội / Hồ Chí Minh', 18000000, 30000000, FALSE, '2 năm', 2, 
'Xây dựng các giao diện web hiện đại, phản hồi nhanh (Responsive Web App) với React, TypeScript và Tailwind CSS. Phối hợp chặt chẽ với UI/UX Designer và Backend team.', 
'- Có ít nhất 2 năm kinh nghiệm ReactJS, TypeScript, Tailwind CSS.
- Hiểu sâu về React Hooks, State Management (Zustand/Redux Toolkit), RESTful API.
- Tinh thần trách nhiệm cao, tỉ mỉ về UI/UX và tối ưu trải nghiệm người dùng.', 
'- Môi trường làm việc trẻ trung, sáng tạo, trang bị Macbook Pro.
- Phụ cấp ăn trưa, gửi xe, du lịch thường niên hàng năm.', 
'2026-12-31', 'PUBLISHED', 2),

(3, 2, 'Senior Digital Marketing Specialist', 'senior-digital-marketing-specialist', 'Senior', 'Full-time', 'Hà Nội', 20000000, 35000000, FALSE, '3 năm', 1, 
'Lập kế hoạch và thực thi các chiến dịch Performance Marketing trên Meta Ads, Google Ads, TikTok Ads. Tối ưu chi phí CPA, CAC và ROI.', 
'- 3 năm kinh nghiệm chạy chiến dịch Performance ngân sách lớn.
- Kỹ năng phân tích số liệu với Google Analytics 4, Looker Studio.
- Sáng tạo nội dung và khả năng A/B testing liên tục.', 
'- Lương cứng 20-35 triệu + KPI thưởng hiệu quả chiến dịch không giới hạn.
- Cơ hội thăng tiến lên Marketing Lead trong vòng 1 năm.', 
'2026-12-31', 'PUBLISHED', 2),

(4, 1, 'DevOps / Cloud Platform Engineer (AWS / Kubernetes)', 'devops-cloud-platform-engineer', 'Middle', 'Full-time', 'Hà Nội', 25000000, 45000000, FALSE, '2-4 năm', 2, 
'Quản lý hạ tầng đám mây trên AWS, xây dựng pipeline CI/CD tự động, vận hành cụm Kubernetes (EKS) và giám sát hệ thống với Prometheus/Grafana.', 
'- Kinh nghiệm với Docker, Kubernetes, Terraform/Ansible.
- Quản trị Linux vững vàng, thành thạo CI/CD (GitHub Actions/GitLab CI).', 
'- Cơ hội làm việc trực tiếp với các chuyên gia cloud, tài trợ 100% chi phí thi chứng chỉ AWS/CKA.', 
'2026-12-31', 'PUBLISHED', 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Candidate Profile
INSERT INTO candidates (id, user_id, full_name, email, phone, address, headline, summary, current_cv_url) VALUES
(1, 5, 'Đỗ Văn Ứng Viên', 'candidate@example.com', '0945678901', 'Cầu Giấy, Hà Nội', 'Junior-Middle Java Backend Developer', 'Lập trình viên đam mê hệ sinh thái Java Spring Boot, có 2 năm kinh nghiệm thực chiến phát triển RESTful API và tích hợp cơ sở dữ liệu PostgreSQL.', 'https://storage.recruitment.com/cvs/sample-cv-dovanungvien.pdf')
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Application
INSERT INTO applications (id, candidate_id, job_id, resume_url, resume_filename, cover_letter, expected_salary, available_date, current_status) VALUES
(1, 1, 1, 'https://storage.recruitment.com/cvs/sample-cv-dovanungvien.pdf', 'CV_DoVanUngVien_JavaBackend.pdf', 'Tôi rất mong muốn được cống hiến và phát triển cùng đội ngũ kỹ sư tại công ty.', 25000000, '2026-12-01', 'INTERVIEW')
ON CONFLICT (id) DO NOTHING;

-- 7. Application History
INSERT INTO application_history (application_id, from_status, to_status, note, changed_by) VALUES
(1, NULL, 'APPLIED', 'Ứng viên gửi hồ sơ qua website', 5),
(1, 'APPLIED', 'SCREENING', 'HR Hà duyệt hồ sơ đạt tiêu chuẩn sơ loại', 2),
(1, 'SCREENING', 'INTERVIEW', 'Chuyển sang vòng phỏng vấn chuyên môn với Tech Lead', 3)
ON CONFLICT (id) DO NOTHING;

-- 8. Interview Schedule
INSERT INTO interviews (id, application_id, interviewer_id, scheduled_at, duration_minutes, interview_type, location_or_link, notes, status) VALUES
(1, 1, 4, '2026-11-20 14:00:00+07', 60, 'ONLINE', 'https://meet.google.com/abc-xyz-recruit', 'Phỏng vấn kỹ thuật: Java core, Spring Boot, SQL optimization, System Design cơ bản.', 'SCHEDULED')
ON CONFLICT (id) DO NOTHING;

