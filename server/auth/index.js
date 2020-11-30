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
router.get('/me', async (req, res, next) => {
  try {
    const {user} = req.session
    //console.log(user)
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
      user.events = response.data.items
      console.log('EVENTS: ', user.events)
      //take out accessTaken before sending back
      res.json(user)
    }
  } catch (err) {
    next(err)
  }
})

router.use('/google', require('./google'))
