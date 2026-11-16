import { Department, Job, Application, Interview, DashboardStats, User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@recruitment.com',
    fullName: 'Nguyễn Quản Trị (Super Admin)',
    role: 'ROLE_SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    email: 'hr.manager@recruitment.com',
    fullName: 'Trần Thị Thu Hà (HR Manager)',
    role: 'ROLE_HR_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    email: 'recruiter@recruitment.com',
    fullName: 'Lê Tuyển Dụng (Recruiter)',
    role: 'ROLE_RECRUITER',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    email: 'techlead@recruitment.com',
    fullName: 'Phạm Công Nghệ (Interviewer)',
    role: 'ROLE_INTERVIEWER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    email: 'candidate@example.com',
    fullName: 'Đỗ Văn Ứng Viên (Candidate)',
    phone: '0945678901',
    role: 'ROLE_CANDIDATE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
];

export const mockDepartments: Department[] = [
  { id: 1, name: 'Công nghệ thông tin (IT)', code: 'IT', description: 'Phát triển phần mềm, hạ tầng kỹ thuật và AI' },
  { id: 2, name: 'Tiếp thị & Truyền thông (MKT)', code: 'MKT', description: 'Marketing, Branding và tăng trưởng khách hàng' },
  { id: 3, name: 'Kinh doanh & Phát triển', code: 'SALES', description: 'Mở rộng thị trường và đối tác chiến lược' },
  { id: 4, name: 'Nhân sự & Hành chính', code: 'HR', description: 'Tuyển dụng, đào tạo và phát triển văn hóa công ty' }
];

