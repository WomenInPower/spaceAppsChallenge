import React, {Component} from 'react'
import ReactModal from 'react-modal'
import {connect} from 'react-redux'
import {addSleepEvent, generateSleepEvents, loadEvents} from '../store/calendar'

export const gapi = window.gapi
export const CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID
export const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
console.log('process.env keys: ' + Object.keys(process.env))

// Array of API discovery doc URLs for APIs used by the quickstart
export const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
]
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
export const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

class AddToCalendar extends Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.openModal = this.openModal.bind(this)
  }
  componentDidMount() {
    loadEvents()
    ReactModal.setAppElement('body')
  }

  openModal() {
    this.setState({showModal: true})
    this.props.generateSleepEvents(this.props.events)
  }

  handleClick(sleepEvent) {
    this.props.addSleepEvent(sleepEvent)
  }

  render() {
    const {events} = this.props
    console.log(this.props)

    return (
      <div>
        <input
          type="image"
          src="images/sleep.png"
          border="0"
          alt="Submit"
          onClick={() => this.openModal()}
        />

        <ReactModal className="popup" isOpen={this.state.showModal}>
          {events.map((sleepEvent, i) => (
            <div key={i}>
              From {sleepEvent.start.dateTime}
              to {sleepEvent.end.dateTime}
              <button
                type="button"
                onClick={(sleepEvent) => this.handleClick(sleepEvent)}
              >
                Add to Calendar
              </button>
            </div>
          ))}
          <button type="button" onClick={this.closeModal}>
            Done
          </button>
        </ReactModal>
      </div>
    )
  }
}

const mapState = ({events}) => ({events})
const mapDispatch = {generateSleepEvents, loadEvents, addSleepEvent}

export default connect(mapState, mapDispatch)(AddToCalendar)
