const URL = require('url').URL
const path = require('path')
const Knex = require('knex')
const postgres = require('postgres')

let sqlInstance

/**
 * Create a database if it does not exist. This function takes connection string
 * assuming that it includes target database name, then parses out database name,
 * checkes the pg_database to see if the database exists and returns if it does, or
 * creates it, if it does not.
 * @param {String} conn - postgres connection string like postgres://test:test@db/testdb
 * @returns
 */
function createIfNotExists (conn) {
  if (!conn) throw new Error('createIfNotExists error: no connection string')
  const urlParts = new URL(conn)
  const dbName = path.basename(urlParts.pathname)
  const regExp = new RegExp(dbName + '$')
  const postgresConnStr = conn.replace(regExp, 'postgres') // swap to default db
  const connectionDbCreate = {
    client: 'pg',
    connection: postgresConnStr,
    searchPath: 'public'
  }
  const knexDbCreate = Knex(connectionDbCreate)
  return knexDbCreate.raw('SELECT * FROM pg_database WHERE datname = ?', [dbName])
    .then((result) => {
      if (result && result.rows && result.rows.length) {
        return Promise.resolve()
      }
      return knexDbCreate.raw(`CREATE DATABASE ${dbName} WITH ENCODING = 'UTF-8' LC_CTYPE = 'en_US.utf8' LC_COLLATE = 'en_US.utf8' template = template0;`)
    })
    .then(() => {
      return knexDbCreate.destroy()
    })
}

/**
 * Ensures the database exists, then runs knex migrations
 * @param {String} conn - posgres connection string like postgres://test:test@db/testdb
 * @returns
 */
async function migrate (conn) {
  // default postgres database connection
  if (!conn) throw new Error('no connection string passed to migrate')
  const migrateKnex = Knex({
    client: 'pg',
    connection: conn,
    searchPath: 'public',
    acquireConnectionTimeout: 15000
  })
  await createIfNotExists(conn)
  const out = await migrateKnex.migrate.latest()
  console.log(out)
  return migrateKnex.destroy(conn)
}

async function down () {
  if (sqlInstance) await sqlInstance.end()
}

async function createConnection () {
  if (!process.env.DB_HOST) throw new Error('createConnection no DB_HOST env')
  if (!process.env.DB_USER) throw new Error('createConnection no DB_USER env')
  if (!process.env.DB_NAME) throw new Error('createConnection no DB_NAME env')
  if (!process.env.DB_PORT) throw new Error('createConnection no DB_PORT env')
  if (!process.env.DB_PASS) throw new Error('createConnection no DB_PASS env')

  const host = process.env.DB_HOST
  const port = process.env.DB_PORT
  const user = process.env.DB_USER
  const name = process.env.DB_NAME
  const pass = process.env.DB_PASS

  sqlInstance = postgres({
    host,
    username: user,
    password: pass,
    database: name,
    port,
    idle_timeout: 1000,
    connect_timeout: 5000,
    no_prepare: true,
    transform: {
      column: postgres.toCamel
    }
  })

  return sqlInstance
}

function getConnection () {
  if (!sqlInstance) throw new Error('postgres node client connection not initialized')
  return sqlInstance
}

module.exports = {
  createConnection,
  getConnection,
  migrate,
  down,
  createIfNotExists
}
