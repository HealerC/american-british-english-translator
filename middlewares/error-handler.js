const errorHandler = (err, req, res, next) => {
  return res.json({ error: err.message });
};
module.exports = errorHandler;
