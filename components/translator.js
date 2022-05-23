const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const AM_BR = "american-to-british";
const BR_AM = "british-to-american";

class Translator {
  /* Initialize the regexp that will be used to replace words*/
  constructor() {
    this.re = /\d{1,2}[:|.]\d{2}|[A-Za-z]+[.]|\b[A-Za-z]+\b|\n/gm;
  }

  /* Handles dates and titles translation but passes dictionary
  search translation to the other functions */
  translate(text, locale) {
    let isTranslated = false; // Set to true if translation is done

    const newText = text.replace(this.re, (match) => {
      if (match === "\n") {
        return "<br />"; // New lines should be handled correctly
      } else if (/[A-Za-z]+[.]/.test(match)) {
        // titles
        if (locale === AM_BR) {
          if (americanToBritishTitles[match.toLowerCase()]) {
            isTranslated = true;
            let result = americanToBritishTitles[match.toLowerCase()];
            result = result[0].toUpperCase() + result.substring(1);
            return result;
          }
        }
        let result = this.searcher(match, locale);
        if (!result) return match;
        else {
          isTranslated = true;
          return result;
        }
      } else if (/\d{1,2}[:|.]\d{2}/.test(match)) {
        // dates
        const hhre = /\d{1,2}(?=[.]|:)/;
        const mmre = /(?<=[.]|:)\d{2}/;
        let hh = Number(match.match(hhre)[0]);
        let mm = Number(match.match(mmre)[0]);
        if (!(hh >= 0 && hh <= 23)) {
          return match;
        }
        if (!(mm >= 0 && mm <= 59)) {
          return match;
        }
        if (locale === AM_BR) {
          if (match.indexOf(":") >= 0) {
            isTranslated = true;
            return match.replace(":", ".");
          }
        } else if (locale === BR_AM) {
          if (match.indexOf(".") >= 0) {
            isTranslated = true;
            return match.replace(".", ":");
          }
        } // End dates
      } else {
        let result = this.searcher(match, locale);
        if (!result) return match;
        else {
          isTranslated = true;
          return result;
        }
      }
    });
    return newText;
  }
  searcher(word, locale) {
    let translatedWord = "";
    switch (locale) {
      case AM_BR:
        translatedWord =
          americanOnly[word] || americanToBritishSpelling[word] || "";
        break;
      case BR_AM:

      default:
        return "";
    }
  }
}

module.exports = Translator;
