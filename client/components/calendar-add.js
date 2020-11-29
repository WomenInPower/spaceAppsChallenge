import React, {Component} from 'react'
import Modal from 'styled-react-modal'
import {connect} from 'react-redux'
import SleepShiftSchedule from './sleepAlgorithm'
import moment from 'moment'

/*export const gapi = window.gapi
export const CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID
export const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY
// Array of API discovery doc URLs for APIs used by the quickstart
export const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
]
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
export const SCOPES = 'https://www.googleapis.com/auth/calendar.events'*/

const StyledModal = Modal.styled`
  width: 400px;
  height: 500px;
  display: flex;
  color: black;
  padding: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  opacity: 85%;
  overlfow-y: auto;
`

class AddToCalendar extends Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
      sleepEvents: [],
    }
    this.handleClick = this.handleClick.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({showModal: true})
    let sleepShiftSchedule = new SleepShiftSchedule(this.props.events)
    sleepShiftSchedule.utcToNumbers()
    sleepShiftSchedule.sleepShift()
    const sleepEvents = sleepShiftSchedule.numbersToEvents()

    this.setState({sleepEvents})
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
    const {sleepEvents} = this.state

    return (
      <div>
        <input
          type="image"
          src="images/sleep.png"
          border="0"
          alt="Submit"
          onClick={this.openModal}
        />

        <StyledModal
          isOpen={this.state.showModal}
          onBackgroundClick={this.closeModal}
          onEscapeKeydown={this.closeModal}
        >
          {sleepEvents &&
            sleepEvents.map((sleepEvent, i) => {
              const zStart = moment(sleepEvent.start.dateTime).format('LLLL')
              const zEnd = moment(sleepEvent.end.dateTime).format('LLLL')

              return (
                <div key={i}>
                  <p>Zzzzz:</p>
                  From {zStart} to {zEnd}
                  <p>
                    <button
                      type="button"
                      onClick={() => this.handleClick(sleepEvent)}
                    >
                      Add to Calendar
                    </button>
                  </p>
                </div>
              )
            })}
          <p>
            <button type="button" onClick={this.closeModal}>
              Done
            </button>
          </p>
        </StyledModal>
      </div>
    )
  }
}

const mapState = ({events}) => ({events})

export default connect(mapState)(AddToCalendar)
