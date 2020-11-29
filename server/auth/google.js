const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const {User} = require('../db/models')
const {google} = require('googleapis')
const credentials = require('./powersleep-1601738465065-4e4f4dc98a75.json')
module.exports = router

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
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.settings.readonly',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    'https://www.googleapis.com/auth/calendar.events.public.readonly',
    'https://www.googleapis.com/auth/calendar.freebusy',
  ]
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    scopes
  )

  router.get('/calendar', async (req, res, next) => {
    try {
      /*
       * Lists the next 10 events on the user's primary calendar.
       * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
       */
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
      if (events.length) {
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
      }
      console.log('EVENTS(backend): ', events)
      res.json(events)
    } catch (err) {
      next(err)
    }
  })
}
