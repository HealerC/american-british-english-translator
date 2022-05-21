const Translator = require("./translator.js");

const translate = (req, res) => {
  const translator = new Translator();
  res.json({ ...req.body });
};
module.exports = translate;
