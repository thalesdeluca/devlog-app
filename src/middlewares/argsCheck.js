module.exports = (...args) => {
  return (req, res, next) => {
    const user = req.body;
    for(arg of args) {
      if(!user.hasOwnProperty(arg)){
        res.sendStatus(400);
        return;
      }
    }
    next();
  }
}