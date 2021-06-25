
const Knex = require('knex')
const postgres = require('postgres')

jest.mock('knex')
jest.mock('postgres')

const db = require('../db')

describe('test db', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('createConnection', () => {
    it('should succeed', async () => {
      process.env.DB_HOST = 'test'
      process.env.DB_PORT = 'test'
      process.env.DB_USER = 'test'
      process.env.DB_NAME = 'test'
      process.env.DB_PASS = 'test'
      const mock = jest.fn()
      postgres.mockImplementation(mock)
      db.createConnection()
      expect(mock).toHaveBeenCalled()
    })
  })
  describe('test down', () => {
    it('should succeed', async () => {
      process.env.DB_HOST = 'test'
      process.env.DB_PORT = 'test'
      process.env.DB_USER = 'test'
      process.env.DB_NAME = 'test'
      process.env.DB_PASS = 'test'
      const end = jest.fn()
      postgres.mockImplementation(() => {
        return { end }
      })
      db.createConnection()
      db.getConnection()
      await db.down()
      expect(end).toHaveBeenCalled()
    })
    it('should not call', async () => {
      process.env.DB_HOST = 'test'
      process.env.DB_PORT = 'test'
      process.env.DB_USER = 'test'
      process.env.DB_NAME = 'test'
      process.env.DB_PASS = 'test'
      const end = jest.fn()
      postgres.mockImplementation(() => {
        return { end }
      })
      await db.down()
      expect(end).not.toHaveBeenCalled()
    })
  })
  describe('test createIfNotExists', () => {
    it('no connection string should error', () => {
      Knex.mockImplementation(() => {
        return { connection: '' }
      })
      expect(() => {
        db.createIfNotExists()
      }).toThrow()
    })
    it('should create new db if it does not exist', async () => {
      const raw = jest.fn(async () => {})
      const destroy = jest.fn()
      Knex.mockImplementation(() => {
        return { connection: '', raw, destroy }
      })
      const conn = 'postgres://test@test/testdb'
      await db.createIfNotExists(conn)
      expect(raw).toHaveBeenCalledTimes(2)
      expect(destroy).toHaveBeenCalledTimes(1)
    })
    it('should not create if exist', async () => {
      const raw = jest.fn(async () => {
        return {
          rows: ['hi']
        }
      })
      const destroy = jest.fn()
      Knex.mockImplementation(() => {
        return { connection: '', raw, destroy }
      })
      const conn = 'postgres://test@test/testdb'
      await db.createIfNotExists(conn)
      expect(raw).toHaveBeenCalledTimes(1)
      expect(destroy).toHaveBeenCalledTimes(1)
    })
  })
  describe('test migrate', () => {
    it('no connection string should error', () => {
      expect(db.migrate()).rejects.toThrow('no connection string passed to migrate')
    })
    it('should error running migrate', () => {
      const raw = jest.fn(async () => {
        return { rows: [] }
      })
      const destroy = jest.fn()
      const migrate = jest.fn(async () => { throw new Error('ouch') })
      Knex.mockImplementation(() => {
        return { connection: '', raw, destroy, migrate }
      })
      const conn = 'postgres://test@test/testdb'
      expect(db.migrate(conn)).rejects.toThrow()
    })
    it('should run migrate with no migrations', async () => {
      console.log = jest.fn()
      const raw = jest.fn(async () => {
        return { rows: [] }
      })
      const destroy = jest.fn()
      const latest = jest.fn(async () => {})
      Knex.mockImplementation(() => {
        return { connection: '', raw, destroy, migrate: { latest } }
      })
      const conn = 'postgres://test@test/testdb'
      await db.migrate(conn)
      expect(raw).toHaveBeenCalledTimes(2)
      expect(destroy).toHaveBeenCalled()
      expect(latest).toHaveBeenCalled()
    })
    it('should run migrate with migrations', async () => {
      console.log = jest.fn()
      const raw = jest.fn(async () => {
        return { rows: [] }
      })
      const destroy = jest.fn()
      const latest = jest.fn(async () => {
        return [1, 'test.js']
      })
      Knex.mockImplementation(() => {
        return { connection: '', raw, destroy, migrate: { latest } }
      })
      const conn = 'postgres://test@test/testdb'
      await db.migrate(conn)
      expect(raw).toHaveBeenCalledTimes(2)
      expect(destroy).toHaveBeenCalled()
      expect(latest).toHaveBeenCalled()
    })
  })
})
