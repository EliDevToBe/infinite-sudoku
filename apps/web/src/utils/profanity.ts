import { Profanity } from "@2toad/profanity";

const profanity = new Profanity({
  languages: ["en", "fr", "es", "de", "it"],
  wholeWord: true,
});

export const hasProfanity = (str: string) => {
  return profanity.exists(str);
};
