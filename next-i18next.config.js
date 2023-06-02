module.exports = {
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "kz"],
    localeDetection: false,
  },
  localePath:
    typeof window === 'undefined'
      ? require("path").resolve("./public/locales")
      : '/locales',
};
