export type UserRole = 
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_HR_MANAGER'
  | 'ROLE_RECRUITER'
  | 'ROLE_INTERVIEWER'
  | 'ROLE_CANDIDATE';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
}

export type JobStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'CLOSED';

export interface Job {
  id: number;
  title: string;
  slug: string;
  department: Department;
  jobLevel: string; // Intern, Fresher, Junior, Middle, Senior, Lead
  employmentType: string; // Full-time, Part-time, Remote, Hybrid
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable?: boolean;
  experienceYears?: string;
  quantity: number;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string;
  status: JobStatus;
  createdAt: string;
}

export interface CandidateSkill {
  id: number;
  skillName: string;
  proficiencyLevel: string;
}

export interface CandidateExperience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface CandidateEducation {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear?: number;
}

export interface Candidate {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  headline?: string;
  summary?: string;
  currentCvUrl?: string;
  skills: CandidateSkill[];
  experiences: CandidateExperience[];
  educations: CandidateEducation[];
}

export type ApplicationStatus = 
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'ASSESSMENT'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  id: number;
  candidate: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    headline?: string;
  };
  job: {
    id: number;
    title: string;
    department: {
      name: string;
      code: string;
    };
    location: string;
  };
  resumeUrl: string;
  resumeFilename?: string;
  coverLetter?: string;
  expectedSalary?: number;
  availableDate?: string;
  currentStatus: ApplicationStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationHistory {
  id: number;
  fromStatus?: ApplicationStatus;
  toStatus: ApplicationStatus;
  note?: string;
  rejectionReason?: string;
  changedByName?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  scheduledAt: string;
  durationMinutes: number;
  interviewType: 'ONLINE' | 'OFFLINE';
  locationOrLink: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  evaluation?: InterviewEvaluation;
}

export interface InterviewEvaluation {
  id?: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  teamworkScore: number;
  generalNotes: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
}

export interface DashboardStats {
  totalPublishedJobs: number;
  totalCandidates: number;
  totalApplications: number;
  totalInterviews: number;
  totalHired: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  conversionRate: number;
}

