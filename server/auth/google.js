const router = require('express').Router()
const db = require('../db')
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

  // redirect to google sign in page
  router.get('/', (req, res) => {
    res.redirect(url)
  })

  router.get('/callback', async (req, res, next) => {
    try {
      const {code} = req.query
      const user = await google.oauth2({version: 'v2', auth: oauth2Client})
      const {tokens} = await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens)

      const response = await user.userinfo.get()
      const googleId = response.data.id
      const accessToken = tokens.access_token
      const email = response.data.email
      const firstName = response.data.given_name
      const lastName = response.data.family_name

      const profile = {googleId, accessToken, email, firstName, lastName}
      req.session.user = profile

      // knex.select() returns an array but knex.first() returns the first single value
      const person = await db.from('user').first('*').where({googleId})

      if (!person) {
        await db('user').insert({googleId, email, firstName, lastName})
      }

      if (req.session.user) {
        res.redirect('/home')
      } else {
        res.redirect('/login')
      }
    } catch (err) {
      next(err)
    }
  })

  module.exports = router
}
