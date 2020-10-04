import React from 'react'

import { Navbar } from './components'
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
        summary: 'NASA Hackathon',
        location: 'Virtual, anywhere in the world',
        description: 'Leave your print in the future of space exploration!',
        start: {
          dateTime: '2020-10-03T09:00:00-05:00',
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: '2020-10-04T23:59:00-05:00',
          timeZone: 'America/NewYork',
        },
        recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
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

      // get events
      gapi.client.calendar.events
        .list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        })
        .then((response) => {
          const events = response.result.items
          console.log('EVENTS: ', events)
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
