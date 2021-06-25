module.exports = {
  handleError: function (err, req, res, next) {
    if (err && err.statusCode && err.message && err.message.match(/\[[0-9]{3}\]/)) {
      return res.status(err.statusCode).send(err.message)
    }
    res.lambdaError = err
    next(err)
  },
  asyncWrapper: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
