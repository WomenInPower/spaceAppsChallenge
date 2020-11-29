/* eslint-disable complexity */
import axios from 'axios'
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
    const events = await axios.get('/auth/google/calendar')
    console.log(events.data)
    dispatch(getEvents(events.data || defaultEvents))
  } catch (e) {
    console.log(e)
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
/*
import {
  gapi,
  CLIENT_ID,
  API_KEY,
  DISCOVERY_DOCS,
  SCOPES,
} from '../components/calendar-add'

  gapi.load('client:auth2', async () => {
    try {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      //await gapi.auth2.getAuthInstance().signIn()
      gapi.client.load('calendar', 'v3', () => { })

      // get all events of the calendar in the developer console
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      let events = response.result.items
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
      console.log('EVENTS: ', events)*/
