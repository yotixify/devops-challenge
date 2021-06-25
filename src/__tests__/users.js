const service = require('../users')

const User = require('../models/user')

jest.mock('../models/user')

console.log = jest.fn()

const uuid = '71ac6c30-d5db-4d56-9e19-8dbb04a62369'

describe('src/users', () => {
  describe('getById fn', () => {
    it('no params should reject', () => {
      expect(service.getById()).rejects.toThrow()
    })
    it('should return 404 if user not found', async () => {
      User.getById.mockImplementation(async () => {})
      await expect(service.getById(uuid, 'fakeSecret')).rejects.toThrow('[404] user not found')
    })
    it('should return user', async () => {
      const mockUser = {
        id: 'a',
        fname: 'bob'
      }
      User.getById.mockImplementation(async () => mockUser)
      const u = await service.getById(uuid)
      expect(User.getById).toHaveBeenCalledTimes(1)
      expect(u.id).toBe('a')
      expect(u.fname).toBe('bob')
    })
  })
  describe('get fn', () => {
    it('should return', async () => {
      User.getById.mockImplementation(async () => {
        return {
          id: 'abc',
          isAdmin: true
        }
      })
      await service.get(uuid)
      expect(User.get).toHaveBeenCalled()
    })
  })
})
