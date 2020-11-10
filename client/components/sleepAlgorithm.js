import moment from 'moment-timezone'

export function sleepShift(events) {
  let map = UTCToNumbers(events)
  // console.log(map)
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
export function UTCToNumbers(events) {
  let map = {dates: [], time: []}
  events.forEach((event) => {
    let startDate = moment.tz(event.start, event.startTimeZone).date()
    let endDate = moment.tz(event.end, event.endTimeZone).date()
    // console.log('startDate:', startDate, 'endDate:', endDate)

    let startHour = moment.tz(event.start, event.startTimeZone).hours()
    let endHour = moment.tz(event.end, event.endTimeZone).hours()
    // console.log('startHour:', startHour, 'endHour:', endHour)

    map.dates.push(startDate, endDate)
    map.time.push(startHour, endHour)
  })

  return map
}

// then convert the hour back to Google calendar timestamp, map timestamp to sleepEvent
export function numbersToEvents(events) {
  let sleepOptions = [
    {
      summary: 'nap',
      start: {
        dateTime: '2020-11-09T10:00:00-05:00',
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: '2020-11-09T12:00:00-05:00',
        timeZone: 'America/New_York',
      },
    },
    {
      summary: 'nap',
      start: {
        dateTime: '2020-11-09T14:00:00-05:00',
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: '2020-11-09T16:00:00-05:00',
        timeZone: 'America/New_York',
      },
    },
  ]
  let sleepEvents = sleepShift(events)
  // console.log('sleepEvents:', sleepEvents)

  for (let i = 0; i < sleepEvents.nap.length; i++) {
    let nap = {summary: 'nap', start: {}, end: {}}
    nap.start.dateTime = moment().set('hour', sleepEvents.nap[i]).format('LLLL')
    if (sleepEvents.nap[i + 1]) {
      nap.end.dateTime = moment()
        .set('hour', sleepEvents.nap[i + 1])
        .format('LLLL')
    }
    if (i % 2) continue
    sleepOptions.push(nap)
  }
  for (let i = 0; i < sleepEvents.fullCycle.length; i++) {
    let sleep = {summary: 'sleep', start: {}, end: {}}
    sleep.start.dateTime = moment()
      .set('hour', sleepEvents.fullCycle[i])
      .format('LLLL')
    if (
      sleepEvents.fullCycle[i + 1] &&
      sleepEvents.fullCycle[i + 1] < sleepEvents.fullCycle[i]
    ) {
      sleep.end.dateTime = moment()
        .set('hour', sleepEvents.fullCycle[i + 1])
        .add(1, 'd')
        .format('LLLL')
    } else if (sleepEvents.fullCycle[i + 1]) {
      sleep.end.dateTime = moment()
        .set('hour', sleepEvents.fullCycle[i + 1])
        .format('LLLL')
    }
    if (i % 2) continue
    sleepOptions.push(sleep)
  }
  // console.log('sleepOptions:', sleepOptions)
  return sleepOptions.slice(0, 3)
}
