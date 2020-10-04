import React from 'react'
import {connect} from 'react-redux'
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

  function sleepShift(events) {
    let sleepEvent = {Summary: 'Sleep'}
    // get events
    events.forEach((event) => {
      // if the event is flight on earth
      if (event.summary === 'Flight') {
        // we'll use moment.js to convert later
        let startDate = event.start.dateTime.slice(8, 10)
        let endDate = event.end.dateTime.slice(8, 10)
        let startTime = Number(event.start.dateTime.slice(11, 13))

        // if the event is not overnight, we can extract the dates using moment.js
        if (startDate === endDate) {
          let poss1 = Math.abs(0 - (startTime - 2))
          let poss2 = Math.abs(23 - startTime)
          const hourToStartSleep = poss1 < poss2 ? startTime : 0
          const hourToEndSleep = hourToStartSleep + 8
          // then convert the hour back to Google calendar timestamp format using moment.js later
          let start
          let end
          if (hourToStartSleep < 10) {
            start =
              event.start.dateTime.slice(0, 11) +
              '0' +
              hourToStartSleep +
              event.start.dateTime.slice(13)
          } else {
            start =
              event.start.dateTime.slice(0, 11) +
              hourToStartSleep +
              event.start.dateTime.slice(13)
          }
          if (hourToEndSleep < 10) {
            end =
              event.end.dateTime.slice(0, 11) +
              '0' +
              hourToEndSleep +
              event.end.dateTime.slice(13)
          } else {
            end =
              event.end.dateTime.slice(0, 11) +
              hourToEndSleep +
              event.end.dateTime.slice(13)
          }
          sleepEvent.start = start
          sleepEvent.end = end
          return sleepEvent
          // else if the event is overnight
        }
        // if the event is launch from earch to ISS
      }
    })
    return sleepEvent
  }

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

      let sleepEvent
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
          sleepEvent = sleepShift(events)
          console.log('EVENTS: ', events)
        })

      await gapi.auth2.getAuthInstance().signIn()

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: sleepEvent,
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
      <button onClick={handleClick}>
        {' '}
        Add Sleep Schedule to your Google Calendar
      </button>
    </div>
  )
}

const mapState = ({events}) => ({events})

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default connect(mapState)(App)

/* const event = {
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
*/