export const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Java Backend Engineer (Spring Boot / Microservices)',
    slug: 'senior-java-backend-engineer',
    department: mockDepartments[0],
    jobLevel: 'Senior',
    employmentType: 'Full-time',
    location: 'Hà Nội (Hybrid)',
    salaryMin: 30000000,
    salaryMax: 50000000,
    isSalaryNegotiable: false,
    experienceYears: '3-5 năm',
    quantity: 3,
    description: `Chúng tôi tìm kiếm Senior Java Backend Engineer xuất sắc tham gia vào đội ngũ kỹ thuật chủ chốt, trực tiếp xây dựng và tối ưu các hệ thống lõi chịu tải lớn hàng triệu giao dịch mỗi ngày.

Trách nhiệm chính:
- Thiết kế, xây dựng và duy trì các dịch vụ backend hiệu năng cao với Spring Boot, PostgreSQL và Kafka.
- Tham gia vào quá trình định hình kiến trúc microservices, tối ưu truy vấn database và caching với Redis.
- Mentor các thành viên junior, tham gia code review và xây dựng tiêu chuẩn kỹ thuật vững chắc.`,
    requirements: `- Tối thiểu 3-5 năm kinh nghiệm lập trình Java chuyên sâu, thành thạo Spring Boot, Spring Security, JPA/Hibernate.
- Nắm vững kiến trúc Microservices, RESTful API, Docker, Message Queue (Kafka/RabbitMQ).
- Kinh nghiệm tối ưu hóa cơ sở dữ liệu PostgreSQL, indexing, transaction management.
- Tư duy Clean Architecture, CI/CD, có khả năng viết Unit/Integration Tests chất lượng cao.`,
    benefits: `- Mức lương cạnh tranh từ 30.000.000 đến 50.000.000 VNĐ (net) + Thưởng dự án & tháng 13.
- Chế độ bảo hiểm sức khỏe VIP cho cá nhân và người thân.
- Làm việc Hybrid linh hoạt (2 ngày WFH/tuần), trang bị Macbook Pro M-series.
- Review lương định kỳ 2 lần/năm, ngân sách đào tạo và thi chứng chỉ quốc tế 20 triệu/năm.`,
    deadline: '2026-12-31',
    status: 'PUBLISHED',
    createdAt: '2026-11-01'
  },
  {
    id: 2,
    title: 'Middle Frontend Developer (React / TypeScript / Tailwind)',
    slug: 'frontend-developer-react-ts',
    department: mockDepartments[0],
    jobLevel: 'Middle',
    employmentType: 'Full-time',
    location: 'Hà Nội',
    salaryMin: 18000000,
    salaryMax: 30000000,
    isSalaryNegotiable: false,
    experienceYears: '2-3 năm',
    quantity: 2,
    description: `Phát triển giao diện web hiện đại, mượt mà và trực quan cho người dùng doanh nghiệp. Làm việc trực tiếp với đội ngũ Product Manager và UI/UX Designer.`,
    requirements: `- Tối thiểu 2 năm kinh nghiệm thực chiến với ReactJS, TypeScript, HTML5/CSS3.
- Thành thạo Tailwind CSS, State Management (Zustand/Redux Toolkit), RESTful API.
- Hiểu biết về Web Performance, Responsive Design và Cross-browser Compatibility.`,
    benefits: `- Mức lương: 18 - 30 triệu VNĐ.
- Ăn trưa miễn phí tại công ty, pantry ngập tràn bánh kẹo và cà phê máy.
- Chuyến du lịch Company Trip hàng năm 5 sao.`,
    deadline: '2026-12-30',
    status: 'PUBLISHED',
    createdAt: '2026-11-05'
  },
  {
    id: 3,
    title: 'Senior Digital Marketing Specialist (Performance)',
    slug: 'senior-digital-marketing-specialist',
    department: mockDepartments[1],
    jobLevel: 'Senior',
    employmentType: 'Full-time',
    location: 'Hà Nội',
    salaryMin: 20000000,
    salaryMax: 35000000,
    isSalaryNegotiable: false,
    experienceYears: '3 năm',
    quantity: 1,
    description: `Chịu trách nhiệm toàn diện việc lên kế hoạch và tối ưu hóa các chiến dịch quảng cáo đa kênh (Meta, Google, TikTok, LinkedIn) nhằm mang lại lượt đăng ký và chuyển đổi chất lượng.`,
    requirements: `- Tối thiểu 3 năm kinh nghiệm chạy chiến dịch Performance Marketing ngân sách từ 500tr/tháng trở lên.
- Sử dụng thành thạo Google Analytics 4, Tag Manager, Looker Studio.
- Nhạy bén với số liệu, tư duy A/B Testing liên tục.`,
    benefits: `- Thu nhập cạnh tranh: Lương cứng 20-35 triệu + Hoa hồng KPI hấp dẫn.
- Môi trường làm việc cởi mở, khuyến khích thử nghiệm ý tưởng mới.`,
    deadline: '2026-12-25',
    status: 'PUBLISHED',
    createdAt: '2026-11-08'
  },
  {
    id: 4,
    title: 'DevOps Platform Engineer (AWS / Kubernetes)',
    slug: 'devops-platform-engineer',
    department: mockDepartments[0],
    jobLevel: 'Middle',
    employmentType: 'Full-time',
    location: 'Hà Nội (Hybrid)',
    salaryMin: 25000000,
    salaryMax: 45000000,
    isSalaryNegotiable: false,
    experienceYears: '2-4 năm',
    quantity: 2,
    description: `Thiết kế và duy trì hạ tầng Cloud AWS, xây dựng pipeline CI/CD tự động, vận hành hệ thống container hóa với Kubernetes (EKS).`,
    requirements: `- Kinh nghiệm thực tế với AWS (EKS, RDS, S3, CloudFront), Terraform.
- Thành thạo Docker, Kubernetes, Prometheus, Grafana, ELK Stack.`,
    benefits: `- Lương: 25 - 45 triệu VNĐ.
- Tài trợ 100% chi phí thi chứng chỉ AWS, CKA/CKAD.`,
    deadline: '2026-12-20',
    status: 'PUBLISHED',
    createdAt: '2026-11-10'
  },
  {
    id: 5,
    title: 'UI/UX Product Designer (Figma / Design System)',
    slug: 'ui-ux-product-designer',
    department: mockDepartments[0],
    jobLevel: 'Junior',
    employmentType: 'Full-time',
    location: 'Hà Nội',
    salaryMin: 14000000,
    salaryMax: 22000000,
    isSalaryNegotiable: false,
    experienceYears: '1-2 năm',
    quantity: 1,
    description: `Nghiên cứu hành vi người dùng, thiết kế wireframe, prototype và hoàn thiện Design System cho các sản phẩm web và mobile app.`,
    requirements: `- Thành thạo Figma, Auto-layout, Variants, Component Sets.
- Có portfolio thể hiện quy trình tư duy thiết kế bài bản.`,
    benefits: `- Lương 14 - 22 triệu VNĐ. Cơ hội thăng tiến lên Senior Product Designer.`,
    deadline: '2026-12-31',
    status: 'DRAFT',
    createdAt: '2026-11-12'
  }
];

