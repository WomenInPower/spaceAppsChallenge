import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <img src="images/power.png" align="left" />
    {/* <h1>power sleep</h1> */}
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <a href="/home">
            <img src="images/home.png" />
          </a>
          <a href="/howto">
            <img src="images/howto.png" />
          </a>
          <a href="/about">
            <img src="images/about.png" />
          </a>
          <a href="#" onClick={handleClick}>
            <img src="images/logout.png" />
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <a href="/home">
            <img src="images/home.png" />
          </a>
          <a href="/howto">
            <img src="images/howto.png" />
          </a>
          <a href="/about">
            <img src="images/about.png" />
          </a>
          <a href="/login">
            <img src="images/login.png" />
          </a>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout())
    },
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
