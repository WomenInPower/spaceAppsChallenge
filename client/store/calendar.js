/* eslint-disable complexity */
import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS'

/**
 * INITIAL STATE
 */
const defaultEvents = []

/**
 * ACTION CREATORS
 */
const getEvents = (events) => ({type: GET_EVENTS, events})

/**
 * THUNK CREATORS
 */

// need to create CRUD thunks, insert, delete, edit
export const loadEvents = () => async (dispatch) => {
  try {
    const events = await axios.get('/auth/google/calendar')
    console.log(events.data)
    dispatch(getEvents(events.data || defaultEvents))
  } catch (e) {
    console.log(e)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultEvents, action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events
    default:
      return state
  }
}