export const mockApplications: Application[] = [
  {
    id: 1,
    candidate: {
      id: 1,
      fullName: 'Đỗ Văn Ứng Viên',
      email: 'candidate@example.com',
      phone: '0945678901',
      headline: 'Junior-Middle Java Backend Developer'
    },
    job: {
      id: 1,
      title: 'Senior Java Backend Engineer (Spring Boot / Microservices)',
      department: { name: 'Công nghệ thông tin (IT)', code: 'IT' },
      location: 'Hà Nội (Hybrid)'
    },
    resumeUrl: 'https://storage.recruitment.com/cvs/CV_DoVanUngVien.pdf',
    resumeFilename: 'CV_DoVanUngVien_Backend.pdf',
    coverLetter: 'Tôi có hơn 2 năm kinh nghiệm với Spring Boot, REST API và mong muốn đóng góp cho các hệ thống lớn của công ty.',
    expectedSalary: 25000000,
    availableDate: '2026-12-01',
    currentStatus: 'INTERVIEW',
    createdAt: '2026-11-10 09:30',
    updatedAt: '2026-11-14 15:00'
  },
  {
    id: 2,
    candidate: {
      id: 2,
      fullName: 'Nguyễn Mai Anh',
      email: 'maianh.nguyen@gmail.com',
      phone: '0912345602',
      headline: 'Frontend React & TypeScript Specialist'
    },
    job: {
      id: 2,
      title: 'Middle Frontend Developer (React / TypeScript / Tailwind)',
      department: { name: 'Công nghệ thông tin (IT)', code: 'IT' },
      location: 'Hà Nội'
    },
    resumeUrl: 'https://storage.recruitment.com/cvs/CV_NguyenMaiAnh.pdf',
    resumeFilename: 'NguyenMaiAnh_Frontend_CV.pdf',
    coverLetter: 'Tôi yêu thích việc tối ưu trải nghiệm người dùng và có kinh nghiệm xây dựng Design System với Tailwind.',
    expectedSalary: 22000000,
    availableDate: '2026-11-20',
    currentStatus: 'OFFER',
    createdAt: '2026-11-06 14:15',
    updatedAt: '2026-11-15 11:20'
  },
  {
    id: 3,
    candidate: {
      id: 3,
      fullName: 'Hoàng Quốc Bảo',
      email: 'bao.hoang@techcorp.vn',
      phone: '0988776655',
      headline: 'Senior Cloud Platform Engineer'
    },
    job: {
      id: 4,
      title: 'DevOps Platform Engineer (AWS / Kubernetes)',
      department: { name: 'Công nghệ thông tin (IT)', code: 'IT' },
      location: 'Hà Nội (Hybrid)'
    },
    resumeUrl: 'https://storage.recruitment.com/cvs/CV_HoangQuocBao.pdf',
    resumeFilename: 'HoangQuocBao_DevOps.pdf',
    coverLetter: 'Chứng chỉ CKA, AWS Solutions Architect Associate, 3 năm vận hành cụm EKS thực tế.',
    expectedSalary: 40000000,
    availableDate: '2026-12-15',
    currentStatus: 'HIRED',
    createdAt: '2026-11-02 10:00',
    updatedAt: '2026-11-13 16:45'
  },
  {
    id: 4,
    candidate: {
      id: 4,
      fullName: 'Vũ Thị Minh Hạnh',
      email: 'minhhanh.mkt@gmail.com',
      phone: '0933221100',
      headline: 'Performance Marketing Manager'
    },
    job: {
      id: 3,
      title: 'Senior Digital Marketing Specialist (Performance)',
      department: { name: 'Tiếp thị & Truyền thông (MKT)', code: 'MKT' },
      location: 'Hà Nội'
    },
    resumeUrl: 'https://storage.recruitment.com/cvs/CV_VuThiMinhHanh.pdf',
    resumeFilename: 'VuThiMinhHanh_Marketing.pdf',
    coverLetter: 'Kinh nghiệm quản lý ngân sách quảng cáo hơn 1 tỉ/tháng cho các sản phẩm SaaS B2B.',
    expectedSalary: 30000000,
    availableDate: '2026-12-01',
    currentStatus: 'SCREENING',
    createdAt: '2026-11-12 11:00',
    updatedAt: '2026-11-14 09:30'
  },
  {
    id: 5,
    candidate: {
      id: 5,
      fullName: 'Trịnh Tiến Dũng',
      email: 'tiendung.dev@gmail.com',
      phone: '0977889900',
      headline: 'Fresher Java Backend Developer'
    },
    job: {
      id: 1,
      title: 'Senior Java Backend Engineer (Spring Boot / Microservices)',
      department: { name: 'Công nghệ thông tin (IT)', code: 'IT' },
      location: 'Hà Nội (Hybrid)'
    },
    resumeUrl: 'https://storage.recruitment.com/cvs/CV_TrinhTienDung.pdf',
    resumeFilename: 'CV_TrinhTienDung.pdf',
    coverLetter: 'Ứng viên mới tốt nghiệp có đam mê lập trình Java.',
    expectedSalary: 12000000,
    availableDate: '2026-11-20',
    currentStatus: 'REJECTED',
    rejectionReason: 'Vị trí hiện tại yêu cầu tối thiểu 3 năm kinh nghiệm thiết kế Microservices. Đã lưu hồ sơ ứng viên vào Talent Pool cho các đợt tuyển Fresher tiếp theo.',
    createdAt: '2026-11-09 16:30',
    updatedAt: '2026-11-11 14:00'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: 1,
    applicationId: 1,
    candidateName: 'Đỗ Văn Ứng Viên',
    jobTitle: 'Senior Java Backend Engineer',
    interviewerName: 'Phạm Công Nghệ (Tech Lead)',
    scheduledAt: '2026-11-20T14:00:00',
    durationMinutes: 60,
    interviewType: 'ONLINE',
    locationOrLink: 'https://meet.google.com/abc-xyz-recruit',
    notes: 'Phỏng vấn kỹ thuật: Java core, Spring Boot, SQL optimization, System Design cơ bản.',
    status: 'SCHEDULED'
  },
  {
    id: 2,
    applicationId: 2,
    candidateName: 'Nguyễn Mai Anh',
    jobTitle: 'Middle Frontend Developer',
    interviewerName: 'Trần Thị Thu Hà (HR Manager)',
    scheduledAt: '2026-11-12T10:00:00',
    durationMinutes: 45,
    interviewType: 'ONLINE',
    locationOrLink: 'https://meet.google.com/mkt-front-interview',
    notes: 'Trao đổi về văn hóa công ty, định hướng phát triển và chế độ đãi ngộ.',
    status: 'COMPLETED',
    evaluation: {
      id: 1,
      technicalScore: 9,
      communicationScore: 9,
      problemSolvingScore: 8,
      teamworkScore: 10,
      generalNotes: 'Ứng viên giao tiếp tự tin, có tư duy thẩm mỹ cao và tinh thần làm việc nhóm rất tốt. Đề xuất gửi Offer.',
      result: 'PASS'
    }
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPublishedJobs: 4,
  totalCandidates: 28,
  totalApplications: 45,
  totalInterviews: 8,
  totalHired: 5,
  statusBreakdown: {
    APPLIED: 12,
    SCREENING: 10,
    INTERVIEW: 8,
    ASSESSMENT: 4,
    OFFER: 3,
    HIRED: 5,
    REJECTED: 3,
    WITHDRAWN: 0
  },
  conversionRate: 11.1
};

