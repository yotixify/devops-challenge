const db = require('../../src/db')
const api = require('../users')
const userService = require('../../src/users')

jest.mock('../../src/db')
jest.mock('../../src/users')

userService.getById.mockImplementation(async () => {})
userService.get.mockImplementation(async () => {})

describe('Test Users API', () => {
  describe('Routes', () => {
    it('get should return 200 with no event', async () => {
      await expect(api.handler()).resolves.toBe()
    })
    it('get should return 200', async () => {
      const out = await api.handler({
        httpMethod: 'GET',
        path: '/users/abc',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'fakeToken'
        }
      })
      expect(out.statusCode).toBe(200)
      expect(db.createConnection).toHaveBeenCalled()
      expect(userService.getById).toHaveBeenCalled()
    })
    it('get should return 200', async () => {
      const out = await api.handler({
        httpMethod: 'GET',
        path: '/users',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'fakeToken'
        }
      })
      expect(out.statusCode).toBe(200)
      expect(db.createConnection).toHaveBeenCalled()
      expect(userService.get).toHaveBeenCalled()
    })
  })
  describe('Errors', () => {
    it('get /users/abc should throw 500', async () => {
      const err = new Error('no')
      userService.getById.mockImplementation(async () => { throw err })
      await expect(() => {
        return api.handler({
          httpMethod: 'GET',
          path: '/users/abc',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'fakeToken'
          }
        })
      }).rejects.toThrow('no')
      expect(userService.getById).toHaveBeenCalled()
      expect(db.createConnection).toHaveBeenCalled()
      expect(db.down).toHaveBeenCalled()
    })
    it('get /users/abc should throw 404', async () => {
      const err = new Error('[500] no2')
      err.statusCode = 404
      userService.getById.mockImplementation(async () => { throw err })
      const res = await api.handler({
        httpMethod: 'GET',
        path: '/users/abc',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'fakeToken'
        }
      })
      expect(userService.getById).toHaveBeenCalled()
      expect(db.createConnection).toHaveBeenCalled()
      expect(res.statusCode).toBe(404)
      expect(db.down).toHaveBeenCalled()
    })
  })
})
