const Translator = require("./translator.js");
const translator = new Translator();
const VALID_LOCALES = ["american-to-british", "british-to-american"];

const translate = (req, res) => {
  const { text, locale } = req.body;
  if (text === undefined || locale === undefined) {
    throw new Error("Required field(s) missing");
  }
  if (text.length === 0) {
    throw new Error("No text to translate");
  }
  if (VALID_LOCALES.indexOf(locale) < 0) {
    throw new Error("Invalid value for locale field");
  }

  const translation = translator.translate(text, locale);
  res.json({ text, translation });
};
module.exports = translate;
