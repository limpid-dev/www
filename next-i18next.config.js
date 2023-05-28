module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "kz"],
  },
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',
};