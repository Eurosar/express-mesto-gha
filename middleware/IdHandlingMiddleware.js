const idHandler = (req, res, next) => {
  req.user = {
    _id: '62c60d7e9ee60e39f7b64774',
  };
  next();
};

module.exports = idHandler;
