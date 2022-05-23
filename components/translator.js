const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const AM_BR = "american-to-british";
const BR_AM = "british-to-american";

class Translator {
  /* Initialize the regexp that will be used to replace words*/
  constructor() {
    this.re = /\d{1,2}[:|.]\d{2}|[A-Za-z]+[.]|\n/gm;
    // Matching just the date, text with dot (e.g. title) and line feed
  }

  translate(text, locale) {
    let newText = text.replace(this.re, (match) => {
      if (match === "\n") {
        return "<br />";
      } else if (/[A-Za-z]+[.]/.test(match)) {
        // titles
        if (locale === AM_BR) {
          if (americanToBritishTitles[match.toLowerCase()]) {
            let result = americanToBritishTitles[match.toLowerCase()];
            result = result[0].toUpperCase() + result.substring(1);
            return result;
          }
        }
        return match;
      } else {
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
            return match.replace(":", ".");
          }
        } else if (locale === BR_AM) {
          if (match.indexOf(".") >= 0) {
            return match.replace(".", ":");
          }
        }
        return match;
      } // End dates
    }); // End date-linefeed replace

    switch (locale) {
      case AM_BR:
        const allAmerican = Object.assign(
          {},
          americanOnly,
          americanToBritishSpelling
        );
        for (let eachWord in allAmerican) {
          let regex = new RegExp(eachWord, "igm");
          newText = newText.replace(regex, allAmerican[eachWord]); // replaceAll() doesn't work
        }
        break;
      case BR_AM:

      default:
    }
    return newText;
  }
}

module.exports = Translator;
