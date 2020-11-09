/* eslint-disable complexity */
import {
  gapi,
  CLIENT_ID,
  API_KEY,
  DISCOVERY_DOCS,
  SCOPES,
} from '../components/calendar-add'

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
export const loadEvents = () => (dispatch) => {
  gapi.load('client:auth2', async () => {
    try {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      gapi.client.load('calendar', 'v3', () => {})
      await gapi.auth2.getAuthInstance().signIn()

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
      console.log('EVENTS: ', events)
      dispatch(getEvents(events || defaultEvents))
    } catch (e) {
      console.log(e)
    }
  })
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
