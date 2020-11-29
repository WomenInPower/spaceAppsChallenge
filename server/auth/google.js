//const passport = require('passport')
const router = require('express').Router()
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const {User} = require('../db/models')
const {google} = require('googleapis')
/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK
  )

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'profile',
    'email',
  ]

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline'(gets refresh_token)
    // eslint-disable-next-line camelcase
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  })

  const authenticate = async function (code, done) {
    try {
      const user = await google.oauth2({version: 'v2', auth: oauth2Client})
      const {tokens} = await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens)

      user.userinfo.get(async (err, res) => {
        if (err) {
          console.log(err)
        } else {
          const googleId = res.data.id
          const accessToken = tokens.access_token
          const email = res.data.email
          const firstName = res.data.given_name
          const lastName = res.data.family_name

          const profile = {googleId, accessToken, email, firstName, lastName}
          console.log(profile)

          await User.findOrCreate({
            where: {googleId},
            defaults: {email, firstName, lastName},
          })
          done(null, profile)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  /*
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  module.exports.accessCalendar = async (auth, done) => {
    try {
      const calendar = google.calendar({version: 'v3', auth})
      let response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      let events = response.data.items
      console.log('EVENTS(backend): ', events)
      if (events.length) {
        done(events)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // redirect to google sign in page
  router.get('/', (req, res) => {
    res.redirect(url)
  })

  router.get('/callback', async (req, res, next) => {
    try {
      const {code} = req.query
      await authenticate(code, (err, res) => {
        if (err) {
          res.redirect('/login')
        } else {
          // this part is not loggin in
          req.session.user = res
        }
      })
      res.redirect('/home')
    } catch (err) {
      next(err)
    }
  })

  module.exports = router
}

/*
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {
  const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  }

  const strategy = new GoogleStrategy(
    googleConfig,
    (token, refreshToken, profile, done) => {
      const googleId = profile.id
      const email = profile.emails[0].value
      const firstName = profile.name.givenName
      const lastName = profile.name.familyName

      User.findOrCreate({
        where: {googleId},
        defaults: {email, firstName, lastName},
      })
        .then(([user]) => done(null, user))
        .catch(done)
    }
  )

  passport.use(strategy)

  router.get(
    '/',
    passport.authenticate('google', {
      scope: ['email', 'profile'],
    })
  )

  router.get(
    '/callback',
    passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/login',
    })
  )
} */
