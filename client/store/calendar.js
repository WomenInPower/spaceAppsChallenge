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
    gapi.load('client:auth2', async () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => {})

      await gapi.auth2.getAuthInstance().signIn()

      let sleepEvent
      // get all events of the calendar in the developer console
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })

      const events = response.result.items
      dispatch(getEvents(events || defaultEvents))
      sleepEvent = sleepShift(events)
      console.log('EVENTS: ', events)

      console.log(sleepEvent)
      // Inserts the event (hard coded for now) to the authorized calendar
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: sleepEvent,
      })
      // Opens new tab with Google Calendar (might not need since we embedded)
      request.execute((event) => {
        window.open(event.htmlLink)
      })
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
