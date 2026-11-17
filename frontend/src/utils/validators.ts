export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneVN = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const isValidCCCD = (cccd: string): boolean => {
  const cccdRegex = /^[0-9]{12}$/;
  return cccdRegex.test(cccd.trim());
};
