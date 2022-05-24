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

  /* First do a replace matching the regex initialized in the constructor
  then start translating the words between American and British English
  still using regex though with each word taking the Regexp */
  translate(text, locale) {
    /* Handle American to British translation of titles (e.g. Mr. -> Mr)
    Handle both translation of dates
    Add a <br /> for every \n so result is consistent with request text */
    let newText = text.replace(this.re, (match) => {
      if (match === "\n") {
        return "<br />";
      } else if (/[A-Za-z]+[.]/.test(match)) {
        // titles
        // For BR_AM titles, the total word translation will handle that
        if (locale === AM_BR) {
          if (americanToBritishTitles[match.toLowerCase()]) {
            let result = americanToBritishTitles[match.toLowerCase()];
            result = result[0].toUpperCase() + result.substring(1); // capitalize
            return `<span class="highlight">${result}</span>`;
          }
        }
        return match; // Not a title bro
      } else {
        /* It verifies they match a time text as well as 
        they are correct times (invalidates 24:10, 99:83) */
        const hhre = /\d{1,2}(?=[.]|:)/; // hour
        const mmre = /(?<=[.]|:)\d{2}/; // minute
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
            return `<span class="highlight">${match.replace(":", ".")}</span>`;
          }
        } else if (locale === BR_AM) {
          if (match.indexOf(".") >= 0) {
            return `<span class="highlight">${match.replace(".", ":")}</span>`;
          }
        }
        return match;
      } // End time
    }); // End time-linefeed replace

    /* Match and replace words in the sentence */
    switch (locale) {
      case AM_BR:
        const allAmerican = Object.assign(
          {},
          americanOnly,
          americanToBritishSpelling
        );
        for (let eachWord in allAmerican) {
          let regex = new RegExp(`(?<!\\S)${eachWord}(?=\\s|[.])`, "igm");
          newText = newText.replace(
            regex,
            `<span class="highlight">${allAmerican[eachWord]}</span>`
          ); // replaceAll() doesn't work for weird reasons
        }
        break;
      case BR_AM:
        /* First handle reverse translation of british
        to american spellings and titles  */
        const amBrWords = Object.assign(
          {},
          americanToBritishSpelling,
          americanToBritishTitles // Here we handle Br -> Am titles
        );

        const amKeys = Object.keys(amBrWords);
        amKeys.forEach((word) => {
          let brWord = amBrWords[word]; // Replace british word
          let regex = new RegExp(`(?<!\\S)${brWord}(?=\\s|[.])`, "igm");
          if (americanToBritishTitles[word]) {
            // capitalize
            word = word.charAt(0).toUpperCase() + word.substring(1);
          }
          newText = newText.replace(
            regex,
            `<span class="highlight">${word}</span>`
          );
        });

        /* Then handle words that are exclusively british (similar
          to case AM_BR above) */
        for (let eachWord in britishOnly) {
          let regex = new RegExp(`(?<!\\S)${eachWord}(?=\\s|[.])`, "igm");
          newText = newText.replace(
            regex,
            `<span class="highlight">${britishOnly[eachWord]}</span>`
          );
        }
        break;
      default:
    } // End switch
    return text === newText ? "Everything looks good to me!" : newText;
  }
}

module.exports = Translator;
