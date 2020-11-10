import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import AddToCalendar from './calendar-add'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {loadEvents} from '../store/calendar'
// a localizer for BigCalendar
const localizer = momentLocalizer(moment)
/**
 * COMPONENT
 */
export class UserHome extends Component {
  async componentDidMount() {
    await this.props.loadEvents()
  }
  render() {
    const {firstName, lastName, email} = this.props.user
    const {events} = this.props

    return (
      <div>
        <h3>
          Welcome, {firstName} {lastName}!
        </h3>
        {events && (
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            style={{height: 500}}
            events={events}
            defaultView="month"
            // defaultDate={new Date(moment().startOf('day'))}
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
    loadEvents: () => dispatch(loadEvents()),
  }
}
export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
}
