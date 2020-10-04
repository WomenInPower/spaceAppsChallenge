import React from 'react'

import {Navbar} from './components'
import Routes from './routes'

const App = () => {
  // Google Calendar API

  // Initializing all of the variables
  const gapi = window.gapi
  const CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID
  const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
  console.log('process.env keys: ' + Object.keys(process.env))

  // Array of API discovery doc URLs for APIs used by the quickstart
  const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ]
  // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

  // function that handles whenever we click on a "add event to my calendar" type of button
  const handleClick = async () => {
    gapi.load('client:auth2', async () => {
      console.log('loaded client')
      console.log('clientID: ', CLIENT_ID) // -> checks
      console.log('API key, ', API_KEY)
      console.log('scopes: ', SCOPES) // -> checks

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () =>
        console.log('loaded the calendar API')
      )

      await gapi.auth2.getAuthInstance().signIn()

      const event = {
        summary: 'Google I/O 2015',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
          dateTime: '2020-10-03T09:00:00-07:00',
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: '2020-10-03T17:00:00-07:00',
          timeZone: 'America/Los_Angeles',
        },
        recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [{email: 'lpage@example.com'}, {email: 'sbrin@example.com'}],
        reminders: {
          useDefault: false,
          overrides: [
            {method: 'email', minutes: 24 * 60},
            {method: 'popup', minutes: 10},
          ],
        },
      }

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      })

      request.execute((event) => {
        console.log('inside the execute request')
        console.log(
          'After inserting event, this gets added to the calendar: ',
          event
        )
        window.open(event.htmlLink)
      })
    })
  }

  return (
    <div>
      <Navbar />
      <Routes />
      <button onClick={handleClick}> Add event to your Google Calendar</button>
    </div>
  )
}

export default App
