module.exports = () => {
  return (req, res, next) => {
    if(!req.session.passport) {
      res.sendStatus(400);
      return;
    }
    next();
  }
}
