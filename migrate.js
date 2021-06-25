const db = require('./src/db')

module.exports = function migrate (connStr) {
  console.log('running migrations...')
  return db.migrate(connStr)
    .catch(err => {
      console.log(err)
    })
}
