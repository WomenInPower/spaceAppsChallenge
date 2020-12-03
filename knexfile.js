// Update with your config settings.
const pkg = require('./package.json')
const path = require('path')
const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://localhost:5432/${databaseName}`,
    migrations: {
      directory: path.join(__dirname, './server/db/models/migrations'),
      extention: 'sql',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, './server/db/models/migrations'),
    },
  },
}
