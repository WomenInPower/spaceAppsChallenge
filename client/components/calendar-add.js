import React from 'react'
import moment from 'moment-timezone'

// Google Calendar API
const AddToCalendar = () => {
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
    let sleepEvent = {summary: 'Sleep', start: {}, end: {}}
    events.forEach((event) => {
      // if the event is flight on earth
      if (event.summary === 'Flight Houston-Florida') {
        let startDate = moment
          .tz(event.start.dateTime, event.start.timeZone)
          .date()
        let endDate = moment.tz(event.end.dateTime, event.end.timeZone).date()
        console.log('startDate:', startDate, 'endDate:', endDate)

        let startTime = moment
          .tz(event.start.dateTime, event.start.timeZone)
          .hours()
        let endTime = moment.tz(event.end.dateTime, event.end.timeZone).hours()
        console.log('startTime:', startTime, 'endTime:', endTime)
        // if the event is not overnight
        if (startDate === endDate) {
          let emptyBlock = 24 - (endTime - startTime + 4)
          console.log('Empty Time Block:', emptyBlock)
          let start
          let end
          let poss1 = Math.abs(0 - (startTime - 2))
          let poss2 = Math.abs(23 - startTime)
          console.log(
            'Possible SleepHour 1:',
            poss1,
            'Possible SleepHour 2:',
            poss2
          )
          const hourToStartSleep = poss1 < poss2 ? startTime : 0
          console.log('Sleep at:', hourToStartSleep)
          const hourToEndSleep = hourToStartSleep + 8
          console.log('Wake up at:', hourToEndSleep)
          // then convert the hour back to Google calendar timestamp format using moment.js
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
          sleepEvent.start.dateTime = start
          sleepEvent.end.dateTime = end
        }
      }
    })
    return sleepEvent
  }

  // function that handles whenever we click on a "add event to my calendar" type of button
  const handleClick = () => {
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
          console.log(sleepEvent)
          console.log('EVENTS: ', events)
        })

      console.log(sleepEvent)
      // Inserts the event (hard coded for now) to the authorized calendar
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: sleepEvent,
      })
    })
  }

  return (
    <div>
      <input
        type="image"
        src="images/sleep.png"
        border="0"
        alt="Submit"
        onClick={handleClick}
      />
    </div>
  )
}

export default AddToCalendar
