const router = require('express').Router()
const db = require('../db')
const bcrypt = require('bcrypt')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await db
      .from('user')
      // explicitly select only the id and email fields - even though users' passwords are encrypted, it won't help if we just send everything to anyone who asks!
      .select('id', 'email')
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const {email, password} = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await db('user').insert({email, hash}).returning('*')
    res.json(...user)
  } catch (err) {
    if (err) {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user = await db('user').first('*').where({email})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      const validPass = await bcrypt.compare(password, user.hash)
      if (validPass) {
        res.json(user)
      } else {
        console.log('Incorrect password for user:', email)
        res.status(401).send('Wrong username and/or password')
      }
    }
  } catch (err) {
    next(err)
  }
})
