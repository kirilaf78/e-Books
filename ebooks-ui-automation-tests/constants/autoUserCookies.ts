export const autoUserDetected = {
  name: "auto_user_detected",
  value: "true",
  url: process.env.EBOOKS_BASEURL
};

export const autoUserUILanguage = (lang: string) => {
  return {
    name: "translation_language_key",
    value: lang
  };
};
