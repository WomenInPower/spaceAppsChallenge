/* eslint-disable complexity */
import axios from 'axios'
/**
 * ACTION TYPES
 */
const INSERT_EVENT = 'INSERT_EVENT'
const GET_EVENTS = 'GET_EVENTS'
/**
 * INITIAL STATE
 */
const defaultEvents = []

/**
 * ACTION CREATORS
 */
const insertEvent = (event) => ({type: INSERT_EVENT, event})
const getEvents = (events) => ({type: GET_EVENTS, events})
/**
 * THUNK CREATORS
 */

// need to create CRUD thunks, insert, delete, edit
export const addEvent = (event) => async (dispatch) => {
  try {
    const res = await axios.post('/auth/event', event)
    //console.log(res.data)
    dispatch(insertEvent(res.data || defaultEvents))
  } catch (e) {
    console.log(e)
  }
}

export const loadEvents = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/events')
    //console.log(res.data)
    dispatch(getEvents(res.data || defaultEvents))
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
    case INSERT_EVENT:
      return [...state, action.event]
    default:
      return state
  }
}
