const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();

const samples = require("./sample.js");
const locales = {
  AM_BR: "american-to-british",
  BR_AM: "british-to-american",
};

suite("Unit Tests", () => {
  suite("American to British", () => {
    run(samples, locales.AM_BR);
  });
  suite("British to American", () => {
    run(samples, locales.BR_AM);
  });
});

/* Generically test translation based on locale given */
function run(samples, locale) {
  samples.forEach((sentence) => {
    if (sentence.locale === locale) {
      let text = sentence.text;
      let expected = sentence.translation;
      test(text, () => {
        assert.equal(translator.translate(text, locale), expected);
      });
    }
  });
}
