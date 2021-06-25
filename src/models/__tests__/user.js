const db = require('../../../src/db')
const User = require('../user')

console.log = jest.fn()

describe('Test User', function () {
  let sql
  const testUser = {
    id: '71ac6c30-d5db-4d56-9e19-8dbb04a62369',
    fname: 'Larry',
    lname: 'Jounce',
    fullname: 'Larry Jounce',
    email: 'larry@jounce.com'
  }
  beforeAll(async () => {
    db.createConnection()
    sql = db.getConnection()
    await sql`delete from users`
    await sql`insert into users ${sql(testUser, 'id', 'fname', 'lname', 'fullname', 'email')}`
  })
  afterAll(async () => {
    await sql`delete from users`
    await db.down()
  })
  describe('getById', function () {
    it('should get User', async () => {
      const result = await User.getById(testUser.id)
      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty('id', testUser.id)
      expect(result).toHaveProperty('fname', testUser.fname)
      expect(result).toHaveProperty('lname', testUser.lname)
    })
    it('should not find User', async () => {
      const result = await User.getById('71ac6c30-d5db-4d56-9e19-8dbb04a62370')
      expect(result).toBe(undefined)
    })
  })
  describe('get', function () {
    it('should get Users', async () => {
      const result = await User.get()
      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toBeInstanceOf(User)
      expect(result[0]).toHaveProperty('id', testUser.id)
      expect(result[0]).toHaveProperty('fname', testUser.fname)
      expect(result[0]).toHaveProperty('lname', testUser.lname)
    })
  })
})
