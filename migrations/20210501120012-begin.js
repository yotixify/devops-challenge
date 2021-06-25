exports.up = async function (knex) {
  await knex.schema.createTable('users', function (table) {
    table.uuid('id').primary()
    table.string('fullname', 100)
    table.string('fname', 50).notNullable()
    table.string('lname', 50).notNullable()
    table.string('email', 150).notNullable()
    table.timestamp('created_at').defaultTo(knex.raw('(now() at time zone \'utc\')'))
    table.timestamp('updated_at').defaultTo(knex.raw('(now() at time zone \'utc\')'))
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
}
