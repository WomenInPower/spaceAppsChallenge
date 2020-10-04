// import moment from 'moment-timezone'
// import axios from 'axios'
// import history from '../history'

// dummy data
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
    attendees: [{email: 'lpage@example.com'}],
    reminders: {
      useDefault: false,
      overrides: [
        {method: 'email', minutes: 24 * 60},
        {method: 'popup', minutes: 10},
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
    attendees: [{email: 'lpage@example.com'}],
    reminders: {
      useDefault: false,
      overrides: [
        {method: 'email', minutes: 24 * 60},
        {method: 'popup', minutes: 10},
      ],
    },
  },
]

/**
 * ACTION TYPES
 */
const GET_EVENT = 'GET_EVENT'

/**
 * INITIAL STATE
 */
const defaultEvent = {}

/**
 * ACTION CREATORS
 */
const getEvent = (event) => ({type: GET_EVENT, event})

/**
 * THUNK CREATORS
 */
export const loadEvent = () => async (dispatch) => {
  try {
    // const events = service.events().get(calendarId='primary', eventId='eventId').execute()
    const sleepEvent = sleepShift(events)

    dispatch(getEvent(sleepEvent || defaultEvent))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultEvent, action) {
  switch (action.type) {
    case GET_EVENT:
      return action.event
    default:
      return state
  }
}

function sleepShift(events) {
  let sleepEvent = {Summary: 'Sleep'}
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
