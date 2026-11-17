export const businessRules = {
  upload: {
    maxCvSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedCvExtensions: ['.pdf', '.doc', '.docx'],
    maxAvatarSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedAvatarExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  interview: {
    defaultDurationMinutes: 60,
    minTechScore: 1,
    maxTechScore: 10,
    passingScoreThreshold: 7,
  },
  employee: {
    codePrefix: 'EMP-',
    probationDurationMonths: 2,
    defaultWorkingHoursPerDay: 8,
  },
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
} as const;

export default businessRules;
