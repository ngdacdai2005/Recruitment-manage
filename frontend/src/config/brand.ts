export const brandConfig = {
  name: 'RecruitPro Enterprise',
  shortName: 'RecruitPro',
  tagline: 'Hệ thống Quản trị Tuyển dụng ATS & Quản lý Nhân sự Doanh nghiệp',
  version: '2.5.0',
  copyright: `© ${new Date().getFullYear()} RecruitPro Enterprise. All rights reserved.`,
  company: {
    legalName: 'RecruitPro Corporation',
    headquarters: 'Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
    hotline: '0901 234 567',
    supportEmail: 'support@recruitpro.vn',
    hrEmail: 'hr@recruitpro.vn',
    website: 'https://recruitpro.vn',
  },
  colors: {
    primary: '#4f46e5', // Indigo-600
    primaryHover: '#4338ca', // Indigo-700
    secondary: '#0ea5e9', // Sky-500
    success: '#10b981', // Emerald-500
    warning: '#f59e0b', // Amber-500
    danger: '#ef4444', // Rose-500
    slate: '#0f172a', // Slate-900
  },
} as const;

export default brandConfig;
