import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import AddToCalendar from './calendar-add'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
// a localizer for BigCalendar
const localizer = momentLocalizer(moment)

/**
 * COMPONENT
 */
export class UserHome extends Component {
  render() {
    let {firstName, events} = this.props.user
    if (events.length) {
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
    }
    console.log('Events in React Component: ', events)

    return (
      <div>
        <h3>Welcome, {firstName}!</h3>
        {events && (
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            style={{height: 500}}
            events={events}
            defaultView="month"
            defaultDate={new Date(moment().startOf('day'))}
          />
        )}
        <AddToCalendar />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = ({user}) => ({user})
export default connect(mapState)(UserHome)
