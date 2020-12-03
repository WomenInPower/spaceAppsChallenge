const crypto = require('crypto')
const db = require('../db')

const User = db.schema.createTable('users', function (table) {
  table.increments('id').primary()
  table.string('firstName').notNullable()
  table.string('lastName').notNullable()
  table.unique('email').notNullable()
  table.string('password')
  table.string('salt')
  table.string('googleId')
  table.timestamps(true, true)
})

module.exports = User

//   password: {
//     type: Sequelize.STRING,
//       // Making `.password` act like a func hides it when serializing to JSON.
//       // This is a hack to get around Sequelize's lack of a "private" option.
//       get() {
//       return () => this.getDataValue('password')
//     },
//   },
//   salt: {
//     type: Sequelize.STRING,
//       // Making `.salt` act like a function hides it when serializing to JSON.
//       // This is a hack to get around Sequelize's lack of a "private" option.
//       get() {
//       return () => this.getDataValue('salt')
//     },
//   },

/**
 * instanceMethods
 */
// User.prototype.correctPassword = function (candidatePwd) {
//   return User.encryptPassword(candidatePwd, this.salt()) === this.password()
// }

/**
 * classMethods
 */
// console.log(User.client)
// User.client.QueryBuilder.prototype.generateSalt = function () {
//   return crypto.randomBytes(16).toString('base64')
// }

// .extend({

//   encryptPassword: function (plainText, salt) {
//     return crypto
//       .createHash('RSA-SHA256')
//       .update(plainText)
//       .update(salt)
//       .digest('hex')
//   }
// })

// /**
//  * hooks
//  */
// const setSaltAndPassword = (user) => {
//   if (user.changed('password')) {
//     user.salt = User.generateSalt()
//     user.password = User.encryptPassword(user.password(), user.salt())
//   }
// }

// User.beforeCreate(setSaltAndPassword)
// User.beforeUpdate(setSaltAndPassword)
// User.beforeBulkCreate((users) => {
//   users.forEach(setSaltAndPassword)
// })
