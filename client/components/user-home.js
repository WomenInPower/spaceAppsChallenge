import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import AddToCalendar from './calendar-add'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
// import 'react-big-calendar/lib/sass/styles';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles';
// a localizer for BigCalendar
const localizer = momentLocalizer(moment)
import {loadEvents} from '../store'

/**
 * COMPONENT
 */
export class UserHome extends Component {
  async componentDidMount() {
    await this.props.loadEvents()
  }

  render() {
    const {firstName} = this.props.user
    let {events} = this.props
    //convert data structure to map on React Calendar
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
    //console.log('Events in React Component: ', events)

    return (
      <div>
        <h3>Welcome, {firstName}!</h3>
        {events && (
          <Calendar
            //showMultiDayTimes
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
const mapState = ({user, events}) => ({user, events})
const mapDispatch = (dispatch) => {
  return {
    loadEvents() {
      dispatch(loadEvents())
    },
  }
}
export default connect(mapState, mapDispatch)(UserHome)
