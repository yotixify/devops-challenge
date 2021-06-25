const User = require('./models/user')
const TypedError = require('error/typed')

const ValidationError = TypedError({
  type: 'ValidationError:users',
  message: '[400] requires {missing}',
  statusCode: 400
})

const NotFoundError = TypedError({
  type: 'NotFoundError:users',
  message: '[404] user not found',
  statusCode: 404
})

async function get () {
  return User.get()
}

async function getById (userId) {
  if (!userId) throw ValidationError({ missing: 'userId' })
  const user = await User.getById(userId)
  if (!user) throw NotFoundError()
  return user
}

module.exports = {
  getById,
  get
}
