exports.up = function (knex) {
  return knex.schema.createTable('user', function (table) {
    table.increments('id').primary()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.string('email').notNullable()
    table.string('password')
    table.string('googleId')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('user')
}
