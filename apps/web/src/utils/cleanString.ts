export const cleanString = (str: string) => {
  return str.trim().toLowerCase();
};

export const verifyEmail = (email: string) => {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
