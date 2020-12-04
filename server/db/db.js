const pkg = require('../../package.json')
const path = require('path')
const knex = require('knex')
const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const db = knex({
  client: 'pg',
  connection:
    process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  migrations: {
    directory: path.join(__dirname, './server/db/models/migrations'),
  },
})

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
