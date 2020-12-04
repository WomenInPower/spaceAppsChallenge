/* eslint-disable complexity */
import axios from 'axios'
/**
 * ACTION TYPES
 */
const INSERT_EVENT = 'INSERT_EVENT'
const GET_EVENTS = 'GET_EVENTS'
const DELETE_EVENT = 'DELETE_EVENT'
const UPDATE_EVENT = 'UPDATE_EVENT'
/**
 * INITIAL STATE
 */
const defaultEvents = []

/**
 * ACTION CREATORS
 */
const insertEvent = (event) => ({type: INSERT_EVENT, event})
const getEvents = (events) => ({type: GET_EVENTS, events})
const deleteEvent = (id) => ({type: DELETE_EVENT, id})
const updateEvent = (id, event) => ({type: UPDATE_EVENT, id, event})
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
export const removeEvent = (id) => async (dispatch) => {
  try {
    await axios.delete('/auth/event', id)
    dispatch(deleteEvent(id || defaultEvents))
  } catch (e) {
    console.log(e)
  }
}
export const putEvent = (event) => async (dispatch) => {
  try {
    const res = await axios.put('/auth/event', event)
    dispatch(updateEvent(res.data || defaultEvents))
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
    case DELETE_EVENT:
      return state.filter((event) => event.id !== action.id)
    case UPDATE_EVENT:
      return state.forEach((event) => {
        if (event.id === action.id) event = action.event
      })
    default:
      return state
  }
}
