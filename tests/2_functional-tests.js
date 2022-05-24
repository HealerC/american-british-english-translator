const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

/* Payload of the valid conversions as well as their
expected translation. Also present is the name of the test `name`
as in fcc  */
const validConversions = [
  {
    name: "Translation with text and locale fields",
    text: "Mangoes are my favorite fruit.",
    translation:
      'Mangoes are my <span class="highlight">favourite</span> fruit.',
    locale: "american-to-british",
  },
  {
    name: "Translation with text that needs no translation",
    text: "Mangoes are my favorite fruit.",
    translation: "Everything looks good to me!",
    locale: "british-to-american",
  },
];

/* Payload of the invalid conversions as well as their
expected errors. Also present is the name of the test `name`
as in fcc  */
const invalidConversions = [
  {
    name: "Translation with text and invalid locale field",
    error: "Invalid value for locale field",
    text: "Mangoes are my favorite fruit.",
    locale: "british-to-afghan",
  },
  {
    name: "Translation with missing text field",
    error: "Required field(s) missing",
    locale: "american-to-british",
  },
  {
    name: "Translation with empty text",
    error: "No text to translate",
    text: "",
    locale: "american-to-british",
  },
  {
    name: "Translation with missing locale field",
    error: "Required field(s) missing",
    text: "Mangoes are my favorite fruit.",
  },
];

suite("Functional Tests", () => {
  suite("Valid conversions", () => {
    run(validConversions);
  });
  suite("Invalid conversions", () => {
    runInvalids(invalidConversions);
  });
});

/* Test for each translation request by constructing
the test from the object. Likewise same for runInvalids() */
function run(validList) {
  validList.forEach((sentence) => {
    const { name, text, locale, translation: expected } = sentence;
    const payload = { text, locale };
    test(name, (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send(payload)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.text, text);
          assert.equal(res.body.translation, expected);
          done();
        });
    });
  });
}

function runInvalids(invalidList) {
  invalidList.forEach((sentence) => {
    const { name, text, locale, error: expected } = sentence;
    const payload = { text, locale };
    test(name, (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send(payload)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isUndefined(res.body.translation);
          assert.equal(res.body.error, expected);
          done();
        });
    });
  });
}
