const router = require('express').Router()
const {db} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await db
      .from('users')
      // explicitly select only the id and email fields - even though users' passwords are encrypted, it won't help if we just send everything to anyone who asks!
      .select('id', 'email')
    res.json(users)
  } catch (err) {
    next(err)
  }
})
