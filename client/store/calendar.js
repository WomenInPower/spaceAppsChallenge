/* eslint-disable complexity */
import moment from 'moment-timezone'
import {
  gapi,
  CLIENT_ID,
  API_KEY,
  DISCOVERY_DOCS,
  SCOPES,
} from '../components/calendar-add'

// Initializing all of the variables
/* const gapi = window.gapi
const CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
console.log('process.env keys: ' + Object.keys(process.env))

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
]
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.events' */

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'
const GET_SLEEP_EVENTS = 'GET_SLEEP_EVENTS'

/**
 * INITIAL STATE
 */
const defaultEvents = []

/**
 * ACTION CREATORS
 */
const getEvents = (events) => ({type: GET_EVENTS, events})
const getSleepEvents = (events) => ({type: GET_SLEEP_EVENTS, events})

/**
 * THUNK CREATORS
 */
export const loadEvents = () => (dispatch) => {
  gapi.load('client:auth2', async () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    gapi.client.load('calendar', 'v3', () => {})

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
  })
}

export const generateSleepEvents = (events) => (dispatch) => {
  const sleepEvents = numbersToEvents(events)
  dispatch(getSleepEvents(sleepEvents || defaultEvents))
}

export const addSleepEvent = (sleepEvent) => {
  const request = gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: sleepEvent,
  })
  request.execute()
}

/**
 * REDUCER
 */
export default function (state = defaultEvents, action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events
    case GET_SLEEP_EVENTS:
      return action.events
    default:
      return state
  }
}

function sleepShift(events) {
  let map = UTCToNumbers(events)
  console.log(map)
  let sleepEvents = {nap: [], fullCycle: []}
  let fullCycleOptions = []
  let napOptions = []

  // iterate through the time array in the map
  if (Math.abs(0 - map.time[0]) >= 10) fullCycleOptions.push(0, 8)

  for (let i = 0; i < map.time.length; i++) {
    // if times are the same and the respective dates aren't, they are overnight events
    if (map.dates[i] !== map.dates[i + 1] && map.time[i] === map.time[i + 1]) {
      // then add 24 hours to the end hour
      map.time[i + 1] += 24
    }
    if (
      map.time[i + 1] - map.time[i] <= 8 &&
      map.time[i + 1] - map.time[i] > 0
    ) {
      napOptions.push(
        map.time[i],
        map.time[i] + (map.time[i + 1] - map.time[i])
      )
    } else if (map.time[i + 1] - map.time[i] >= 8) {
      fullCycleOptions.push(map.time[i], Math.abs(24 - (map.time[i] + 8)))
    }
  }
  sleepEvents.nap = napOptions
  sleepEvents.fullCycle = fullCycleOptions
  return sleepEvents
}

// covert all the timestamp to numbers for calculations
function UTCToNumbers(events) {
  let map = {dates: [], time: []}
  events.forEach((event) => {
    let startDate = moment.tz(event.start.dateTime, event.start.timeZone).date()
    let endDate = moment.tz(event.end.dateTime, event.end.timeZone).date()
    // console.log('startDate:', startDate, 'endDate:', endDate)

    let startHour = moment
      .tz(event.start.dateTime, event.start.timeZone)
      .hours()
    let endHour = moment.tz(event.end.dateTime, event.end.timeZone).hours()
    // console.log('startHour:', startHour, 'endHour:', endHour)

    map.dates.push(startDate, endDate)
    map.time.push(startHour, endHour)
  })

  return map
}

// then convert the hour back to Google calendar timestamp, map timestamp to sleepEvent
function numbersToEvents(events) {
  let sleepOptions = []
  let sleepEvents = sleepShift(events)
  console.log('sleepEvents:', sleepEvents)

  for (let i = 0; i < sleepEvents.nap.length; i++) {
    let nap = {summary: 'nap', start: {}, end: {}}
    nap.start.dateTime = moment().set('hour', sleepEvents.nap[i]).format()
    if (sleepEvents.nap[i + 1]) {
      nap.end.dateTime = moment()
        .set('hour', sleepEvents.nap[i + 1])
        .format()
    }
    if (i % 2) continue
    sleepOptions.push(nap)
  }
  for (let i = 0; i < sleepEvents.fullCycle.length; i++) {
    let sleep = {summary: 'sleep', start: {}, end: {}}
    sleep.start.dateTime = moment()
      .set('hour', sleepEvents.fullCycle[i])
      .format()
    if (
      sleepEvents.fullCycle[i + 1] &&
      sleepEvents.fullCycle[i + 1] < sleepEvents.fullCycle[i]
    ) {
      sleep.end.dateTime = moment()
        .set('hour', sleepEvents.fullCycle[i + 1])
        .add(1, 'd')
        .format()
    } else if (sleepEvents.fullCycle[i + 1]) {
      sleep.end.dateTime = moment()
        .set('hour', sleepEvents.fullCycle[i + 1])
        .format()
    }
    if (i % 2) continue
    sleepOptions.push(sleep)
  }
  return sleepOptions
}
