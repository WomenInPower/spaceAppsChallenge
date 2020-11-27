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
      let startDate = moment
        .tz(event.start.dateTime, event.start.timeZone)
        .date()
      let endDate = moment.tz(event.end.dateTime, event.end.timeZone).date()
      // console.log('startDate:', startDate, 'endDate:', endDate)

      let startHour = moment
        .tz(event.start.dateTime, event.start.timeZone)
        .hours()
      let endHour = moment.tz(event.end.dateTime, event.end.timeZone).hours()
      // console.log('startHour:', startHour, 'endHour:', endHour)
      this.eventSet.add([startDate, endDate, startHour, endHour])
    })
  }

  sleepShift() {
    // to make matters simple, any occupied event won't be used for sleeping
    let eventSet = Array.from(this.eventSet)
    console.log(eventSet)
    for (let i = eventSet.length - 1; i >= 0; i--) {
      if (eventSet[i - 1] && eventSet[i][2] - eventSet[i - 1][3] >= 3) {
        this.unoccupied.set(
          eventSet[i - 1][3],
          eventSet[i][2] - eventSet[i - 1][3]
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

    return this.sleepOptions
  }
}
