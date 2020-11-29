const router = require('express').Router()
const User = require('../db/models/user')
const {google} = require('googleapis')
const {accessCalendar, url, authenticate} = require('./google')
module.exports = router

/*router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})*/

// redirect to google sign in page
router.get('/login', (req, res) => {
  res.redirect(url)
})

router.get('/google/callback', async (req, res, next) => {
  try {
    const {code} = req.query
    await authenticate(code, (err, res) => {
      if (err) {
        res.redirect('/login')
      } else {
        req.session.user = res
      }
    })
    res.redirect('/home')
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, (err) => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  const {user} = req.session
  if (user) {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      // eslint-disable-next-line camelcase
      access_token: user.accessToken,
    })

    accessCalendar(oauth2Client, (events) => {
      events = events.map((event) => {
        event = {
          ...event,
          title: event.summary,
          start: new Date(event.start.dateTime.toString()),
          startTimeZone: event.start.timeZone,
          end: new Date(event.end.dateTime.toString()),
          endTimeZone: event.end.timeZone,
        }
        return event
      })
      const data = {
        user,
        events,
      }
      res.json(data)
    })
  }
})

router.use('/google', require('./google'))
