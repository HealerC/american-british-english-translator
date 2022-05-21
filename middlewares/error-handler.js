const errorHandler = (err, req, res, next) => {
  return res.json({ error: err.message }); // Some other error
};
module.exports = errorHandler;
