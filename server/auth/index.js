const router = require('express').Router()
const {google} = require('googleapis')
module.exports = router

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

/*
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
router.get('/me', (req, res, next) => {
  try {
    const {user} = req.session
    //console.log(user)
    //take out accessTaken before sending back
    if (user) {
      const filtered = Object.keys(user).filter((key) => key !== 'accessToken')
      const filteredUser = filtered.reduce((obj, key) => {
        obj[key] = user[key]
        return obj
      }, {})
      // console.log(filteredUser)
      res.json(filteredUser)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/events', async (req, res, next) => {
  try {
    const {user} = req.session
    if (user) {
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({
        // eslint-disable-next-line camelcase
        access_token: user.accessToken,
      })
      const calendar = google.calendar({version: 'v3', auth: oauth2Client})
      let response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      const events = response.data.items
      console.log('EVENTS: ', events)
      res.json(events)
    }
  } catch (e) {
    next(e)
  }
})

router.post('/event', async (req, res, next) => {
  try {
    const {user} = req.session
    if (user) {
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({
        // eslint-disable-next-line camelcase
        access_token: user.accessToken,
      })
      const calendar = google.calendar({version: 'v3', auth: oauth2Client})
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: req.body,
      })
      //console.log(response.data)
      const event = response.data
      res.json(event)
    }
  } catch (e) {
    next(e)
  }
})

router.put('/event', async (req, res, next) => {
  try {
    const {user} = req.session
    const eventId = req.body.id
    if (user) {
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({
        // eslint-disable-next-line camelcase
        access_token: user.accessToken,
      })
      const calendar = google.calendar({version: 'v3', auth: oauth2Client})
      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId,
      })

      const updated = await calendar.events.update({
        calendarId: 'primary',
        eventId: response.data.id,
        resource: req.body,
      })

      res.json(updated)
    }
  } catch (e) {
    next(e)
  }
})

router.delete('/event', async (req, res, next) => {
  try {
    const {user} = req.session
    const eventId = req.body
    if (user) {
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({
        // eslint-disable-next-line camelcase
        access_token: user.accessToken,
      })
      const calendar = google.calendar({version: 'v3', auth: oauth2Client})
      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
      })
      res.status(204)
    }
  } catch (e) {
    next(e)
  }
})

router.use('/google', require('./google'))
