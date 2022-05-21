"use strict";

const translate = require("../components/api.js");

module.exports = function (app) {
  app.route("/api/translate").post(translate);
};
