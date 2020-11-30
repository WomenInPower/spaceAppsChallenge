import React, {Component} from 'react'
import Modal from 'styled-react-modal'
import {connect} from 'react-redux'
import SleepShiftSchedule from './sleepAlgorithm'
import moment from 'moment'

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
    let sleepShiftSchedule = new SleepShiftSchedule(this.props.user.events)
    sleepShiftSchedule.utcToNumbers()
    sleepShiftSchedule.sleepShift()
    const sleepEvents = sleepShiftSchedule.numbersToEvents()

    this.setState({sleepEvents})
  }

  closeModal() {
    this.setState({showModal: false})
  }
  // this needs to be done in the backend, insert
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

const mapState = ({user}) => ({user})
export default connect(mapState)(AddToCalendar)
