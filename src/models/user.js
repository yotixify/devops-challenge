const db = require('../db')

class User {
  static async getById (id) {
    const sql = db.getConnection()
    const [user] = await sql`select * from users where id = ${id}`
    if (!user) return // not found
    const u = new User()
    return Object.assign(u, { ...user })
  }

  static async get () {
    const sql = db.getConnection()
    const users = await sql`select * from users`
    return users.map(u => Object.assign(new User(), { ...u }))
  }
}

module.exports = User
