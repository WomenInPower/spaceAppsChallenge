const moment = require('moment-timezone')

//Astronauts have to adjust their sleep schedule based on their mission schedule which can take a max of 3 days(72 hours), starting with flight from Houston to the launch site(either Russian or Florida), launching rocket and docking to ISS. Assuming after dock, there's one day to adjust their sleep schedule on ISS. Given a list of events, return an array of Google Calendar event (object) that contains possible time of a full 8-hour sleep cycle and nap time in a 48-hour period. They can also sleep on the plane. Use military time.

// 48 hours timeline
// houston to russia - 13 hours
// houston to florida - 3 hours
// earth to ISS - 24 hours

export default class SleepShiftSchedule {
  constructor(events) {
    this.events = events
    this.eventSet = new Set()
    this.unoccupied = new Map()
    this.sleepOptions = []
  }
  // covert all the Google Calendar timestamp to numbers for calculations
  utcToNumbers() {
    this.events.forEach((event) => {
      let summary = event.summary

      let startDate = moment.tz(event.start, event.startTimeZone).date()
      let endDate = moment.tz(event.end, event.endTimeZone).date()

      let startHour = moment.tz(event.start, event.startTimeZone).hours()
      let endHour = moment.tz(event.end, event.endTimeZone).hours()

      this.eventSet.add([summary, startDate, endDate, startHour, endHour])
    })
  }

  // eslint-disable-next-line complexity
  sleepShift() {
    // to make matters simple, any occupied event won't be used for sleeping
    let eventSet = Array.from(this.eventSet)
    for (let i = eventSet.length - 1; i >= 0; i--) {
      let summary = eventSet[i][0].toLowerCase()
      // case 1 takes care of flights, both short and long distant flights
      if (
        summary.includes('flight') &&
        eventSet[i][1] === eventSet[i][2] &&
        eventSet[i][4] - eventSet[i][3] >= 3
      ) {
        this.unoccupied.set(eventSet[i][3], eventSet[i][4] - eventSet[i][3])
      } else if (
        summary.includes('flight') &&
        eventSet[i][1] !== eventSet[i][2] &&
        eventSet[i][4] + 24 - eventSet[i][3] >= 3
      ) {
        this.unoccupied.set(
          eventSet[i][3],
          eventSet[i][4] + 24 - eventSet[i][3]
        )
      }
      // case 2 takes care of unoccupied time between events
      if (eventSet[i - 1] && eventSet[i][3] - eventSet[i - 1][4] >= 3) {
        this.unoccupied.set(
          eventSet[i - 1][4],
          eventSet[i][3] - eventSet[i - 1][4]
        )
      }
    }
  }

  // then convert the hour back to Google calendar timestamp, map timestamp to sleepEvent Object that can be posted on Google Calendar
  numbersToEvents() {
    for (let [key, value] of this.unoccupied) {
      let z = {summary: 'Zzzzz', start: {}, end: {}}
      z.start.dateTime = moment().set('hour', key).format()
      z.end.dateTime = moment()
        .set('hour', key + value)
        .format()
      this.sleepOptions.push(z)
    }

    return this.sleepOptions.slice(0, 3)
  }
}
