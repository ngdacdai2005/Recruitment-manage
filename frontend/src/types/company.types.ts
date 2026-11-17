export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  headquarters: string;
  website: string;
  foundedYear: number;
}

export const defaultCompanyInfo: CompanyInfo = {
  name: 'RecruitPro Enterprise',
  tagline: 'Leading Talent & Recruitment Solutions',
  description: 'Nền tảng quản trị tuyển dụng và thu hút nhân tài doanh nghiệp hàng đầu.',
  headquarters: 'Hà Nội, Việt Nam',
  website: 'https://recruitment.example.com',
  foundedYear: 2020,
};
