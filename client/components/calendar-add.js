import React, {Component} from 'react'
import ReactModal from 'react-modal'
import {connect} from 'react-redux'
import {generateSleepEvents, loadEvents} from '../store/calendar'

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
    this.closeModal = this.closeModal.bind(this)
  }
  componentDidMount() {
    this.props.loadEvents()
    ReactModal.setAppElement('body')
  }

  openModal() {
    this.setState({showModal: true})
    this.props.generateSleepEvents(this.props.events)
  }
  closeModal() {
    this.setState({showModal: false})
  }

  handleClick(sleepEvent) {
    const request = gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: sleepEvent,
    })
    request.execute()
  }

  render() {
    const {events} = this.props
    return (
      <div>
        <input
          type="image"
          src="images/sleep.png"
          border="0"
          alt="Submit"
          onClick={this.openModal}
        />

        <ReactModal className="modal-content" isOpen={this.state.showModal}>
          {events.map((sleepEvent, i) => {
            return (
              <div key={i}>
                {sleepEvent.summary === 'nap' ? (
                  <div>
                    <p> Napping:</p>
                    From {sleepEvent.start.dateTime} to{' '}
                    {sleepEvent.end.dateTime}
                    <button
                      type="button"
                      onClick={() => this.handleClick(sleepEvent)}
                    >
                      Add to Calendar
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>Full 8-hour Sleep Cycle:</p>
                    From {sleepEvent.start.dateTime} to{' '}
                    {sleepEvent.end.dateTime}
                    <button
                      type="button"
                      onClick={() => this.handleClick(sleepEvent)}
                    >
                      Add to Calendar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          <p>
            <button type="button" onClick={this.closeModal}>
              Done
            </button>
          </p>
        </ReactModal>
      </div>
    )
  }
}

const mapState = ({events}) => ({events})
const mapDispatch = (dispatch) => {
  return {
    generateSleepEvents: (events) => dispatch(generateSleepEvents(events)),
    loadEvents: () => dispatch(loadEvents()),
  }
}

export default connect(mapState, mapDispatch)(AddToCalendar)
