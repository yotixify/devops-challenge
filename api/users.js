const serverless = require('serverless-http')
const express = require('express')
const db = require('../src/db')
const middleware = require('../src/middleware')
const users = require('../src/users')

const app = express()
app.use((req, res, next) => {
  // Headers required for CORS support to work
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

/* ---- routes --- */

app.get('/users/:id', middleware.asyncWrapper(async (req, res, next) => {
  const data = await users.getById(req.params.id)
  return res.json(data)
}))

app.get('/users', middleware.asyncWrapper(async (req, res, next) => {
  const data = await users.get()
  return res.json(data)
}))

app.use(middleware.handleError)

const handler = serverless(app, {
  async response (res) {
    if (res.lambdaError) throw res.lambdaError
  }
})

module.exports.handler = async (event, context) => {
  if (!event || !Object.keys(event).length) return // warmer
  await db.createConnection()
  let res
  try {
    res = await handler(event, context)
  } finally {
    db.down()
  }
  return res
}
