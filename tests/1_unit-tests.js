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
  suite("Highlight translation", () => {
    runHighlight(samples);
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

/* Test whether the translated text is highlighted (given
    a class name of highlight), wrapped in a <span> */
function runHighlight(samples) {
  /* Just the first two in both translation cases */
  const am_br = samples
    .filter((data) => data.locale === locales.AM_BR)
    .slice(0, 2);
  const br_am = samples
    .filter((data) => data.locale === locales.BR_AM)
    .slice(0, 2);
  const both = am_br.concat(br_am);

  both.forEach((sentence) => {
    const { text, locale } = sentence;
    test(`Highlight translation in ${text}`, () => {
      assert.match(
        translator.translate(text, locale),
        /<span class="highlight">\w+<\/span>/gim
      );
    });
  });
}
