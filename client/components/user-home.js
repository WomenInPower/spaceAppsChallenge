import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import useScript from './use-script'
import AddToCalendar from './calendar-add'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {email} = props
  useScript('https://public.tockify.com/browser/embed.js')

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <div
        data-tockify-component="calendar"
        data-tockify-calendar="powersleep"
      />
      <AddToCalendar />
    </div>
  )
}


/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
}
