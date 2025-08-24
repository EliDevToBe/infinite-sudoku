import { profanity } from "./profanity";

export const normalize = (str: string) => {
  return str.trim().toLowerCase();
};

export const verifyEmail = (email: string) => {
  return email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
};

export const verifyPseudo = (pseudo: string) => {
  return pseudo.match(/^[a-zA-Z0-9]+$/);
};

export const hasProfanity = (str: string) => {
  return profanity.exists(str);
};
