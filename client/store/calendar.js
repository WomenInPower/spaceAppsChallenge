// import moment from 'moment-timezone'
// import axios from 'axios'
// import history from '../history'

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

/* dummy data
const events = [
  {
    summary: 'Flight',
    location: 'NASA, Houston, TX',
    description: 'Flight from Houston to Florida',
    start: {
      dateTime: '2020-10-03T09:00:00-07:00',
      timeZone: 'America/Houston',
    },
    end: {
      dateTime: '2020-10-03T12:00:00-07:00',
      timeZone: 'America/Florida',
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: [{ email: 'lpage@example.com' }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  },
  {
    summary: 'Launch',
    location: 'Florida Rocket Launch Site',
    description: 'Lanuch from Rocket Launch Site to ISS, duration is 24 hours',
    start: {
      dateTime: '2020-10-03T015:00:00-07:00',
      timeZone: 'America/Houston',
    },
    end: {
      dateTime: '2020-10-04T15:00:00-07:00',
      timeZone: 0,
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: [{ email: 'lpage@example.com' }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  },
]
*/

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'

/**
 * INITIAL STATE
 */
const defaultEvents = []

/**
 * ACTION CREATORS
 */
const getEvents = (events) => ({type: GET_EVENTS, events})

/**
 * THUNK CREATORS
 */
export const loadEvents = () => async (dispatch) => {
  try {
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
    gapi.client.calendar.events.get({}).then((response) => {
      const events = response.result.items
      dispatch(getEvents(events || defaultEvents))
      console.log('EVENTS: ', events)
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultEvents, action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events
    default:
      return state
  }
}
