module.exports = {
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "kz", "en"],
    localeDetection: false,
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
